package pigpio

import (
	"net"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewPigpio(t *testing.T) {

	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	done := make(chan struct{})
	go func() {
		defer close(done)
		conn, err := listener.Accept()

		require.NoError(t, err)

		conn.Close()
		listener.Close()
	}()

	p := NewPigpio()
	assert.NotNil(t, p)
	assert.Equal(t, true, p.Connected)

	p.Close()
	assert.Equal(t, false, p.Connected)

	<-done
}

func TestSetMode(t *testing.T) {
	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	done := make(chan struct{})
	go func() {
		defer close(done)
		conn, err := listener.Accept()
		require.NoError(t, err)

		// TC 1: Succesfully set mode INPUT
		// Read the incoming data (16 bytes) and log
		data := make([]byte, 16)
		n, err := conn.Read(data)
		require.NoError(t, err)

		assert.Equal(t, 16, n)

		expectedData := []byte{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
		}
		assert.Equal(t, expectedData, data)

		// Send the response
		responseData := []byte{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
		}
		_, err = conn.Write(responseData)
		require.NoError(t, err)

		// TC 2: Unsuccesfully set mode INPUT
		n, err = conn.Read(data)
		require.NoError(t, err)

		assert.Equal(t, 16, n)
		assert.Equal(t, expectedData, data)

		responseData = []byte{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0xF0, // Negative response indicates error on pigpiod side
		}

		_, err = conn.Write(responseData)
		require.NoError(t, err)

		// Close the connection and listener

		conn.Close()
		listener.Close()
	}()

	p := NewPigpio()
	assert.NotNil(t, p)

	// TC 1: Succesfully set mode INPUT
	_, err = p.SetMode(1, INPUT)
	assert.NoError(t, err)

	// TC 2: Unsuccesfully set mode INPUT
	_, err = p.SetMode(1, INPUT)
	assert.Error(t, err)

	p.Close()

	<-done
}

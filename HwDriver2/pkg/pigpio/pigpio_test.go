package pigpio

import (
	"net"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func ListenAndReply(t *testing.T, listener net.Listener, done chan struct{}, expectedReadData [][]byte, response [][]byte) {
	defer close(done)
	conn, err := listener.Accept()

	require.NoError(t, err)

	defer listener.Close()

	require.Equal(t, len(expectedReadData), len(response))

	for i := 0; i < len(expectedReadData); i++ {
		// Read the incoming data (16 bytes) and log
		readData := make([]byte, 16)
		n, err := conn.Read(readData)

		require.NoError(t, err)

		assert.Equal(t, 16, n)
		assert.Equal(t, expectedReadData[i], readData)

		// Send the response
		_, err = conn.Write(response[i])
		require.NoError(t, err)
	}

	// Close the connection
	conn.Close()
}

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

	expectedData := [][]byte{
		// TC 1
		{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
		}}
	responseData := [][]byte{
		// TC 1
		{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0xF0, // Negative response indicates error on pigpiod side
		}}
	done := make(chan struct{})
	go ListenAndReply(t, listener, done, expectedData, responseData)

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

func TestRead(t *testing.T) {
	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	expectedData := [][]byte{
		// TC 1
		{
			0x03, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
		}}
	responseData := [][]byte{
		// TC 1
		{
			0x03, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x45, 0x00, 0x00, 0x00,
		}}
	done := make(chan struct{})
	go ListenAndReply(t, listener, done, expectedData, responseData)

	p := NewPigpio()
	assert.NotNil(t, p)

	// TC 1: Succesfully read pin 0
	value, err := p.Read(0)
	assert.NoError(t, err)
	assert.Equal(t, 69, value)

	// TC 2: Unsuccesfully read pin 70
	_, err = p.Read(70)
	if assert.Error(t, err) {
		assert.Equal(t, ErrInvalidPinNumber, err)
	}

	p.Close()

	<-done
}

func TestWrite(t *testing.T) {
	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	expectedData := [][]byte{
		// TC 1
		{
			0x04, 0x00, 0x00, 0x00, // Write command
			0x03, 0x00, 0x00, 0x00, // Pin number
			0x01, 0x00, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		},

		// TC 2
		{
			0x04, 0x00, 0x00, 0x00, // Write command
			0x07, 0x00, 0x00, 0x00, // Pin number
			0x29, 0x23, 0x00, 0x00, // Value 9001
			0x00, 0x00, 0x00, 0x00,
		}}
	responseData := [][]byte{
		// TC 1
		{
			0x03, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x07, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0xFB, 0xFF, 0xFF, 0xFF,
		}}
	done := make(chan struct{})
	go ListenAndReply(t, listener, done, expectedData, responseData)

	p := NewPigpio()
	assert.NotNil(t, p)

	// TC 1: Succesfully write 42 to pin 3
	value, err := p.Write(3, 1)
	assert.NoError(t, err)
	assert.Equal(t, 1, value)

	// TC 2: Unsuccesfully write 9001 to pin 7
	_, err = p.Write(7, 9001)
	if assert.Error(t, err) {
		assert.Equal(t, ErrBadGpioLevel, err)
	}

	// TC 3: Unsuccesfully write 9001 to pin 70
	_, err = p.Write(70, 9001)
	if assert.Error(t, err) {
		assert.Equal(t, ErrInvalidPinNumber, err)
	}

	p.Close()

	<-done
}

func TestSetPwmFrequency(t *testing.T) {
	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	expectedData := [][]byte{
		// TC 1
		{
			0x07, 0x00, 0x00, 0x00, // Write command
			0x02, 0x00, 0x00, 0x00, // Pin number
			0x10, 0x27, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		}}
	responseData := [][]byte{
		// TC 1
		{
			0x07, 0x00, 0x00, 0x00,
			0x02, 0x00, 0x00, 0x00,
			0x10, 0x27, 0x00, 0x00,
			0x10, 0x27, 0x00, 0x00,
		}}
	done := make(chan struct{})
	go ListenAndReply(t, listener, done, expectedData, responseData)

	p := NewPigpio()
	assert.NotNil(t, p)

	// TC 1: Succesfully set PWM frequency to 10000 on pin 2
	value, err := p.SetPwmFrequency(2, 10000)
	assert.NoError(t, err)
	assert.Equal(t, 10000, value)

	// TC 2: Unsuccesfully set PWM frequency to -10 on pin 7
	_, err = p.SetPwmFrequency(7, -10)
	if assert.Error(t, err) {
		assert.Equal(t, ErrNegativePwmFrequency, err)
	}

	// TC 3: Unsuccesfully set PWM frequency to 10000 on pin -1
	_, err = p.SetPwmFrequency(-1, 10000)
	if assert.Error(t, err) {
		assert.Equal(t, ErrInvalidUserPinNumber, err)
	}

	p.Close()

	<-done
}

func TestSetPwmDutyCycle(t *testing.T) {
	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	expectedData := [][]byte{
		// TC 1
		{
			0x05, 0x00, 0x00, 0x00, // Write command
			0x02, 0x00, 0x00, 0x00, // Pin number
			0xff, 0x00, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x05, 0x00, 0x00, 0x00, // Write command
			0x07, 0x00, 0x00, 0x00, // Pin number
			0xbf, 0x00, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		},
		// TC 3
		{
			0x05, 0x00, 0x00, 0x00, // Write command
			0x04, 0x00, 0x00, 0x00, // Pin number
			0x2c, 0x01, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		},
	}
	responseData := [][]byte{
		// TC 1
		{
			0x05, 0x00, 0x00, 0x00,
			0x02, 0x00, 0x00, 0x00,
			0xff, 0x00, 0x00, 0x00,
			0xff, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x05, 0x00, 0x00, 0x00,
			0x07, 0x00, 0x00, 0x00,
			0xbf, 0x00, 0x00, 0x00,
			0xbf, 0x00, 0x00, 0x00,
		},
		// TC 3
		{
			0x05, 0x00, 0x00, 0x00,
			0x02, 0x00, 0x00, 0x00,
			0x2c, 0x01, 0x00, 0x00,
			0xf8, 0xff, 0xff, 0xff,
		},
	}
	done := make(chan struct{})
	go ListenAndReply(t, listener, done, expectedData, responseData)

	p := NewPigpio()
	assert.NotNil(t, p)

	// TC 1: Succesfully set PWM dc to full on pin 2
	value, err := p.SetPwmDutyCycle(2, 255)
	assert.NoError(t, err)
	assert.Equal(t, 255, value)

	// TC 2: Successfully set PWM dc to 3/4 on pin 7
	value, err = p.SetPwmDutyCycle(7, 191)
	assert.NoError(t, err)
	assert.Equal(t, 191, value)

	// TC 3: Unsuccesfully set PWM dc to 300 on pin 4
	_, err = p.SetPwmDutyCycle(4, 300)
	if assert.Error(t, err) {
		assert.Equal(t, ErrBadPwmDutyCycle, err)
	}

	// TC 4: Unsuccesfully set PWM dc to 100 on pin 70
	_, err = p.SetPwmDutyCycle(70, 100)
	if assert.Error(t, err) {
		assert.Equal(t, ErrInvalidUserPinNumber, err)
	}

	p.Close()

	<-done
}

func TestGetPwmDutyCycle(t *testing.T) {
	// Mock the pigpio server
	listener, err := net.Listen("tcp", "localhost:8888")
	require.NoError(t, err)

	expectedData := [][]byte{
		// TC 1
		{
			0x53, 0x00, 0x00, 0x00, // Write command
			0x02, 0x00, 0x00, 0x00, // Pin number
			0x00, 0x00, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x53, 0x00, 0x00, 0x00, // Write command
			0x04, 0x00, 0x00, 0x00, // Pin number
			0x00, 0x00, 0x00, 0x00, // Value 1
			0x00, 0x00, 0x00, 0x00,
		},
	}
	responseData := [][]byte{
		// TC 1
		{
			0x53, 0x00, 0x00, 0x00,
			0x02, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,
			0xFF, 0x00, 0x00, 0x00,
		},
		// TC 2
		{
			0x53, 0x00, 0x00, 0x00,
			0x04, 0x00, 0x00, 0x00,
			0x2c, 0x00, 0x00, 0x00,
			0xA4, 0xFF, 0xFF, 0xFF,
		},
	}
	done := make(chan struct{})
	go ListenAndReply(t, listener, done, expectedData, responseData)

	p := NewPigpio()
	assert.NotNil(t, p)

	// TC 1: Succesfully get PWM dc on pin 2
	value, err := p.GetPwmDutyCycle(2)
	assert.NoError(t, err)
	assert.Equal(t, 255, value)

	// TC 2: Unsuccesfully Get PWM on pin 4
	_, err = p.GetPwmDutyCycle(4)
	if assert.Error(t, err) {
		assert.Equal(t, ErrNotPwmGpio, err)
	}

	// TC 3: Unsuccesfully get dc on pin -42
	_, err = p.GetPwmDutyCycle(-42)
	if assert.Error(t, err) {
		assert.Equal(t, ErrInvalidUserPinNumber, err)
	}

	p.Close()

	<-done
}

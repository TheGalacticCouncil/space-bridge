package events

import (
	"encoding/json"
	"fmt"
	"net"
	"sync"
)

type SpaceBridgeEventPayload struct {
	Value int `json:"value"`
}

type SpaceBridgeEvent struct {
	Timestamp       int                     `json:"timestamp"`
	SourceComponent string                  `json:"sourceComponent"`
	SourceIp        string                  `json:"sourceIp"`
	Event           string                  `json:"event"`
	Station         string                  `json:"station"`
	Payload         SpaceBridgeEventPayload `json:"payload"`
}

type UdpBroadcastEventReceiver struct {
	conn       *net.UDPConn
	buffer     []*SpaceBridgeEvent
	bufferSize int
	mu         sync.Mutex
}

// NewUdpBroadcastEventReceiver creates a new UdpBroadcastEventReceiver
func NewUdpBroadcastEventReceiver(port int, bufferSize int) (*UdpBroadcastEventReceiver, error) {
	addr := net.UDPAddr{
		Port: port,
		IP:   net.ParseIP("0.0.0.0"),
	}
	conn, err := net.ListenUDP("udp", &addr)
	if err != nil {
		return nil, fmt.Errorf("failed to listen on UDP port %d: %w", port, err)
	}

	receiver := &UdpBroadcastEventReceiver{
		conn:       conn,
		buffer:     make([]*SpaceBridgeEvent, 0, bufferSize),
		bufferSize: bufferSize,
	}

	go receiver.listen()

	return receiver, nil
}

// listen listens for incoming UDP packets and processes them
func (r *UdpBroadcastEventReceiver) listen() {
	buf := make([]byte, 2048)
	for {
		n, _, err := r.conn.ReadFromUDP(buf)
		if err != nil {
			fmt.Println("Error reading from UDP:", err)
			continue
		}

		var event SpaceBridgeEvent
		err = json.Unmarshal(buf[:n], &event)
		if err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			continue
		}

		r.mu.Lock()
		if len(r.buffer) >= r.bufferSize {
			r.buffer = r.buffer[1:]
		}
		r.buffer = append(r.buffer, &event)
		r.mu.Unlock()
	}
}

// ConsumeEvent returns the oldest event from the buffer or nil if no events are available
func (r *UdpBroadcastEventReceiver) ConsumeEvent() *SpaceBridgeEvent {
	r.mu.Lock()
	defer r.mu.Unlock()

	if len(r.buffer) == 0 {
		return nil
	}

	event := r.buffer[0]
	r.buffer = r.buffer[1:]
	return event
}

// Close closes the UDP connection
func (r *UdpBroadcastEventReceiver) Close() {
	r.conn.Close()
}

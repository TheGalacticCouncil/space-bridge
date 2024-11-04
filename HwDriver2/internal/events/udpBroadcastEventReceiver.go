package events

import (
	"encoding/json"
	"fmt"
	"net"
)

type SpaceBridgeEventPayload struct {
	Value int `json:"value"`
}

type SpaceBridgeEvent struct {
	Timestamp       int64                   `json:"timestamp"`
	SourceComponent string                  `json:"sourceComponent"`
	SourceIp        string                  `json:"sourceIp"`
	Event           string                  `json:"event"`
	Station         string                  `json:"station"`
	Payload         SpaceBridgeEventPayload `json:"payload"`
}

type UdpBroadcastEventReceiver struct {
	conn      *net.UDPConn
	eventChan chan *SpaceBridgeEvent
	done      chan struct{}
}

// NewUdpBroadcastEventReceiver creates a new UdpBroadcastEventReceiver
func NewUdpBroadcastEventReceiver(listenAddress string, port int, bufferSize int) (*UdpBroadcastEventReceiver, error) {
	addr := &net.UDPAddr{
		Port: port,
		IP:   net.ParseIP(listenAddress),
	}
	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		return nil, fmt.Errorf("failed to listen on UDP port %d: %w", port, err)
	}

	receiver := &UdpBroadcastEventReceiver{
		conn:      conn,
		eventChan: make(chan *SpaceBridgeEvent, bufferSize),
		done:      make(chan struct{}),
	}

	// Start listening for incoming UDP packets in separate goroutine
	go receiver.listen()

	return receiver, nil
}

// listen listens for incoming UDP packets and processes them
func (r *UdpBroadcastEventReceiver) listen() {
	buf := make([]byte, 2048)
	for {
		select {
		case <-r.done:
			// Exit the loop if done signal is received
			fmt.Println("Stopping UDP listener")
			return
		default:
			n, _, err := r.conn.ReadFromUDP(buf)
			if err != nil {
				// If the error is "use of closed network connection", ignore it and continue - most likely we're shutting down
				if err, ok := err.(*net.OpError); ok && err.Err.Error() == "use of closed network connection" {
					continue
				}

				fmt.Println("Error reading from UDP:", err)
				continue
			}

			var event SpaceBridgeEvent
			err = json.Unmarshal(buf[:n], &event)
			if err != nil {
				fmt.Println("Error unmarshalling JSON:", err)
				continue
			}

			select {
			case r.eventChan <- &event:
				// Successfully sent event to channel
			default:
				// Channel is full, drop the event
				fmt.Println("Event channel is full, dropping event")
			}
		}
	}
}

// ConsumeEvent returns the oldest event from the channel or nil if no events are available
func (r *UdpBroadcastEventReceiver) ConsumeEvent() *SpaceBridgeEvent {
	select {
	case event := <-r.eventChan:
		return event
	default:
		return nil
	}
}

func (r *UdpBroadcastEventReceiver) GetEventChan() chan *SpaceBridgeEvent {
	return r.eventChan
}

// Close closes the UDP connection
func (r *UdpBroadcastEventReceiver) Close() error {
	close(r.done)
	err := r.conn.Close()
	close(r.eventChan)

	return err
}

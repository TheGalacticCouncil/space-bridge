package events

import (
	"fmt"
	"sync"
)

const (
	MOTOR_POSITION_EVENT_TEMPLATE = "MOTOR_%d_POSITION"
)

type trackedMotor struct {
	id int
}

type ExpectedMotorPositionTracker struct {
	eventChan         chan *SpaceBridgeEvent
	expectedPositions map[int]int
	trackedEvents     map[string]trackedMotor // map of event -> motorId

	// Mutext to protect expectedPositions
	mu sync.Mutex
}

func NewExpectedMotorPositionTracker(eventChan chan *SpaceBridgeEvent, motorIds []int) *ExpectedMotorPositionTracker {
	tracker := &ExpectedMotorPositionTracker{
		eventChan:         eventChan,
		expectedPositions: make(map[int]int),
		trackedEvents:     make(map[string]trackedMotor),
	}

	for _, motorId := range motorIds {
		tracker.expectedPositions[motorId] = 0
		tracker.trackedEvents[fmt.Sprintf(MOTOR_POSITION_EVENT_TEMPLATE, motorId)] = trackedMotor{id: motorId}
	}

	// Start listening for events in separate goroutine
	go tracker.listen()

	return tracker
}

func (e *ExpectedMotorPositionTracker) listen() {
	for {
		event, ok := <-e.eventChan
		if !ok {
			// Channel is closed, exit the loop
			return
		}

		// Check if event is in trackedEvents
		if !e.isTrackedEvent(event.Event) {
			continue
		}

		// Update expected position
		motorId := e.trackedEvents[event.Event].id

		e.mu.Lock()
		e.expectedPositions[motorId] = event.Payload.Value
		e.mu.Unlock()
	}
}

func (e *ExpectedMotorPositionTracker) isTrackedEvent(event string) bool {
	for trackedEvent := range e.trackedEvents {
		if event == trackedEvent {
			return true
		}
	}
	return false
}

func (e *ExpectedMotorPositionTracker) GetExpectedPosition(motorId int) (position int, exists bool) {
	position, exists = e.expectedPositions[motorId]
	return position, exists
}

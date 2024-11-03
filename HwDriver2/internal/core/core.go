package core

import (
	"fmt"
	"hwdriver2/internal/events"
	"hwdriver2/internal/hw"
	"hwdriver2/pkg/pigpio"
	"time"
)

const (
	BROADCAST_PORT             = 41114
	EVENT_RECEIVER_BUFFER_SIZE = 100
)

type HardwareAccess interface {
	ReadAnalogMcp3008Pin(spiChannel int, adcChannel int) (int, error)
	GetPigpio() *pigpio.Pigpio
	Close() error
}

type MotorizedSlider interface {
	ReadPosition() (int, error)
	ReadTouchPosition() (int, error)
	ReadTouchRaw() (int, error)
	DriveToPosition(position int) error
	Calibrate() error
	GetId() int
}

type EventSource interface {
	GetEventChan() chan *events.SpaceBridgeEvent
	Close() error
}

type ExpectedPositionProvider interface {
	GetExpectedPosition(motorId int) (int, bool)
}

type core struct {
	hwManager                HardwareAccess
	sliders                  []MotorizedSlider
	fileApiWriter            *OutputFileApiWriter
	eventReceiver            EventSource
	expectedPositionProvider ExpectedPositionProvider
	stopChan                 chan struct{}
}

func (c *core) Run() {
	// Main loop. Read slider positions and print.
	for {
		select {
		case <-c.stopChan:
			fmt.Println("Stopping core run loop")

			return

		default:
			positions := make(map[int]int)
			for i, slider := range c.sliders {
				position, err := slider.ReadPosition()
				if err != nil {
					fmt.Println("Error reading position: ", err)
					return
				}
				positions[i] = position
			}

			// Clear terminal (assuming Unix-like system)
			// fmt.Print("\033[H\033[2J")

			for id, position := range positions {
				fmt.Printf("Slider %d position: %d\n", id, position)
			}

			// Write positions to file
			err := c.fileApiWriter.WritePositionsToFile()
			if err != nil {
				fmt.Println("Error writing positions to file: ", err)
				return
			}

			// // Consume up to 10 events and print them
			// for i := 0; i < 10; i++ {
			// 	event := c.eventReceiver.ConsumeEvent()
			// 	if event == nil {
			// 		break
			// 	}
			// 	fmt.Printf("Event: %+v\n", event)
			// }

			// Print expected motor positions
			for _, slider := range c.sliders {
				expectedPosition, ok := c.expectedPositionProvider.GetExpectedPosition(slider.GetId())
				if !ok {
					fmt.Printf("Expected position for motor %d not found\n", slider.GetId())
				} else {
					fmt.Printf("Expected position for motor %d: %d\n", slider.GetId(), expectedPosition)
				}
			}

			// Drive motors to expected positions
			for _, slider := range c.sliders {
				expectedPosition, ok := c.expectedPositionProvider.GetExpectedPosition(slider.GetId())
				if !ok {
					continue
				}
				err := slider.DriveToPosition(expectedPosition)
				if err != nil {
					fmt.Println("Error driving motor: ", err)
					return
				}
			}

			// Sleep for 16ms
			time.Sleep(500 * time.Millisecond)
		}
	}
}

func (c *core) Close() error {
	var errs []error

	// Stop the core run loop
	close(c.stopChan)
	// Give the loop time to complete the last iteration
	time.Sleep(1 * time.Second)

	if err := c.eventReceiver.Close(); err != nil {
		errs = append(errs, fmt.Errorf("error closing eventReceiver: %w", err))
	}

	if err := c.hwManager.Close(); err != nil {
		errs = append(errs, fmt.Errorf("error closing hwManager: %w", err))
	}

	if err := c.fileApiWriter.Close(); err != nil {
		errs = append(errs, fmt.Errorf("error closing fileApiWriter: %w", err))
	}

	if len(errs) > 0 {
		return fmt.Errorf("multiple errors: %v", errs)
	}

	return nil
}

func (c *core) initializeHwManager() error {
	var err error
	c.hwManager, err = hw.NewHwManager()
	if err != nil {
		return fmt.Errorf("error creating hwManager: %w", err)
	}

	return nil
}

func (c *core) initializeMotors() error {
	// TODO: Read these from a config file
	c.sliders = []MotorizedSlider{
		&hw.MotorSlider{
			Id:                      1,
			Hw:                      c.hwManager,
			SlidePositionAdcChannel: 0,
			SlidePositionSpiChannel: 0,
			TouchSenseAdcChannel:    6,
			TouchSenseSpiChannel:    1,
			MotorPin1:               10,
			MotorPin2:               11,
			MotorEnablePin:          23,
		},
		&hw.MotorSlider{
			Id:                      2,
			Hw:                      c.hwManager,
			SlidePositionAdcChannel: 1,
			SlidePositionSpiChannel: 0,
			TouchSenseAdcChannel:    7,
			TouchSenseSpiChannel:    1,
			MotorPin1:               9,
			MotorPin2:               26,
			MotorEnablePin:          23,
		},
	}

	// Calibrate motors
	for _, slider := range c.sliders {
		err := slider.Calibrate()
		if err != nil {
			return fmt.Errorf("error calibrating motor: %w", err)
		}
	}

	return nil
}

func (c *core) initializeOutputFileApiWriter(filePath string, touchFilePath string, touchPositionFilePath string) error {
	// Convert sliders to PositionProviders. TODO: Find more elegant way to handle this
	positionProviders := make([]PositionProvider, len(c.sliders))
	for i, slider := range c.sliders {
		positionProviders[i] = slider
	}

	var err error
	c.fileApiWriter, err = NewOutputFileApiWriter(positionProviders, filePath, touchFilePath, touchPositionFilePath)
	if err != nil {
		return fmt.Errorf("error creating OutputFileApiWriter: %w", err)
	}

	return nil
}

func (c *core) initializeEventReceiver() error {
	var err error
	c.eventReceiver, err = events.NewUdpBroadcastEventReceiver(BROADCAST_PORT, EVENT_RECEIVER_BUFFER_SIZE)
	if err != nil {
		return fmt.Errorf("error creating event receiver: %w", err)
	}

	return nil
}

func (c *core) initializeExpectedPositionProvider() error {
	// Get list of motor IDs
	motorIds := make([]int, len(c.sliders))
	for i, slider := range c.sliders {
		motorIds[i] = slider.GetId()
	}

	c.expectedPositionProvider = events.NewExpectedMotorPositionTracker(
		c.eventReceiver.GetEventChan(),
		motorIds,
	)

	return nil
}

func NewCore() (*core, error) {
	core := &core{
		stopChan: make(chan struct{}),
	}

	if err := core.initializeHwManager(); err != nil {
		return nil, err
	}

	if err := core.initializeMotors(); err != nil {
		return nil, err
	}

	if err := core.initializeEventReceiver(); err != nil {
		return nil, err
	}

	if err := core.initializeExpectedPositionProvider(); err != nil {
		return nil, err
	}

	if err := core.initializeOutputFileApiWriter(
		"positions.txt",
		"touch.txt",
		"touchpos.txt",
	); err != nil {
		return nil, err
	}

	return core, nil
}

package core

import (
	"fmt"
	"hwdriver2/internal/hw"
	"hwdriver2/pkg/pigpio"
	"time"
)

type HardwareAccess interface {
	ReadAnalogMcp3008Pin(spiChannel int, adcChannel int) (int, error)
	GetPigpio() *pigpio.Pigpio
	Close() error
}

type MotorizedSlider interface {
	ReadPosition() (int, error)
	DriveToPosition(position int) error
	Calibrate() error
}

type core struct {
	hwManager HardwareAccess
	sliders   []MotorizedSlider
}

func (c *core) Run() {
	// Main loop. Read slider positions and print.
	for {
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
		fmt.Print("\033[H\033[2J")

		for id, position := range positions {
			fmt.Printf("Slider %d position: %d\n", id, position)
		}

		// Sleep for 16ms
		time.Sleep(32 * time.Millisecond)
	}
}

func (c *core) Close() error {
	return c.hwManager.Close()
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

func NewCore() (*core, error) {
	core := &core{}

	if err := core.initializeHwManager(); err != nil {
		return nil, err
	}

	if err := core.initializeMotors(); err != nil {
		return nil, err
	}

	return core, nil
}

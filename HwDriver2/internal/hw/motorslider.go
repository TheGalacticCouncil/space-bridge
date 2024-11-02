package hw

import (
	"fmt"
	"time"

	"hwdriver2/pkg/pigpio"
)

const (
	MAX_LOGICAL_VALUE = 1023
	MIN_LOGICAL_VALUE = 0
	MAX_PWM_MOVING    = 255
	MIN_PWM_MOVING    = 170
)

type MotorSlider struct {
	Hw                      HwAccess
	SlidePositionAdcChannel int
	SlidePositionSpiChannel int
	TouchSenseAdcChannel    int
	TouchSenseSpiChannel    int
	Id                      int

	MotorPin1      int
	MotorPin2      int
	MotorEnablePin int

	_minRawValue   int
	_maxRawValue   int
	_rawValueRange int
}

func (m *MotorSlider) ReadPosition() (int, error) {
	return m.Hw.ReadAnalogMcp3008Pin(m.SlidePositionSpiChannel, m.SlidePositionAdcChannel)
}

func (m *MotorSlider) ReadTouchPosition() (int, error) {
	// TODO: Implement true touch position handling
	return m.ReadPosition()
}

func (*MotorSlider) DriveToPosition(position int) error {
	return nil
}

func (m *MotorSlider) Calibrate() error {
	// Set motor pins to down and the enable pin to high
	if _, err := m.Hw.GetPigpio().SetMode(m.MotorPin1, pigpio.OUTPUT); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().SetMode(m.MotorPin2, pigpio.OUTPUT); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().SetMode(m.MotorEnablePin, pigpio.OUTPUT); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().Write(m.MotorPin1, 0); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().Write(m.MotorPin2, 0); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().Write(m.MotorEnablePin, 1); err != nil {
		return err
	}

	// Enable PWM driving with max frequency
	if _, err := m.Hw.GetPigpio().SetPwmFrequency(m.MotorPin1, 20000); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().SetPwmFrequency(m.MotorPin2, 20000); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin1, 0); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin2, 0); err != nil {
		return err
	}

	// TODO: Find the minimum and maximum positions by driving the motor to the both ends and reading the position
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin1, MAX_PWM_MOVING); err != nil {
		return err
	}
	time.Sleep(time.Second * 3)
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin1, 0); err != nil {
		return err
	}

	var err error
	m._maxRawValue, err = m.ReadPosition()
	if err != nil {
		return err
	}

	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin2, MAX_PWM_MOVING); err != nil {
		return err
	}
	time.Sleep(time.Second * 3)
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin2, 0); err != nil {
		return err
	}

	m._minRawValue, err = m.ReadPosition()
	if err != nil {
		return err
	}

	// Set _pin1 and _pin2 so that _pin1 drives the value up and _pin2 drives the value down
	if m._maxRawValue < m._minRawValue {
		m.MotorPin1, m.MotorPin2 = m.MotorPin2, m.MotorPin1
		m._maxRawValue, m._minRawValue = m._minRawValue, m._maxRawValue
	}

	m._rawValueRange = m._maxRawValue - m._minRawValue

	// TODO: Print the calibration values
	fmt.Printf("MotorSlider calibration results (Id=%d):\n", m.Id)
	fmt.Printf("Calibration values: min=%d, max=%d, range=%d\n", m._minRawValue, m._maxRawValue, m._rawValueRange)

	return nil
}

func (m *MotorSlider) GetId() int {
	return m.Id
}

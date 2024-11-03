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
	// MIN_PWM_MOVING                      = 170 // For 12V
	MIN_PWM_MOVING                      = 240 // For 5V
	TOUCH_THRESHOLD                     = 800
	MINIMUM_MS_FROM_LAST_DETECTED_TOUCH = 50
	MINIMUM_MS_FROM_LAST_ENABLED_START  = 500
	ACCURACY_PROMILLE                   = 30
	MAX_MOTOR_LOOP_ITERATIONS           = 1000
)

type TouchState rune

const (
	NOT_TOUCHING TouchState = 'N'
	TOUCHING     TouchState = 'T'
)

type MotorState rune

const (
	MOTOR_STOPPED    MotorState = 'S'
	MOTOR_INCREASING MotorState = 'I'
	MOTOR_DECREASING MotorState = 'D'
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

	motorState MotorState

	_minRawValue   int
	_maxRawValue   int
	_rawValueRange int
	_maxDeviation  int

	lastTouchDetectedTimestamp time.Time
	touchState                 TouchState

	latestTouchPosition int
	latestPosition      int
}

// ReadPosition reads the position of the motor slider
func (m *MotorSlider) ReadPosition() (int, error) {
	var err error
	m.latestPosition, err = m.Hw.ReadAnalogMcp3008Pin(m.SlidePositionSpiChannel, m.SlidePositionAdcChannel)

	return m.latestPosition, err
}

// GetLatestPosition returns the latest position read from the motor slider
func (m *MotorSlider) GetLatestPosition() int {
	return m.latestPosition
}

// Deprecated: Use GetLatestTouchPosition instead
func (m *MotorSlider) ReadTouchPosition() (int, error) {
	return m.latestTouchPosition, nil
}

func (m *MotorSlider) GetLatestTouchPosition() int {
	return m.latestTouchPosition
}

func (m *MotorSlider) ReadTouchRaw() (int, error) {
	return m.Hw.ReadAnalogMcp3008Pin(m.TouchSenseSpiChannel, m.TouchSenseAdcChannel)
}

func (m *MotorSlider) DriveToPosition(position int) error {
	currentPosition, err := m.ReadPosition()
	if err != nil {
		return err
	}

	// Calculate the difference between the current position and the target position
	diff := position - currentPosition

	absDiff := diff
	if absDiff < 0 {
		absDiff = -absDiff
	}

	// If diff is within the max deviation, don't move the motor
	if absDiff <= m._maxDeviation {
		return nil
	}

	for i := 0; absDiff > m._maxDeviation; i++ {
		// Check if the motor is disabled
		if !m.motorEnabled() {
			m.latestTouchPosition = currentPosition

			// Stop the motor
			return m.stop()
		}

		// TODO: Implement more fancy algorithm for speed control
		speedMultiplier := 1.0
		if absDiff < 4*m._maxDeviation {
			speedMultiplier = 0.5
		} else if absDiff < 6*m._maxDeviation {
			speedMultiplier = 0.6
		} else if absDiff < 8*m._maxDeviation {
			speedMultiplier = 0.7
		} else if absDiff < 10*m._maxDeviation {
			speedMultiplier = 0.8
		} else if absDiff < 12*m._maxDeviation {
			speedMultiplier = 0.9
		}

		// Drive the motor
		if diff > 0 {
			err = m.increase(int(float64(MAX_PWM_MOVING) * speedMultiplier))
		} else {
			err = m.decrease(int(float64(MAX_PWM_MOVING) * speedMultiplier))
		}
		if err != nil {
			return err
		}

		if i > MAX_MOTOR_LOOP_ITERATIONS/2 {
			// Print a warning
			fmt.Println("Motor loop iteration count is getting high: ", i)
		}

		if i > MAX_MOTOR_LOOP_ITERATIONS {
			// Print an error and stop the motor
			fmt.Println("Motor loop iteration count is too high: ", i)
			return m.stop()
		}

		// Wait for a while
		time.Sleep(time.Millisecond * 1)

		// Read the current position
		currentPosition, err = m.ReadPosition()
		if err != nil {
			return err
		}

		// Calculate the difference between the current position and the target position
		diff = position - currentPosition

		absDiff = diff
		if absDiff < 0 {
			absDiff = -absDiff
		}
	}

	// Stop the motor
	err = m.stop()
	if err != nil {
		return err
	}

	return nil
}

func (m *MotorSlider) Tick() {
	// Get current currentPosition
	currentPosition, err := m.ReadPosition()
	if err != nil {
		// Log error and return
		fmt.Println("Error reading position: ", err)
		return
	}

	// Check if the motor is enabled
	if !m.motorEnabled() {
		m.latestTouchPosition = currentPosition
		return
	}

}

func (m *MotorSlider) motorEnabled() bool {
	touchValue, err := m.ReadTouchRaw()
	if err != nil {
		// Log error and set touchValue to 0
		fmt.Println("Error reading touch value: ", err)
		touchValue = 0
	}

	if touchValue > TOUCH_THRESHOLD {
		m.lastTouchDetectedTimestamp = time.Now()

		m.touchState = TOUCHING
	} else {
		now := time.Now()
		diff := now.Sub(m.lastTouchDetectedTimestamp)

		if diff.Milliseconds() > MINIMUM_MS_FROM_LAST_DETECTED_TOUCH {
			if diff.Milliseconds() > MINIMUM_MS_FROM_LAST_ENABLED_START {
				m.touchState = NOT_TOUCHING
			}
		}
	}

	return m.touchState != TOUCHING
}

func (m *MotorSlider) Calibrate() error {
	// TODO: Add logic for finding the minimum and maximum PWN duty cycle values for moving the motor

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
	m._maxDeviation = int(float64(m._rawValueRange)*float64(ACCURACY_PROMILLE)/1000.0 + 0.5)

	// TODO: Print the calibration values
	fmt.Printf("MotorSlider calibration results (Id=%d):\n", m.Id)
	fmt.Printf("Calibration values: min=%d, max=%d, range=%d\n", m._minRawValue, m._maxRawValue, m._rawValueRange)

	return nil
}

func (m *MotorSlider) GetId() int {
	return m.Id
}

func (m *MotorSlider) stop() error {
	if m.motorState == MOTOR_STOPPED {
		return nil
	}

	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin1, 0); err != nil {
		return err
	}
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin2, 0); err != nil {
		return err
	}

	m.motorState = MOTOR_STOPPED

	return nil
}

func (m *MotorSlider) increase(speed int) error {
	if m.motorState == MOTOR_DECREASING {
		// Stop the motor by setting the duty cycle to 0 of pin 2
		if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin2, 0); err != nil {
			return err
		}
	}

	// Get calibrated speed
	pwmValue := m.calculatePwmValue(speed)

	// Set the duty cycle of pin 1
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin1, pwmValue); err != nil {
		return err
	}

	m.motorState = MOTOR_INCREASING

	return nil
}

func (m *MotorSlider) decrease(speed int) error {
	if m.motorState == MOTOR_INCREASING {
		// Stop the motor by setting the duty cycle to 0 of pin 1
		if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin1, 0); err != nil {
			return err
		}
	}

	// Get calibrated speed
	pwmValue := m.calculatePwmValue(speed)

	// Set the duty cycle of pin 2
	if _, err := m.Hw.GetPigpio().SetPwmDutyCycle(m.MotorPin2, pwmValue); err != nil {
		return err
	}

	m.motorState = MOTOR_DECREASING

	return nil
}

func (m *MotorSlider) calculatePwmValue(speed int) int {
	// TODO: Implement proper calculation based on calibration

	// if below min, set to min
	if speed < MIN_PWM_MOVING {
		return MIN_PWM_MOVING
	}

	// if above max, set to max
	if speed > MAX_PWM_MOVING {
		return MAX_PWM_MOVING
	}

	return speed
}

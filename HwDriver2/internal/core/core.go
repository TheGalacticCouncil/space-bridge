package core

import (
	"fmt"
	"time"

	"HwDriver2/hwdriver2/internal/config"
	"HwDriver2/hwdriver2/internal/events"
	"HwDriver2/hwdriver2/internal/hw"
	"HwDriver2/hwdriver2/pkg/pigpio"
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
	GetLatestPosition() int
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

type ConfigProvider interface {
	GetConfig() config.CombinedConfig
}

type core struct {
	config                   ConfigProvider
	hwManager                HardwareAccess
	sliders                  []MotorizedSlider
	fileApiWriter            *OutputFileApiWriter
	eventReceiver            EventSource
	expectedPositionProvider ExpectedPositionProvider
	stopChan                 chan struct{}

	loopSleepTime time.Duration
}

func (c *core) Run() {
	// Main loop. Read slider positions and print.
	i := 0
	for {
		i++
		select {
		case <-c.stopChan:
			fmt.Println("Stopping core run loop")

			return

		default:
			positions := make(map[int]int)
			for i, slider := range c.sliders {
				position := slider.GetLatestPosition()
				positions[i] = position
			}

			// Write positions to file
			err := c.fileApiWriter.WritePositionsToFile()
			if err != nil {
				fmt.Println("Error writing positions to file: ", err)
				return
			}

			// Print only on every 60th iteration
			if i == 60 {
				i = 0

				for id, position := range positions {
					fmt.Printf("Slider %d position: %d\n", id, position)
				}

				// Print expected motor positions
				for _, slider := range c.sliders {
					expectedPosition, ok := c.expectedPositionProvider.GetExpectedPosition(slider.GetId())
					if !ok {
						fmt.Printf("Expected position for motor %d not found\n", slider.GetId())
					} else {
						fmt.Printf("Expected position for motor %d: %d\n", slider.GetId(), expectedPosition)
					}
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

			time.Sleep(c.loopSleepTime)
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

func (c *core) Config() config.CombinedConfig {
	return c.config.GetConfig()
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

	config := c.config.GetConfig().MotorizedSliders

	c.sliders = make([]MotorizedSlider, len(config.Sliders))

	commonMotorConfig := hw.MotorSliderGenericConfig{
		MotorMaxPwm:            config.Config.MotorMaxPwm,
		MotorMinPwm:            config.Config.MotorMinPwm,
		MotorLoopIterationsMax: config.Config.MotorLoopIterationsMax,
		AccuracyPromille:       config.Config.AccuracyPromille,
		MinTimeFromLastTouchMs: config.Config.MinTimeFromLastTouchMs,
		TouchSenseThreshold:    config.Config.TouchSenseThreshold,
	}

	for i, sliderConfig := range config.Sliders {
		slider := &hw.MotorSlider{
			Id:                      sliderConfig.ID,
			Config:                  commonMotorConfig,
			Hw:                      c.hwManager,
			SlidePositionAdcChannel: sliderConfig.PositionSensor.AdcChannel,
			SlidePositionSpiChannel: sliderConfig.PositionSensor.SpiChannel,
			TouchSenseAdcChannel:    sliderConfig.TouchSensor.AdcChannel,
			TouchSenseSpiChannel:    sliderConfig.TouchSensor.SpiChannel,
			MotorPin1:               sliderConfig.Motor.Pin1,
			MotorPin2:               sliderConfig.Motor.Pin2,
			MotorEnablePin:          sliderConfig.Motor.EnablePin,
		}

		c.sliders[i] = slider
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

func (c *core) initializeOutputFileApiWriter() error {
	positionProviders := make([]PositionProvider, len(c.sliders))
	for i, slider := range c.sliders {
		positionProviders[i] = slider
	}

	var err error
	c.fileApiWriter, err = NewOutputFileApiWriter(
		positionProviders,
		c.config.GetConfig().FileApi.PositionsFilePath,
		c.config.GetConfig().FileApi.TouchFilePath,
		c.config.GetConfig().FileApi.TouchPositionsFilePath,
	)
	if err != nil {
		return fmt.Errorf("error creating OutputFileApiWriter: %w", err)
	}

	return nil
}

func (c *core) initializeEventReceiver() error {
	var err error
	c.eventReceiver, err = events.NewUdpBroadcastEventReceiver(
		c.config.GetConfig().Events.BroadcastListenAddress,
		c.config.GetConfig().Events.BroadcastPort,
		c.config.GetConfig().Events.EventReceiverBufferSize,
	)
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

func (c *core) initializeConfigProvider() error {
	var err error
	c.config, err = config.NewConfigProvider()

	if err != nil {
		return fmt.Errorf("error creating config provider: %w", err)
	}

	return nil
}

func NewCore() (*core, error) {
	core := &core{
		stopChan: make(chan struct{}),
	}

	if err := core.initializeConfigProvider(); err != nil {
		return nil, err
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

	if err := core.initializeOutputFileApiWriter(); err != nil {
		return nil, err
	}

	core.loopSleepTime = time.Duration(core.Config().Generic.MainLoopSleepTimeMs * int(time.Millisecond))

	// Print generic information
	fmt.Printf("Initialized %d motors\n", len(core.sliders))
	fmt.Printf("Loop sleep time: %v\n", core.loopSleepTime)

	return core, nil
}

package hw

import (
	"errors"
	"hwdriver2/pkg/pigpio"
)

type HwAccess interface {
	ReadAnalogMcp3008Pin(spiChannel int, adcChannel int) (int, error)
	GetPigpio() *pigpio.Pigpio
}

type hwManager struct {
	adcs []*mcp3008
	hw   *pigpio.Pigpio
}

const (
	MAX_SPI_CHANNEL = 2
)

var (
	ErrInvalidSpiChannel = errors.New("Invalid SPI channel")
)

func NewHwManager() (*hwManager, error) {
	manager := &hwManager{
		adcs: make([]*mcp3008, MAX_SPI_CHANNEL),
		hw:   pigpio.NewPigpio(),
	}

	return manager, nil
}

func (hw *hwManager) ReadAnalogMcp3008Pin(spiChannel int, adcChannel int) (int, error) {
	if spiChannel < 0 || spiChannel > MAX_SPI_CHANNEL {
		return 0, ErrInvalidSpiChannel
	}

	if hw.adcs[spiChannel] == nil {
		adc, err := NewMcp3008(spiChannel, hw.hw)
		if err != nil {
			return 0, err
		}

		hw.adcs[spiChannel] = adc
	}

	return hw.adcs[spiChannel].Read(adcChannel)
}

func (hw *hwManager) GetPigpio() *pigpio.Pigpio {
	return hw.hw
}

func (hw *hwManager) Close() error {
	for _, adc := range hw.adcs {
		if adc != nil {
			if _, err := adc.Close(); err != nil {
				return err
			}
		}
	}
	return nil
}

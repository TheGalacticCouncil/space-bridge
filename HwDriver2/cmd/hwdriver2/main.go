package main

import (
	"fmt"
	"hwdriver2/pkg/pigpio"
)

func main() {
	fmt.Println("Hello, world!")

	// Setup pigpio thingy
	pgpio := pigpio.NewPigpio()
	val, err := pgpio.SetMode(0, pigpio.OUTPUT)
	if err != nil {
		fmt.Println("Error setting mode: ", err)
	}
	fmt.Println("SetMode returned: ", val)

	// Open SPI
	flags := []byte{
		0x00, 0x01, 0x00, 0x00, // 0x00010000, use AUX SPI
	}
	spi, err := pgpio.SpiOpen(0, 1350000, flags)
	if err != nil {
		fmt.Println("Error opening SPI: ", err)
	}

	fmt.Println("SPI opened: ", spi)

	// Read SPI ADC values
	channel := 0
	spiReadBuf := make([]byte, 4)
	spiReadBuf[0] = 0x01 // Start bit
	spiReadBuf[1] = byte((8 + channel) << 4)
	spiReadBuf[2] = 0x00 // Don't care
	spiReadBuf[3] = 0x00 // Don't care

	bytes, data, err := pgpio.SpiXfer(spi, spiReadBuf)
	if err != nil {
		fmt.Println("Error reading SPI: ", err)
	}
	fmt.Println("Read ", bytes, " bytes from SPI: ", data)

	// Parse the actual value
	adcValue := (int(data[1]&3) << 8) + int(data[2])
	fmt.Println("ADC value: ", adcValue)

	// Read ADC values for channels 0-7 in a loop with 16ms delay
	for j := 0; j < 2000; j++ {
		// Clear terminal
		fmt.Print("\033[H\033[2J")

		for i := 0; i < 8; i++ {
			spiReadBuf[1] = byte((8 + i) << 4)
			bytes, data, err = pgpio.SpiXfer(spi, spiReadBuf)
			if err != nil {
				fmt.Println("Error reading SPI: ", err)
			}
			fmt.Println("Read ", bytes, " bytes from SPI: ", data)

			// Parse the actual value
			adcValue = (int(data[1]&3) << 8) + int(data[2])
			fmt.Println("ADC value: ", adcValue)

			// Sleep for 16ms
			// time.Sleep(16 * time.Millisecond)

		}
	}

	// Close SPI
	_, err = pgpio.SpiClose(spi)
	if err != nil {
		fmt.Println("Error closing SPI: ", err)
	}

	fmt.Println("Hello, Pigpiod!")
}

package main

import (
	"fmt"
	"hwdriver2/internal/core"
)

func main() {
	fmt.Println("Hello, world!")

	// Intialize core
	core, err := core.NewCore()
	if err != nil {
		fmt.Println("Error initializing core: ", err)
		return
	}

	// Start the main loop
	core.Run()

	// // Setup pigpio thingy
	// pgpio := pigpio.NewPigpio()
	// val, err := pgpio.SetMode(0, pigpio.OUTPUT)
	// if err != nil {
	// 	fmt.Println("Error setting mode: ", err)
	// }
	// fmt.Println("SetMode returned: ", val)

	// // Open SPI
	// flags := []byte{
	// 	0x00, 0x01, 0x00, 0x00, // 0x00010000, use AUX SPI
	// }
	// spi, err := pgpio.SpiOpen(0, 1350000, flags)
	// if err != nil {
	// 	fmt.Println("Error opening SPI: ", err)
	// }

	// fmt.Println("SPI opened: ", spi)

	// // Read SPI ADC values
	// channel := 0
	// spiReadBuf := make([]byte, 4)
	// spiReadBuf[0] = 0x01 // Start bit
	// spiReadBuf[1] = byte((8 + channel) << 4)
	// spiReadBuf[2] = 0x00 // Don't care
	// spiReadBuf[3] = 0x00 // Don't care

	// bytes, data, err := pgpio.SpiXfer(spi, spiReadBuf)
	// if err != nil {
	// 	fmt.Println("Error reading SPI: ", err)
	// }
	// fmt.Println("Read ", bytes, " bytes from SPI: ", data)

	// // Parse the actual value
	// adcValue := (int(data[1]&3) << 8) + int(data[2])
	// fmt.Println("ADC value: ", adcValue)

	// // test MotorSlider
	// hwManager, err := hw.NewHwManager()
	// if err != nil {
	// 	fmt.Println("Error creating hwManager: ", err)
	// }
	// motor := hw.MotorSlider{
	// 	Id:                      1,
	// 	Hw:                      hwManager,
	// 	SlidePositionAdcChannel: 0,
	// 	SlidePositionSpiChannel: 0,
	// 	TouchSenseAdcChannel:    6,
	// 	TouchSenseSpiChannel:    1,
	// 	MotorPin1:               10,
	// 	MotorPin2:               11,
	// 	MotorEnablePin:          23,
	// }
	// motor2 := hw.MotorSlider{
	// 	Id:                      2,
	// 	Hw:                      hwManager,
	// 	SlidePositionAdcChannel: 1,
	// 	SlidePositionSpiChannel: 0,
	// 	TouchSenseAdcChannel:    7,
	// 	TouchSenseSpiChannel:    1,
	// 	MotorPin1:               9,
	// 	MotorPin2:               26,
	// 	MotorEnablePin:          23,
	// }
	// err = motor.Calibrate()
	// if err != nil {
	// 	fmt.Println("Error calibrating motor 1: ", err)
	// }
	// err = motor2.Calibrate()
	// if err != nil {
	// 	fmt.Println("Error calibrating motor 2: ", err)
	// }

	// pos, err := motor.ReadPosition()
	// if err != nil {
	// 	fmt.Println("Error reading position: ", err)
	// }
	// pos2, err := motor2.ReadPosition()
	// if err != nil {
	// 	fmt.Println("Error reading position: ", err)
	// }
	// fmt.Println("Read position: ", pos)
	// fmt.Println("Read position2: ", pos2)

	// // // Read ADC values for channels 0-7 in a loop with 16ms delay
	// // for j := 0; j < 2000; j++ {
	// // 	// Clear terminal
	// // 	fmt.Print("\033[H\033[2J")

	// // 	for i := 0; i < 8; i++ {
	// // 		spiReadBuf[1] = byte((8 + i) << 4)
	// // 		bytes, data, err = pgpio.SpiXfer(spi, spiReadBuf)
	// // 		if err != nil {
	// // 			fmt.Println("Error reading SPI: ", err)
	// // 		}
	// // 		fmt.Println("Read ", bytes, " bytes from SPI: ", data)

	// // 		// Parse the actual value
	// // 		adcValue = (int(data[1]&3) << 8) + int(data[2])
	// // 		fmt.Println("ADC value: ", adcValue)

	// // 		// Sleep for 16ms
	// // 		// time.Sleep(16 * time.Millisecond)

	// // 	}
	// // }

	// hwManager.Close()

	// // Close SPI
	// _, err = pgpio.SpiClose(spi)
	// if err != nil {
	// 	fmt.Println("Error closing SPI: ", err)
	// }

	// fmt.Println("Hello, Pigpiod!")
}

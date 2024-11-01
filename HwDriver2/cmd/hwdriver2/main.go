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

	fmt.Println("Hello, Pigpiod!")
}

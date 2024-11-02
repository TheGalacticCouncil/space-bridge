package main

import (
	"fmt"
	"hwdriver2/internal/core"
)

// TODO: Implement signal handling to gracefully shutdown the program
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
}

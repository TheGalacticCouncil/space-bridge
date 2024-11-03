package main

import (
	"fmt"
	"hwdriver2/internal/core"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	fmt.Println("Hello, world!")

	// Initialize core
	core, err := core.NewCore()
	if err != nil {
		fmt.Println("Error initializing core: ", err)
		return
	}

	// Set up signal handling
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	// Run core in a separate goroutine
	done := make(chan bool, 1)
	go func() {
		core.Run()
		done <- true
	}()

	// Wait for a signal
	sig := <-sigs
	fmt.Println("Received signal:", sig)

	// Call core.Close() to clean up
	if err := core.Close(); err != nil {
		fmt.Println("Error closing core: ", err)
	}

	// Wait for the core to finish running
	<-done
	fmt.Println("Exiting")
}

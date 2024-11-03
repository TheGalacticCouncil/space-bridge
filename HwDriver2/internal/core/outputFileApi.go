package core

import (
	"bufio"
	"fmt"
	"os"
)

type PositionProvider interface {
	ReadPosition() (int, error)
	ReadTouchPosition() (int, error)
}

type OutputFileApiWriter struct {
	PositionProviders []PositionProvider
	FilePath          string

	fhandle *os.File
}

func (o *OutputFileApiWriter) Tick() error {
	return nil
}

func (o *OutputFileApiWriter) Close() error {
	if o.fhandle != nil {
		return o.fhandle.Close()
	}
	return nil
}

// WritePositionsToFile writes the positions of all PositionProviders to a file
// Each line in the file represents one PositionProvider. The line contains only
// the position as 0 padded 10 bit unsigned integer (0-1023).
func (o *OutputFileApiWriter) WritePositionsToFile() error {
	// Seek to beginning of file to overwrite
	if _, err := o.fhandle.Seek(0, 0); err != nil {
		return fmt.Errorf("failed to seek file: %w", err)
	}
	w := bufio.NewWriter(o.fhandle)

	for _, provider := range o.PositionProviders {
		position, err := provider.ReadPosition()
		if err != nil {
			return fmt.Errorf("failed to read position: %w", err)
		}
		if position < 0 || position > 1023 {
			return fmt.Errorf("invalid position: %d", position)
		}
		_, err = fmt.Fprintf(w, "%04d\n", position)
		if err != nil {
			return fmt.Errorf("failed to write to file: %w", err)
		}
		err = w.Flush()
		if err != nil {
			return fmt.Errorf("failed to flush file: %w", err)
		}
	}

	return nil
}

func NewOutputFileApiWriter(positionProviders []PositionProvider, filePath string) (*OutputFileApiWriter, error) {
	fhandle, err := os.OpenFile(filePath, os.O_TRUNC|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %w", err)
	}

	ofaw := &OutputFileApiWriter{
		PositionProviders: positionProviders,
		FilePath:          filePath,
		fhandle:           fhandle,
	}

	return ofaw, nil
}

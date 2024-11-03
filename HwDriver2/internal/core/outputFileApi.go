package core

import (
	"bufio"
	"fmt"
	"os"
)

type PositionProvider interface {
	ReadPosition() (int, error)
	ReadTouchRaw() (int, error)
	ReadTouchPosition() (int, error)
}

type OutputFileApiWriter struct {
	PositionProviders     []PositionProvider
	PositionFilePath      string
	TouchFilePath         string
	TouchPositionFilePath string

	fhandlepos      *os.File
	fhandletouch    *os.File
	fhandletouchpos *os.File
}

func (o *OutputFileApiWriter) Tick() error {
	return nil
}

func (o *OutputFileApiWriter) Close() error {
	// TODO: Gather errors and return them all
	if o.fhandlepos != nil {
		o.fhandlepos.Close()
	}
	if o.fhandletouch != nil {
		o.fhandletouch.Close()
	}
	if o.fhandletouchpos != nil {
		o.fhandletouchpos.Close()
	}
	return nil
}

// WritePositionsToFile writes the positions of all PositionProviders to a file
// Each line in the file represents one PositionProvider. The line contains only
// the position as 0 padded 10 bit unsigned integer (0-1023).
func (o *OutputFileApiWriter) WritePositionsToFile() error {
	// Seek to beginning of file to overwrite
	if _, err := o.fhandlepos.Seek(0, 0); err != nil {
		return fmt.Errorf("failed to seek file: %w", err)
	}
	if _, err := o.fhandletouch.Seek(0, 0); err != nil {
		return fmt.Errorf("failed to seek file: %w", err)
	}
	w := bufio.NewWriter(o.fhandlepos)
	wt := bufio.NewWriter(o.fhandletouch)

	for _, provider := range o.PositionProviders {
		// Handle position
		position, err := provider.ReadPosition()
		if err != nil {
			return fmt.Errorf("failed to read position: %w", err)
		}

		_, err = fmt.Fprintf(w, "%04d\n", position)
		if err != nil {
			return fmt.Errorf("failed to write to file: %w", err)
		}

		err = w.Flush()
		if err != nil {
			return fmt.Errorf("failed to flush file: %w", err)
		}

		// Handle touch
		touchValue, err := provider.ReadTouchRaw()
		if err != nil {
			return fmt.Errorf("failed to read touch value: %w", err)
		}

		_, err = fmt.Fprintf(wt, "%04d\n", touchValue)
		if err != nil {
			return fmt.Errorf("failed to write to touch file: %w", err)
		}

		err = wt.Flush()
		if err != nil {
			return fmt.Errorf("failed to flush touch file: %w", err)
		}
	}

	return nil
}

func NewOutputFileApiWriter(positionProviders []PositionProvider, filePath string, touchFilePath string, touchPositionFilePath string) (*OutputFileApiWriter, error) {
	fhandlepos, err := os.OpenFile(filePath, os.O_TRUNC|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %w", err)
	}
	fhandletouch, err := os.OpenFile(touchFilePath, os.O_TRUNC|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %w", err)
	}
	fhandletouchpos, err := os.OpenFile(touchPositionFilePath, os.O_TRUNC|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %w", err)
	}

	ofaw := &OutputFileApiWriter{
		PositionProviders:     positionProviders,
		PositionFilePath:      filePath,
		TouchFilePath:         touchFilePath,
		TouchPositionFilePath: touchPositionFilePath,
		fhandlepos:            fhandlepos,
		fhandletouch:          fhandletouch,
		fhandletouchpos:       fhandletouchpos,
	}

	return ofaw, nil
}

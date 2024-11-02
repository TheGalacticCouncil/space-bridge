package hw

type SpiAccess interface {
	SpiOpen(spiChannel int, baudRate int, flags []byte) (int, error)
	SpiXfer(spiHandle int, data []byte) (int, []byte, error)
	SpiClose(spiHandle int) (int, error)
}

type mcp3008 struct {
	hw         SpiAccess
	spiChannel int
	spiHandle  int
}

func (m *mcp3008) Read(adcChannel int) (int, error) {
	readCmdBytes := make([]byte, 4)
	// 1 bit start, 1 bit single-ended, 3 bits channel, rest don't care
	// See https://cdn-shop.adafruit.com/datasheets/MCP3008.pdf page 19 for details
	readCmdBytes[0] = 0x01 // Start bit
	readCmdBytes[1] = byte((8 + adcChannel) << 4)
	readCmdBytes[2] = 0x00 // Don't care
	readCmdBytes[3] = 0x00 // Don't care

	_, data, err := m.hw.SpiXfer(m.spiHandle, readCmdBytes)
	if err != nil {
		return 0, err
	}

	// Parse the actual 10-bit (0-1023) value
	adcValue := (int(data[1]&3) << 8) + int(data[2])

	return adcValue, nil
}

func (m *mcp3008) Close() (int, error) {
	return m.hw.SpiClose(m.spiHandle)
}

func NewMcp3008(spiChannel int, hw SpiAccess) (*mcp3008, error) {
	// Open SPI
	flags := []byte{
		0x00, 0x01, 0x00, 0x00, // 0x00010000, use AUX SPI
	}
	spiHandle, err := hw.SpiOpen(spiChannel, 1350000, flags)
	if err != nil {
		return nil, err
	}

	return &mcp3008{
		hw:         hw,
		spiChannel: spiChannel,
		spiHandle:  spiHandle,
	}, nil
}

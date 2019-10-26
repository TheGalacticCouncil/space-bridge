#include "ADC.h"

#include <stdexcept>

ADC::ADC(unsigned channel, bool aux)
{
	// standard port has two chip select, second port has three
	unsigned flags;
	if (aux)
	{
		flags = 0x100;    // set A bit
		if (channel < 0 or channel > 2)
			throw std::invalid_argument("Channel must be 0 (CE0), 1 (CE1) or 2 (CE2)");
	}
	else
	{
		flags = 0;
		if (channel < 0 or channel > 1)
			throw std::invalid_argument("Channel must be 0 (CE0) or 1 (CE1)");
	}

    // TODO: Test the performance impact of different baud rates. 1,35Mhz should be max for 3.3v.
    _handle = spiOpen(channel, 1350000, flags);

    if (_handle < 0)
    {
        // TODO: Check what error we got
        throw std::runtime_error("Error opening SPI channel.");
    }
}

ADC::~ADC()
{
	spiClose(_handle);
}

unsigned ADC::read(unsigned channel) 
{
	/*	channel corresponds to pins 1 (ch0) to 8 (ch7)
	we have to send three bytes
	byte 0 has 7 zeros and a start bit
	byte 1 has the top bit set to indicate
	single rather than differential operation
	the next three bits contain the channel
	the bottom four bits are zero
	byte 2 contains zeros (don't care)
	3 bytes are returned
	byte 0 is ignored
	byte 1 contains the high 2 bits
	byte 2 contains the low 8 bits
*/
	if (channel < 0 or channel > 7)
		throw std::invalid_argument("channel must be 0 - 7");


	char buf[4];
	buf[0] = 1;
    buf[1] = (char)((8 + channel) << 4);
	buf[2] = 0;
    buf[3] = 0;

	int count = spiXfer(_handle, buf, buf, 3);

	// return value 0 - 1023
    if (count > 0) 
        return ((buf[1] & 3) << 8) | buf[2];
    else
		return 0;
}

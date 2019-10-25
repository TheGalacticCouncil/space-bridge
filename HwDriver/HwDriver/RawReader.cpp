#include "RawReader.h"
#include "IHwAccess.h"

RawReader::RawReader(unsigned channelNumber, std::shared_ptr<IHwAccess> hw):
    _channelNumber(channelNumber), _hw(hw)
{
}

unsigned RawReader::readCurrentValue()
{
    return _hw->readAnalogPin(0, _channelNumber);
}

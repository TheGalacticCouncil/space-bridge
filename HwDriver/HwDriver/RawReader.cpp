#include "RawReader.h"
#include "IHwAccess.h"

RawReader::RawReader(unsigned pinNumber, std::shared_ptr<IHwAccess> hw)
    :
    _pinNumber(pinNumber), _hw(hw), _channelNumber(0)
{
}

RawReader::RawReader(unsigned channelNumber, unsigned pinNumber, std::shared_ptr<IHwAccess> hw)
    : _hw(hw), _pinNumber(pinNumber), _channelNumber(channelNumber)
{
}


unsigned RawReader::readCurrentValue()
{
    return _hw->readAnalogPin(_channelNumber, _pinNumber);
}

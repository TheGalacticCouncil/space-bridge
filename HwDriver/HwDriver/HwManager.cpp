#include "HwManager.h"
#include "ADC.h"

#include <stdexcept>

HwManager::HwManager()
{
}

int HwManager::readAnalogPin(unsigned mcpChannel, unsigned pin)
{
    ADC& adc = _getAdcForChannel(mcpChannel);

    return adc.read(pin);
}

ADC& HwManager::_getAdcForChannel(unsigned channel)
{
    if (channel > _maxChannel)
        throw new std::out_of_range("Requested mcpChannel is out of range.");

    if (_adcs.at(channel) == nullptr)
        _adcs.at(channel) = std::make_shared<ADC>(channel);

    return *_adcs.at(channel).get();
}

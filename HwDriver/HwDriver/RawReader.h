#pragma once
#include "IPositionFeedback.h"

#include <memory>

class IHwAccess;

class RawReader :
    public IPositionFeedback
{
public:
    RawReader(unsigned pinNumber, std::shared_ptr<IHwAccess> hw);
    RawReader(unsigned channelNumber, unsigned pinNumber, std::shared_ptr<IHwAccess> hw);

    unsigned readCurrentValue();

private:
    unsigned _pinNumber;
    unsigned _channelNumber;
    std::shared_ptr<IHwAccess> _hw;
};


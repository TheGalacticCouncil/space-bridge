#pragma once
#include "IPositionFeedback.h"

#include <memory>

class IHwAccess;

class RawReader :
    public IPositionFeedback
{
public:
    RawReader(unsigned channelNumber, std::shared_ptr<IHwAccess> hw);

    unsigned readCurrentValue();

private:
    unsigned _channelNumber;
    std::shared_ptr<IHwAccess> _hw;
};


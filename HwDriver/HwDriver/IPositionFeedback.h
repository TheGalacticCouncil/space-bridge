#pragma once

class IPositionFeedback
{
public:
    virtual unsigned readCurrentValue() = 0;
};


#pragma once
#include "IPositionFeedback.h"
#include <memory>

class BroadcastEventReceiver;

class EventReader :
    public IPositionFeedback
{
public:
    EventReader(std::string eventName = "MOTOR_POSITION", unsigned minValue = 0, unsigned maxValue = 1024);
    ~EventReader();

    unsigned readCurrentValue();

private:
    unsigned _minValue;
    unsigned _maxValue;
    std::unique_ptr<BroadcastEventReceiver> _eventReceiver;
};


#pragma once
#include "IPositionFeedback.h"
#include <memory>

class NetworkManager;
class IEventReceiver;

class EventReader :
    public IPositionFeedback
{
public:
    EventReader(std::shared_ptr<NetworkManager> networkManager, std::string eventName = "MOTOR_POSITION", unsigned minValue = 0, unsigned maxValue = 1024);
    ~EventReader();

    unsigned readCurrentValue();

private:
    unsigned _minValue;
    unsigned _maxValue;
    std::string _eventName;
    std::shared_ptr<IEventReceiver> _eventReceiver;
};


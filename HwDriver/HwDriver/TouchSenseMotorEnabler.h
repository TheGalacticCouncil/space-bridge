#pragma once
#include "IMotorEnable.h"

#include <memory>
#include <chrono>

class IHwAccess;

enum class TouchState { Touching, NotTouching};

class TouchSenseMotorEnabler :
    public IMotorEnable
{
public:
    TouchSenseMotorEnabler(unsigned channelNumber, unsigned pinNumber, std::shared_ptr<IHwAccess> hw);
    
    bool motorEnabled();
private:
    unsigned _pinNumber;
    unsigned _channelNumber;
    std::shared_ptr<IHwAccess> _hw;
    std::chrono::steady_clock::time_point _lastTouchDetectedTimestamp;
    std::chrono::steady_clock::time_point _enableBegunTimestamp;
    TouchState _touchState;
};
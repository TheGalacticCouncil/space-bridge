#include "TouchSenseMotorEnabler.h"
#include "IHwAccess.h"

#include <iostream>

const int TOUCH_THRESHOLD = 800;
const int MINIMUM_MS_FROM_LAST_DETECTED_TOUCH = 50;
const int MINIMUM_MS_FROM_LAST_ENABLED_START = 500;

TouchSenseMotorEnabler::TouchSenseMotorEnabler(unsigned channelNumber, unsigned pinNumber, std::shared_ptr<IHwAccess> hw)
    : _channelNumber(channelNumber)
    , _pinNumber(pinNumber)
    , _hw(hw)
    , _touchState(TouchState::NotTouching)
{
}

bool TouchSenseMotorEnabler::motorEnabled()
{
    auto pinValue = _hw->readAnalogPin(_channelNumber, _pinNumber);
    
    if (pinValue > TOUCH_THRESHOLD)
    {
        _lastTouchDetectedTimestamp = std::chrono::steady_clock::now();
        
        if (_touchState != TouchState::Touching)
        {
            _touchState = TouchState::Touching;
            _enableBegunTimestamp = std::chrono::steady_clock::now();
        }
    }
    else
    {
        auto now = std::chrono::steady_clock::now();
        auto diff = std::chrono::duration_cast<std::chrono::milliseconds>(now - _lastTouchDetectedTimestamp).count();
        
        if (diff > MINIMUM_MS_FROM_LAST_DETECTED_TOUCH)
        {
            if (diff > MINIMUM_MS_FROM_LAST_ENABLED_START)
            {
                _touchState = TouchState::NotTouching;
            }
        }
    }
    
    if (_touchState == TouchState::Touching)
    {
        return false;
    }
    
    return true;
}
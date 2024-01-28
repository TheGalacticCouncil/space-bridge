#include "MotorDriver.h"
#include "IPositionFeedback.h"
#include "IMotorEnable.h"

#include <cmath>
#include <iostream>

const int CALIBRATION_DRIVE_TIME_EXTRA{ 200000 };
//const int ACCURACY_PROMILLE{ 30 }; // 1 promille = 0.1 percentage
const int MAX_WOBBLE_COUNT{ 10 }; // Not used currently
const int MAX_LOOP_ITERATIONS{ 1000 };
const int LOOP_SLEEP_MICROS{ 1000 };
const int MAX_PWM{ 240 };
const int MIN_PWM{ 230 };
const int PWM_RANGE{ MAX_PWM - MIN_PWM };

MotorDriver::MotorDriver(std::unique_ptr<IPositionFeedback> positionFeedback, std::unique_ptr<IMotorEnable> motorEnabler, int pin1, int pin2, unsigned enablePin, int accuracyPromille)
    : _position(std::move(positionFeedback)), _motorEnabler(std::move(motorEnabler)), _optionCount(10), _pin1(pin1), _pin2(pin2), _previousSpeed(0), _previousOptionIndex(0), ACCURACY_PROMILLE(accuracyPromille), _latestDriveDisabledValue(0)
{
    // Enable motor
    gpioSetMode(enablePin, PI_OUTPUT);
    gpioWrite(enablePin, 1);
    
    // Initiate PWM driving
    gpioSetMode(_pin1, PI_OUTPUT);
    gpioSetMode(_pin2, PI_OUTPUT);

    gpioPWM(_pin1, 0);
    gpioPWM(_pin2, 0);

    // Set frequency to max
    gpioSetPWMfrequency(_pin1, 1000000);
    gpioSetPWMfrequency(_pin2, 1000000);

    // Find out minimum and maximum value of the position of the motor
    gpioPWM(_pin1, 255);
    gpioSleep(PI_TIME_RELATIVE, 1, CALIBRATION_DRIVE_TIME_EXTRA);
    gpioPWM(_pin1, 0);

    _maxValue = _position->readCurrentValue();

    gpioPWM(_pin2, 255);
    gpioSleep(PI_TIME_RELATIVE, 1, CALIBRATION_DRIVE_TIME_EXTRA);
    gpioPWM(_pin2, 0);

    _minValue = _position->readCurrentValue();

    // We wan't _pin1 to drive value up and _pin2 to drive value down. Let's swap those if needed.
    if (_minValue > _maxValue) {
        int temp = _pin1;
        _pin1 = _pin2;
        _pin2 = temp;

        temp = _maxValue;
        _maxValue = _minValue;
        _minValue = temp;
    }

    _valueRange = _maxValue - _minValue;
    _maxDeviation = std::round(_valueRange * ((float)ACCURACY_PROMILLE / (float)1000));
    _optionValueRange = std::round((float)_valueRange / (float)_optionCount);

    // For debug purposes
    std::cout << "MotorDriver::MotorDriver() - Values\n"
        << "_minValue:\t"           << _minValue            << "\n"
        << "_maxValue:\t"           << _maxValue            << "\n"
        << "_maxDeviation:\t"       << _maxDeviation        << "\n";
}

int MotorDriver::driveToValue(int targetValue)
{
    unsigned currentPosition = _position->readCurrentValue();
    
    // Check if motor is enabled
    if (!_motorEnabler->motorEnabled())
    {
        _latestDriveDisabledValue = currentPosition;
        
        return 0;
    }
    
    // Get distance from current value
    int distance;
    distance = targetValue - currentPosition;

    if (std::abs(distance) < _maxDeviation)
        return distance;

    float speedMultiplier = 1.0f;

    for (int i = 0; std::abs(distance) > _maxDeviation; ++i) {
        // Check if motor is enabled
        if (!_motorEnabler->motorEnabled())
        {
            _latestDriveDisabledValue = currentPosition;

            _stop();
            
            return 0;
        }
        
        if (std::abs(distance) < _maxDeviation * 4)
            speedMultiplier = 0.45f;
        else if (std::abs(distance) < _maxDeviation * 6)
            speedMultiplier = 0.55f;
        else if (std::abs(distance) < _maxDeviation * 8)
            speedMultiplier = 0.6f;
        else if (std::abs(distance) < _maxDeviation * 10)
            speedMultiplier = 0.7f;
        else if (std::abs(distance) < _maxDeviation * 12)
            speedMultiplier = 0.8f;

        if (distance > 0)
            _increase(std::round(255 * speedMultiplier));
        else
            _decrease(std::round(255 * speedMultiplier));

        //if (i > MAX_WOBBLE_COUNT) {
        //    // Not good, we overshoot multiple times...
        //    std::cout << "MotorDriver::driveToValue - Overshooting over " << MAX_WOBBLE_COUNT << " times! Distance left:\t" << distance << "\n";

        //    break;
        //}

        if (i > MAX_LOOP_ITERATIONS / 2) {
            std::cout << "Iteration " << i << " in motor control loop.\nSpeed:\t" << std::round(255 * speedMultiplier) << "\n";
        }

        if (i > MAX_LOOP_ITERATIONS) {
            // Not good.
            std::cout << "MotorDriver::driveToValue - Max loop count of " << MAX_LOOP_ITERATIONS << " reached!\n";

            break;
        }

        gpioDelay(LOOP_SLEEP_MICROS);

        distance = targetValue - _position->readCurrentValue();
    }

    _stop();

    return distance;
}

float MotorDriver::driveToPercentage(int targetPercentage)
{
    return 0.0f;
}

int MotorDriver::readValue()
{
    return _position->readCurrentValue();
}

unsigned MotorDriver::getLatestDriveDisabledValue()
{
    return _latestDriveDisabledValue;
}

float MotorDriver::readPercentage()
{
    return 0.0f;
}

void MotorDriver::setOperatingMode(OperatingMode mode, int optionCount)
{
    _mode = mode;

    if (mode == OperatingMode::Guide) {
        _optionCount = optionCount;
        //_optionValueRange = std::round((float)_valueRange / (float)_optionCount);
        _optionValueRange = std::round((float)_valueRange / (float)(_optionCount - 1));

        std::cout << "Option values:\n"
            << "_optionCount:\t" << _optionCount << "\n"
            << "_optionValueRange:\t" << _optionValueRange << "\n";
    }

}

void MotorDriver::tick()
{
    if (_mode != OperatingMode::Guide)
        return;

    _applyGuideTorque();
}

void MotorDriver::_stop()
{
    if (_state == MotorState::Stopped)
        return;

    gpioPWM(_pin1, 0);
    gpioPWM(_pin2, 0);

    _state = MotorState::Stopped;
}

void MotorDriver::_increase(int speed, int durationMicros)
{
    if (_state != MotorState::Stopped) {
        gpioPWM(_pin1, 0);
        gpioPWM(_pin2, 0);
    }

    // Can be set to stopped already as state is not accessed concurrently
    _state = MotorState::Stopped;

    gpioPWM(_pin1, speed);
    gpioDelay(durationMicros);
    gpioPWM(_pin1, 0);
}

void MotorDriver::_increase(int speed)
{
    if (_state == MotorState::Decreasing)
        gpioPWM(_pin2, 0);

    gpioPWM(_pin1, speed);

    if (speed > 0)
        _state = MotorState::Increasing;
    else
        _state = MotorState::Stopped;
}

void MotorDriver::_decrease(int speed, int durationMicros)
{
    if (_state != MotorState::Stopped) {
        gpioPWM(_pin1, 0);
        gpioPWM(_pin2, 0);
    }
    
    // Can be set to stopped already as state is not accessed concurrently
    _state = MotorState::Stopped;

    gpioPWM(_pin2, speed);
    gpioDelay(durationMicros);
    gpioPWM(_pin2, 0);
}

void MotorDriver::_decrease(int speed)
{
    if (_state == MotorState::Increasing)
        gpioPWM(_pin1, 0);

    gpioPWM(_pin2, speed);

    if (speed > 0)
        _state = MotorState::Decreasing;
    else
        _state = MotorState::Stopped;
}

void MotorDriver::_drive(int speed)
{
    if (speed == 0)
        _stop();
    else if (speed > 0)
        _increase(speed);
    else
        _decrease(std::abs(speed));
}

void MotorDriver::_applyGuideTorque()
{
    int currentPosition = _position->readCurrentValue();
    

    // Determine the nearest option and distance from it
    int optionIndex = (currentPosition+_optionValueRange/2) / _optionValueRange;
    int optionMidpoint = optionIndex * _optionValueRange;
    int distance = std::abs(optionMidpoint - currentPosition);
    
    int maxDeviation;
    if (_state != MotorState::Stopped)
    {
        maxDeviation = std::round((float)_maxDeviation * 0.75);
    }
    else
    {
        maxDeviation = _maxDeviation;
    }
    bool withinDeviation = distance < maxDeviation;
    
    std::cout 
        << "Current position:\t" << currentPosition << "\n"
        << "Option index:\t" << optionIndex << "\n"
        << "Distance:\t" << distance << "\n"
        << "Within deviation:\t" << withinDeviation << "\n";
        

    if (withinDeviation) {
        _stop();

        _previousOptionIndex = optionIndex;

        return;
    }

    // Seems like we're going to move! But where to?
    int previousOptionMidpoint = _previousOptionIndex * _optionValueRange;
    int distanceFromPreviousOption = previousOptionMidpoint - currentPosition;
    //int direction = distanceFromPreviousOption > 0 ? -1 : 1;
    //int direction = distance > distanceFromPreviousOption ? -1 : 1;
    int direction; 
    if (optionIndex == _previousOptionIndex)
    {
        direction = optionMidpoint - currentPosition > 0 ? -1 : 1;
    }
    else
    {
        direction = optionIndex > _previousOptionIndex ? 1 : -1;
    }

    _drive(direction * 255);
}

int MotorDriver::_normalizedSpeedToAbsolude(float speed)
{
    // 0 = PWM_MIN, 1 = PWM_MAX
    return MIN_PWM + std::round(speed * PWM_RANGE);
}

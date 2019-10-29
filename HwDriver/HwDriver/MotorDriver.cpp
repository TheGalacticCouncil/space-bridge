#include "MotorDriver.h"
#include "IPositionFeedback.h"

#include <cmath>
#include <iostream>

const int CALIBRATION_DRIVE_TIME_EXTRA{ 200000 };
const int ACCURACY_PROMILLE{ 25 }; // 1 promille = 0.1 percentage
const int MAX_WOBBLE_COUNT{ 10 }; // Not used currently
const int MAX_LOOP_ITERATIONS{ 1000 };
const int LOOP_SLEEP_MICROS{ 1000 };

MotorDriver::MotorDriver(std::unique_ptr<IPositionFeedback> positionFeedback, unsigned pin1, unsigned pin2)
    : _position(std::move(positionFeedback)), _pin1(pin1), _pin2(pin2)
{
    // Initiate PWM driving
    gpioSetMode(_pin1, PI_OUTPUT);
    gpioSetMode(_pin2, PI_OUTPUT);

    gpioPWM(_pin1, 0);
    gpioPWM(_pin2, 0);

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

    // For debug purposes
    std::cout << "MotorDriver::MotorDriver() - Values\n"
        << "_minValue:\t" << _minValue << "\n"
        << "_maxValue:\t" << _maxValue << "\n"
        << "_maxDeviation:\t" << _maxDeviation << "\n";
}

int MotorDriver::driveToValue(unsigned targetValue)
{
    // Get distance from current value
    int distance;
    distance = targetValue - _position->readCurrentValue();

    if (std::abs(distance) < _maxDeviation)
        return distance;

    float speedMultiplier = 1.0f;

    for (int i = 0; std::abs(distance) > _maxDeviation; ++i) {
        if (std::abs(distance) < _maxDeviation * 4)
            speedMultiplier = 0.85f;

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

float MotorDriver::driveToPercentage(unsigned targetPercentage)
{
    return 0.0f;
}

int MotorDriver::readValue()
{
    return _position->readCurrentValue();
}

float MotorDriver::readPercentage()
{
    return 0.0f;
}

void MotorDriver::_stop()
{
    gpioPWM(_pin1, 0);
    gpioPWM(_pin2, 0);

    _state = MotorState::Stopped;
}

void MotorDriver::_increase(unsigned speed, unsigned durationMicros)
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

void MotorDriver::_increase(unsigned speed)
{
    if (_state == MotorState::Decreasing)
        gpioPWM(_pin2, 0);

    gpioPWM(_pin1, speed);

    if (speed > 0)
        _state = MotorState::Increasing;
    else
        _state = MotorState::Stopped;
}

void MotorDriver::_decrease(unsigned speed, unsigned durationMicros)
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

void MotorDriver::_decrease(unsigned speed)
{
    if (_state == MotorState::Increasing)
        gpioPWM(_pin1, 0);

    gpioPWM(_pin2, speed);

    if (speed > 0)
        _state = MotorState::Decreasing;
    else
        _state = MotorState::Stopped;
}

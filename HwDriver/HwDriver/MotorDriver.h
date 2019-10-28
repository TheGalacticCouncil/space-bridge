#pragma once
#include "IMotor.h"
#include "ioBase.h"

#include <memory>

class IPositionFeedback;

enum class MotorState {Increasing, Decreasing, Stopped};

class MotorDriver :
    public IMotor, public ioBase
{
public:
    // Constructor for two-pin case
    MotorDriver(std::unique_ptr<IPositionFeedback> positionFeedback, unsigned pin1, unsigned pin2);

    // Constructor for enable-pin case
    // TODO

    // Implement IMotor interface
    int driveToValue(unsigned targetValue);
    float driveToPercentage(unsigned targetPercentage);
    int readValue();
    float readPercentage();

private:
    void _stop();
    void _increase(unsigned speed, unsigned durationMicros);
    void _increase(unsigned speed);
    void _decrease(unsigned speed, unsigned durationMicros);
    void _decrease(unsigned speed);

    std::unique_ptr<IPositionFeedback> _position;

    int _minValue;
    int _maxValue;
    int _valueRange;
    int _maxDeviation;

    unsigned _pin1;
    unsigned _pin2;

    MotorState _state{ MotorState::Stopped };
};


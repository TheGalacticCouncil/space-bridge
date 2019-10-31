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
    MotorDriver(std::unique_ptr<IPositionFeedback> positionFeedback, int pin1, int pin2, int accuracyPromille = 30);

    // Constructor for enable-pin case
    // TODO

    // Implement IMotor interface
    int driveToValue(int targetValue);
    float driveToPercentage(int targetPercentage);
    int readValue();
    float readPercentage();
    void setOperatingMode(OperatingMode mode, int optionCount = 4);

    void tick(); // some dt param maybe incoming...

private:
    void _stop();
    void _increase(int speed, int durationMicros);
    void _increase(int speed);
    void _decrease(int speed, int durationMicros);
    void _decrease(int speed);
    void _drive(int speed);

    void _applyGuideTorque();
    int _normalizedSpeedToAbsolude(float speed);

    std::unique_ptr<IPositionFeedback> _position;

    int _minValue;
    int _maxValue;
    int _valueRange;
    int _maxDeviation;
    int _optionCount;
    int _optionValueRange;

    int _previousSpeed;
    int _previousOptionIndex;

    int _pin1;
    int _pin2;

    const int ACCURACY_PROMILLE;

    MotorState _state{ MotorState::Stopped };
    OperatingMode _mode{ OperatingMode::Target };
};


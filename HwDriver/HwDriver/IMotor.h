#pragma once

class IMotor
{
public:
    // Drives the motor to given integer value
    // Returns the offset from target
    virtual int driveToValue(unsigned targetValue) = 0;
    virtual float driveToPercentage(unsigned targetPercentage) = 0;
    virtual int readValue() = 0;
    virtual float readPercentage() = 0;
};


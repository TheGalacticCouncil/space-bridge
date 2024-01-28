#pragma once

enum class OperatingMode { Target, Guide };

class IMotor
{
public:
    // Drives the motor to given integer value
    // Returns the offset from target
    virtual int driveToValue(int targetValue) = 0;
    virtual float driveToPercentage(int targetPercentage) = 0;
    virtual int readValue() = 0;
    virtual unsigned getLatestDriveDisabledValue() = 0;
    virtual float readPercentage() = 0;
    virtual void setOperatingMode(OperatingMode mode, int optionCount = 2) = 0;
    virtual void tick() = 0;
};


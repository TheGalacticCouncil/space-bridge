#pragma once

#include <memory>
#include <vector>
#include <iostream>
#include <fstream>

class IHwAccess;
class IMotor;

class AnalogApiProvider
{
public:
    AnalogApiProvider(std::shared_ptr<IHwAccess> hwAccess);
    ~AnalogApiProvider();

    void tick();
    void setMotorsVector(std::vector<std::shared_ptr<IMotor>> motors);

private:
    std::vector<int> _readValues();
    std::vector<unsigned> _readMotorValues();
    void _publishValues(std::vector<int> values);
    void _publishMotorValues(std::vector<unsigned> values);

    std::vector<std::shared_ptr<IMotor>> _motors;
    std::shared_ptr<IHwAccess> _hwAccess;
    std::ofstream _file;
    std::ofstream _motorValuesFile;
};


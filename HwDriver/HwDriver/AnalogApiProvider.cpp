#include "AnalogApiProvider.h"

#include "IHwAccess.h"
#include "IMotor.h"

#include <iostream>
#include <iomanip>
#include <fstream>
#include <memory>

// TODO: Make file writing "atomic", e.g. by following
//       https://stackoverflow.com/questions/29261648/atomic-writing-to-file-on-linux

// TODO2: Implement another way to do cross-process communication...

const char* MOTOR_VALUES_OUTPUT_FILE = "/tmp/mcp3008-touched-values-output.txt";

AnalogApiProvider::AnalogApiProvider(std::shared_ptr<IHwAccess> hwAccess) :
    _hwAccess(hwAccess)
{
    _file.open("mcp3008-output.txt", std::ios::trunc);
    _motorValuesFile.open(MOTOR_VALUES_OUTPUT_FILE, std::ios::trunc);
}

AnalogApiProvider::~AnalogApiProvider()
{
    _file.close();
    _motorValuesFile.close();
}

void AnalogApiProvider::tick()
{
    //_publishValues(
    //    _readValues()
    //);
    _publishMotorValues(
        _readMotorValues()
    );
}

void AnalogApiProvider::setMotorsVector(std::vector<std::shared_ptr<IMotor>> motors)
{
    _motors = motors;
}

std::vector<int> AnalogApiProvider::_readValues()
{
    std::vector<int> values{
        _hwAccess->readAnalogPin(0, 0),
        _hwAccess->readAnalogPin(0, 1),
        _hwAccess->readAnalogPin(0, 2),
        _hwAccess->readAnalogPin(0, 3),
        _hwAccess->readAnalogPin(0, 4),
        _hwAccess->readAnalogPin(0, 5),
        _hwAccess->readAnalogPin(0, 6),
        _hwAccess->readAnalogPin(0, 7),
        _hwAccess->readAnalogPin(1, 0),
        _hwAccess->readAnalogPin(1, 1),
        _hwAccess->readAnalogPin(1, 2),
        _hwAccess->readAnalogPin(1, 3),
        _hwAccess->readAnalogPin(1, 4),
        _hwAccess->readAnalogPin(1, 5),
        _hwAccess->readAnalogPin(1, 6),
        _hwAccess->readAnalogPin(1, 7),
        _hwAccess->readAnalogPin(2, 0),
        _hwAccess->readAnalogPin(2, 1),
        _hwAccess->readAnalogPin(2, 2),
        _hwAccess->readAnalogPin(2, 3),
        _hwAccess->readAnalogPin(2, 4),
        _hwAccess->readAnalogPin(2, 5),
        _hwAccess->readAnalogPin(2, 6),
        _hwAccess->readAnalogPin(2, 7),
    };

    return values;
}

std::vector<unsigned> AnalogApiProvider::_readMotorValues()
{
    std::vector<unsigned> values;
    
    for (int i = 0; i < _motors.size(); ++i)
    {
        values.push_back(_motors.at(i)->getLatestDriveDisabledValue()); 
    }
    
    return values;
}

void AnalogApiProvider::_publishValues(std::vector<int> values)
{
    _file.seekp(0);

    for (auto const& value : values) {
        _file << std::setfill('0') << std::setw(4) << value << "\n";
    }

    _file << std::endl;
}

void AnalogApiProvider::_publishMotorValues(std::vector<unsigned> values)
{
    _motorValuesFile.seekp(0);
    
    for (auto const& value : values) {
        _motorValuesFile << std::setfill('0') << std::setw(4) << value << "\n";
    }

    _file << std::endl;
}
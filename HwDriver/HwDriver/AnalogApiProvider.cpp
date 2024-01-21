#include "AnalogApiProvider.h"

#include "IHwAccess.h"

#include <iostream>
#include <iomanip>
#include <fstream>
#include <memory>

AnalogApiProvider::AnalogApiProvider(std::shared_ptr<IHwAccess> hwAccess) :
    _hwAccess(hwAccess)
{
    _file.open("mcp3008-output.txt", std::ios::trunc);
}

AnalogApiProvider::~AnalogApiProvider()
{
    _file.close();
}

void AnalogApiProvider::tick()
{
    _publishValues(
        _readValues()
    );
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
        _hwAccess->readAnalogPin(1, 1),
        _hwAccess->readAnalogPin(1, 2),
        _hwAccess->readAnalogPin(1, 3),
        _hwAccess->readAnalogPin(1, 4),
        _hwAccess->readAnalogPin(1, 5),
        _hwAccess->readAnalogPin(1, 6),
        _hwAccess->readAnalogPin(1, 7),
    };

    return values;
}

void AnalogApiProvider::_publishValues(std::vector<int> values)
{
    //std::cout << "Read values:\n";

    //for (auto const& val : values) {
    //    std::cout << val << "\n";
    //}
    _file.seekp(0);

    for (auto const& value : values) {
        _file << std::setfill('0') << std::setw(4) << value << "\n";
    }

    _file << std::endl;
}

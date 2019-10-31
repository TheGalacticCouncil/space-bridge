#pragma once

#include <memory>
#include <vector>
#include <iostream>
#include <fstream>

class IHwAccess;

class AnalogApiProvider
{
public:
    AnalogApiProvider(std::shared_ptr<IHwAccess> hwAccess);
    ~AnalogApiProvider();

    void tick();

private:
    std::vector<int> _readValues();
    void _publishValues(std::vector<int> values);

    std::shared_ptr<IHwAccess> _hwAccess;
    std::ofstream _file;
};


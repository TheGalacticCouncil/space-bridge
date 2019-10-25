#pragma once
#include "IHwAccess.h"

#include <vector>
#include <memory>

#define MAX_MCP_CHANNEL 2

class ADC;

class HwManager :
    public IHwAccess
{
public:
    HwManager();

    int readAnalogPin(unsigned mcpChannel, unsigned pin);

private:
    ADC& _getAdcForChannel(unsigned channel);

    std::vector<std::shared_ptr<ADC>> _adcs{ MAX_MCP_CHANNEL, nullptr };
    const unsigned _maxChannel{ MAX_MCP_CHANNEL };
};


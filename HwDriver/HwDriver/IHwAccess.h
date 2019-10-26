#pragma once

class IHwAccess
{
public:
    virtual int readAnalogPin(unsigned mcpChannel, unsigned pin) = 0;
};


#pragma once
#include "IInput.h"

class CapacitivePin :
    public IInput
{
public:
    CapacitivePin(int pinNumber);

    bool read();

private:
    int _pinNumber;
};


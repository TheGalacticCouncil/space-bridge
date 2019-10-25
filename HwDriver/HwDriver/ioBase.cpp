#include "ioBase.h"
#include <pigpio.h>

int ioBase::_instanceCount = 0;

ioBase::ioBase()
{
	if (!_instanceCount++)
        gpioCfgClock(2, 1, 0); // sample rate(5), device (1), ignored
		gpioInitialise(); // TODO: We should care about return code...
}

ioBase::~ioBase()
{
	if (!--_instanceCount)
		gpioTerminate();
}

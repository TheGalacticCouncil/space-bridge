#pragma once
#include <pigpio.h>

class ioBase
{
public:
	ioBase();
	~ioBase();

private:
	static int _instanceCount;
};


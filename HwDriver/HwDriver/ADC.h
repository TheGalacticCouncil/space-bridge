#pragma once
#include "ioBase.h"

class ADC :
	private ioBase
{
public:
	ADC(unsigned channel = 0, bool aux = false);
	~ADC();
	ADC(const ADC&) = delete;

	unsigned read(unsigned channel);
private:
	int _handle;
};


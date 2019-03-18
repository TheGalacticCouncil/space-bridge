#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# AnalogReader
"""
Module for reading potentiometer (analog) input.
name = AnalogInput(inputChannel)
  channel = [0-7]
name.read()
"""

# For ANALOG INPUT you need
# an MCP3008 AD converter chip

from RPi import GPIO            # Raspberry GPIO pins
from gpiozero import MCP3008    # A/D converter


class AnalogInput():
    """
    An object to read an analog MCP3008 hardware input.
    """

    def __init__(self, inputChannel, name='', threshold=0, decimals=2,
    minimum=0.0, maximum=1.0):
        # Input name
        self.name = name

        # Configure input channel
        self.analogInput = MCP3008(inputChannel)

        # Initiate input values
        self.value = 0
        self.oldValue = 0

        # Input configuration variables
        self.threshold = threshold
        self.decimals = decimals
        self.maximum = maximum
        self.minimum = minimum

    def readRaw(self):
        """
        Reads the value and stores the old value in buffer
        """
        self.value = self.analogInput.value    # new value is read and stored
        return self.value

    def read(self):
        """
        Reads the raw value and:
        - rounds it to [decimals].
          - If [decimals] = 0, ommits rounding.
        - Rescales the input from [minimum] to [maximum].
        """
        decimals = self.decimals
        minimum = self.minimum
        maximum = self.maximum

        value = AnalogInput.readRaw(self)          #self.analogInput.value

        # Scaling
        value = (value-minimum)/(maximum-minimum)

        #Clipping
        if value < 0.0:
            value = 0.0
        if value > 1.0:
            value = 1.0

        # Rounding
        if decimals > 0:
            value = round(value, decimals)

        # after processing is done, "value" is stored in "self.value"
        # This is done despite it being done in readRaw, because
        # this time the value is also filtered. The old value remains correct.
        self.value = value
        return self.value

    def readUpdate(self):
        """
        Returns the read value and whether it has changed from before.
        """
        changed = False

        AnalogInput.read(self)                    #value is read in to self.value

        delta = abs(self.value - self.oldValue)

        if delta > self.threshold:
            changed = True
            self.oldValue = self.value        #oldValue is updated only if changed = True
            return self.value, changed, self.name
        else:
            return self.value, changed, self.name


# Module can be run directly to test its function
if __name__ == "__main__":
    from time import sleep

    analogInput=[]
    analogInput.append(AnalogInput(0))

    try:
        while True:
            value = analogInput[0].read()
            print(value)
            sleep(0.2)
    except:
        print('n')
    finally:
        GPIO.cleanup()

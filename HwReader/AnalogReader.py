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

    def __init__(self, inputChannel, name='', threshold=0, 
                 clip_min=0.0, clip_max=1.0, minimum=0, maximum=1, 
                 trigger=0):
        # Input name
        self.name = name

        # Configure input channel
        self.analogInput = MCP3008(inputChannel)

        # Initiate input values
        self.value = 0
        self.oldValue = 0

        # Input configuration variables
        self.threshold = threshold
        self.clip_max = clip_max
        self.clip_min = clip_min
        self.maximum = maximum
        self.minimum = minimum
        self.trigger = trigger

        if trigger != 0:
            GPIO.setup(self.trigger, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    @profile
    def readRaw(self):
        """
        Reads the value and stores the old value in buffer
        """
        self.value = self.analogInput.value    # new value is read and stored
        return self.value

    @profile
    def read(self):
        """
        Reads the raw value and:
        - Rescales the input from [minimum] to [maximum].
        - (no longer rounds, because it is redundent when
          the value will be converted to int)
        """

        clip_min = self.clip_min
        clip_max = self.clip_max

        value = AnalogInput.readRaw(self)          #self.analogInput.value

        # Scaling
        value = (value-clip_min)/(clip_max-clip_min)

        #Clipping
        if value < 0.0:
            value = 0.0
        if value > 1.0:
            value = 1.0

        # after processing is done, "value" is stored in "self.value"
        # This is done despite it being done in readRaw, because
        # this time the value is also filtered. The old value remains correct.
        self.value = value
        return self.value

    @profile
    def rescale(self):
        '''Re-scales an input to match the event format requirement'''
        self.value
        self.maximum
        self.minimum
        value = self.value * (self.maximum-self.minimum) + self.minimum
        return int(value)

    @profile
    def readUpdate(self):
        """
        Returns the read value and whether it has changed from before, 
        if trigger is active or 0.
        """
        if self.trigger == 0:
            return self.update()
        else:
            GPIO.setmode(GPIO.BCM)
            triggered = GPIO.input(self.trigger) == GPIO.LOW
            if triggered:
                return self.update()
            else:
                return None, False, self.name

    @profile
    def update(self):
        """
        Returns the read value and whether it has changed from before.
        """
        changed = False

        AnalogInput.read(self)                    #value is read in to self.value

        delta = abs(self.value - self.oldValue)

        if delta > self.threshold:
            changed = True
            #oldValue is updated only if changed = True
            self.oldValue = self.value
            # Value is rescaled and changed in to an int
            value = AnalogInput.rescale(self)
            return value, changed, self.name
        else:
            return None, changed, self.name


# Module can be run directly to test its function
if __name__ == "__main__":
    from time import sleep

    analogInput=[]
    analogInput.append(AnalogInput(inputChannel=0, 
                                   threshold=0.01,
                                   clip_min=0.00245, 
                                   clip_max=0.998, 
                                   minimum=-100, 
                                   maximum=200))

    try:
        while True:
            value, new, b = analogInput[0].readUpdate()
            if new:
                print(value)
            sleep(0.2)
    except:
        print('n')
    finally:
        GPIO.cleanup()

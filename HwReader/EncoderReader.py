#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# EncoderReader
"""
Module for reading rotary encoder input.
name = EncoderInput(clock, dt)
name.read([counter])
"""

from mcp23017 import GPIO
from gpiozero import RotaryEncoder

class EncoderInput():
    """
    An object to read an encoder input.
    """

    def __init__(self, clk, dt, name='', minimum=0, maximum=0, step=1, wrap=False):

        self.name = name
        self.clockPin = clk
        self.dtPin = dt

        self.maximum = maximum
        self.minimum = minimum                       # If min and max are equal
        self.min_max_enabled = (maximum != minimum)  # disable limits
        self.max_range_per_side = 0
        self.step = step
        self.wrap = wrap

        self.value = 0
        self.substep = 0

        # Setup gpiozero Encoder Object
        if self.min_max_enabled:
            max_range = self.maximum - self.minimum
            self.max_range_per_side = int( (max_range+1) / 2 / step )

        GPIO.setmode(GPIO.BCM)
        self.encoder = RotaryEncoder(
            self.dtPin,
            self.clockPin,
            max_steps=self.max_range_per_side,
            wrap=self.wrap,
            bounce_time=None
            )

    def read(self, counter=0):
        '''
        Reads the encoder state and increments
        the counter accordingly.

        Use increment() to make use of more
        advanced features.
        '''

        counter = self.encoder.steps

        return counter


    def rescale(self, counter, value):
        '''Re-scales an input to requirement'''

        changed = True

        # NORMAL OPERATION
        # SENSITIVITY INCREASED
        #
        if self.step >= 0:
            counter = value * self.step

        # SENSITIVITY IS DECREASED
        # "substeps" are used
        #
        elif self.step < 0:
            new_counter = int(value/self.step)

            if counter == new_counter:
                changed = False
            else:
                counter = new_counter

        elif self.step == 1:
            counter = value

        return counter, changed

    def offset(self, counter):
        """
        Adjust offset to align with wanted output range min/max
        """
        if not self.min_max_enabled:
            return counter
        counter += self.maximum - self.max_range_per_side
        return counter

    def increment(self, counter=None):
        """
        - Reads the encoder,
        - increments the counter,
        - rescales and
        - returns the counter.

        - Returns whether the counter
          value has changed.
        - The counter can be overridden
          by giving a value as parameter.
        """

        # HIT TO PERFORMANCE. SUPPORT DISCONTINUED
        # If no counter override is defined, self.counter is used
        # if counter == None:
        #     counter = self.counter

        changed=False

        value = EncoderInput.read(self)

        # If input has changed
        if value != self.value:
            self.value = value
            counter, changed = EncoderInput.rescale(self, counter, value)
            counter = self.offset(counter)

            return counter, changed, self.name
        else:
            return counter, changed, self.name


# Module can be run directly to test its function
if __name__ == "__main__":

    from time import sleep

    counter = 0      # Define counter
    clk = 17         # Define clock pin
    dt = 24          # define dt pin

    delta = 0

    input1 = EncoderInput(clk, dt)

    try:
        while True:
            ###
            delta = input1.read()
            if delta != 0:
                counter += delta
                print(counter)
            delta = 0
            ###
            sleep(0.001)
    finally:
        GPIO.cleanup()

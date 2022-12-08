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
import encoder

class EncoderInput():
    """
    An object to read an encoder input.
    """

    def __init__(self, clk, dt, name='', minimum=None, maximum=None, step=1):

        self.name = name
        self.clockPin = clk
        self.dtPin = dt

        self.maximum = maximum
        self.minimum = minimum
        self.step = step

        #self.counter = 0
        self.substep = 0

        encoder.encoder_init(self.clockPin, self.dtPin)

        # GPIO.setmode(GPIO.BCM)
        # GPIO.setup(self.clockPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        # GPIO.setup(self.dtPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        self.previousClockState = encoder.encoder_position()


    # def read(self, counter=0):
    #     '''
    #     Reads the encoder state and increments
    #     the counter accordingly.

    #     Use increment() to make use of more
    #     advanced features.
    #     '''
    #     counter = encoder.encoder_position()

    #     return counter


    def rescale(self, counter):
        '''Re-scales an input to requirement'''

        changed = True

        # NORMAL OPERATION
        # SENSITIVITY INCREASED
        #
        if self.step >= 0:
            counter = counter * self.step
            # self.previousClockState = counter     # Un-necessary

        # SENSITIVITY IS DECREASED
        # "substeps" are used
        #
        elif self.step < 0:
            counter = int(counter / -self.step)
            if self.previousClockState == counter:
                changed = False
            else:
                self.previousClockState = counter

        try:                            # if minimum != None and maximum != None:
            if counter > self.maximum:
                counter = self.maximum
            elif counter < self.minimum:
                counter = self.minimum
        except TypeError:
            pass

        return counter, changed


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

        counter = encoder.encoder_position()

        # If input has changed
        if counter == self.previousClockState:
            counter, changed = EncoderInput.rescale(self, counter)

            #self.counter = counter
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

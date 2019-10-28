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

class EncoderInput():
    """
    An object to read an encoder input.
    """

    def __init__(self, clk, dt, name='', minimum=None, maximum=None, step=1, interrupt=True):

        self.name = name
        self.clockPin = clk
        self.dtPin = dt

        self.maximum = maximum
        self.minimum = minimum
        self.step = step

        self.counter = 0
        self.substep = 0
        self.changed = False

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.clockPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.dtPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        self.previousClockState = GPIO.input(self.clockPin)

        # USE IN INTERRUPT MODE:
        #
        if interrupt==True:

            # DEFINE INTERRUPT CALLBACKS
            #
            # ENCODER is read
            #
            GPIO.add_event_detect(clk, GPIO.BOTH, callback=self.increment)


    def read_tick(self, counter=0):
        '''
        Reads the encoder state and increments
        the counter accordingly.

        Use increment() to make use of more
        advanced features.
        '''

        clockState = GPIO.input(self.clockPin)
        dtState = GPIO.input(self.dtPin)

        if clockState != self.previousClockState:
            if dtState != clockState and dtState == 1:
                counter += 1                                # if dt state is 1, it is added
            elif dtState == clockState and dtState == 1:
                counter -= 1                                # if dt state is 1, it is subtracted
            # else:                                         # Default action for else is "nothing" anyway.
            #     pass                                      # No need to write it

        self.previousClockState = clockState

        return counter


    def rescale(self, counter, delta):
        '''Re-scales an input to requirement'''

        changed = True

        # NORMAL OPERATION
        # SENSITIVITY INCREASED
        #
        if self.step >= 0:
            counter += delta * self.step

        # SENSITIVITY IS DECREASED
        # "substeps" are used
        #
        elif self.step < 0:
            # INCREMENT SUBSTEP
            self.substep += delta

            # IF FULL (+) STEP IS REACHED,
            # substeps is reset and
            # delta is passed on
            if self.substep == -(self.step):
                self.substep = 0

            # IF FULL (-) STEP IS REACHED,
            # substeps is reset and
            # delta is passed on
            elif self.substep == self.step:
                self.substep = 0

            else:
                # if substeps are less, delta is reset
                # and substeps keep building up
                delta = 0
                changed = False

            counter += delta

        try:                            # if minimum != None and maximum != None:
            if counter > self.maximum:
                counter = self.maximum
            elif counter < self.minimum:
                counter = self.minimum
        except TypeError:
            pass

        return counter, changed


    def increment(self):
        """
        - Reads the encoder,
        - increments the counter,
        - rescales and
        - returns the counter.

        - Returns whether the counter
          value has changed.
        - The counter can NO LONGER be overridden
          by giving a value as parameter.
        """

        # HIT TO PERFORMANCE. SUPPORT DISCONTINUED
        # If no counter override is defined, self.counter is used
        # if counter == None:
        #     counter = self.counter

        delta = EncoderInput.read_tick(self)

        # If input has changed
        if abs(delta) > 0:
            self.counter, self.changed = EncoderInput.rescale(self, self.counter, delta)

            # return counter, changed, self.name
        else:
            pass
            # return self.counter, changed, self.name


    def probe(self):
        """
        Probes state of the encoder
        Returnes the stored values from the <encoder instance>
        """
        return self.counter, self.changed, self.name


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
            delta = input1.read_tick()
            if delta != 0:
                counter += delta
                print(counter)
            delta = 0
            ###
            sleep(0.001)
    finally:
        GPIO.cleanup()

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

        self.dtState = 0
        self.clockState = 0

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
            GPIO.add_event_detect(clk, GPIO.RISING, callback=self.clock_up, bounce=1)
            GPIO.add_event_detect(dt, GPIO.RISING, callback=self.dt_active, bounce=1)


    def dt_active(self, foo):
        self.dtState = GPIO.input(self.dtPin)
        self.increment()


    def clock_up(self, foo=None):
        self.clockState = 1


    def read_tick(self):
        '''
        Reads the encoder state and increments
        the counter accordingly.

        Use increment() to make use of more
        advanced features.
        '''

        delta = 0

        # if self.dtState == 1:
        if self.dtState != self.clockState:
            delta = 1                                # if dt state is 1, it is added
        elif self.dtState == self.clockState:
            delta = -1                                # if dt state is 1, it is subtracted
        # else:                                       # Default action for else is "nothing" anyway.
        #     pass                                    # No need to write it

        self.clockState = 0

        return delta


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


    def increment(self, foo=None):
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

        self.clockState = GPIO.input(self.clockPin)

        delta = self.read_tick()

        # If input has changed
        if abs(delta) > 0:
            self.counter, self.changed = self.rescale(self.counter, delta)
        # else:
        #     pass


    def probe(self):
        """
        Probes state of the encoder
        Returnes the stored values from the <encoder instance>
        """
        changed = self.changed      # Reads the changed state
        self.changed = False        # Resets the changed state
        return self.counter, changed, self.name


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

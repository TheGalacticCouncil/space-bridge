#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# Cython 02.11.2023
# EncoderReader
"""
Module for reading rotary encoder input.
name = EncoderInput(clock, dt)
name.read([counter])
"""

from mcp23017 import GPIO

cdef class EncoderInput():
    """
    An object to read an encoder input.
    """

    # Declaring class variables
    cdef str name
    cdef int clockPin
    cdef int dtPin

    cdef int maximum
    cdef int minimum
    cdef int step

    cdef int substep

    cdef int previousClockState

    def __cinit__(self, int clk, int dt, str name='', int minimum=0, int maximum=0, int step=1): # enable switch for min max

        self.name = name
        self.clockPin = clk
        self.dtPin = dt

        self.maximum = maximum
        self.minimum = minimum
        self.step = step

        #self.counter = 0
        self.substep = 0

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.clockPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.dtPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        self.previousClockState = GPIO.input(self.clockPin)


    cdef read(self, int counter=0):
        '''
        Reads the encoder state and increments
        the counter accordingly.

        Use increment() to make use of more
        advanced features.
        '''

        cdef int clockState = GPIO.input(self.clockPin)
        cdef int dtState = GPIO.input(self.dtPin)

        if clockState != self.previousClockState:
            if dtState != clockState and dtState == 1:
                counter += 1                                # if dt state is 1, it is added
            elif dtState == clockState and dtState == 1:
                counter -= 1                                # if dt state is 1, it is subtracted
            # else:                                         # Default action for else is "nothing" anyway.
            #     pass                                      # No need to write it

        self.previousClockState = clockState

        return counter


    cdef rescale(self, int counter, int delta):
        '''Re-scales an input to requirement'''

        cdef bint changed = True

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

        delta = EncoderInput.read(self)

        # If input has changed
        if abs(delta) > 0:
            counter, changed = EncoderInput.rescale(self, counter, delta)

            #self.counter = counter
            return counter, changed, self.name
        else:
            return counter, changed, self.name


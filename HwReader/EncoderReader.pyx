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
    cdef bint min_max_enabled
    cdef int step

    cdef int substep

    cdef int self.previousClockState
    cdef int self.previousDtState


    def __cinit__(self, int clk, int dt, str name='', int minimum=0, int maximum=0, int step=1): # enable switch for min max

        self.name = name
        self.clockPin = clk
        self.dtPin = dt

        self.maximum = maximum
        self.minimum = minimum                       # If min and max are equal
        self.min_max_enabled = (minimum != maximum)  # disable limits
        self.step = step

        #self.counter = 0
        self.substep = 0

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.clockPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.dtPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        # self.previousClockState = GPIO.input(self.clockPin)



    cdef filter(self, str pin, int n=5):
        '''
        Samples pins 'n' times, and filters outliers
        '''

        cdef list clockState = [0] * n
        cdef list dtState = [0] * n

        # Poll each input n times
        for i in range(n):
            clockState[i] = GPIO.input(self.clockPin)
            dtState[i] = GPIO.input(self.dtPin)

        # Count whether there are more 1s or 0s.
        cdef int filteredClk = int( len([ x for x in clockState if x == 1 ]) > len(clockState)/2 )
        cdef int filteredDt  = int( len([ x for x in dtState if x == 1 ]) > len(dtState)/2 )

        if pin == "clk":
            return filteredClk

        if pin == "dt":
            return filteredDt


    cdef read(self, int counter=0):
        '''
        Reads the encoder state and increments
        the counter accordingly.

        Use increment() to make use of more
        advanced features.
        '''

        cdef int previousClockState
        cdef int previousDtState

        # cdef int clockState = GPIO.input(self.clockPin)
        # cdef int dtState = GPIO.input(self.dtPin)

        cdef int SAMPLE_COUNT = 3

        # cdef int clockState = EncoderInput.filter(self, "clk", SAMPLE_COUNT)
        # cdef int dtState    = EncoderInput.filter(self, "dt", SAMPLE_COUNT)

        cdef int clockState = GPIO.input(self.clockPin)
        cdef int dtState    = GPIO.input(self.dtPin)


        #if clockState != self.previousClockState or dtState != previousDtState:
        #    if dtState != clockState and dtState == 0:
        #        counter += 1                                # if dt state is 1, it is added
        #    elif dtState == clockState and dtState == 0:
        #        counter -= 1                                # if dt state is 1, it is subtracted
            # else:                                         # Default action for else is "nothing" anyway.
            #     pass                                      # No need to write it

        if clockState != self.previousClockState or dtState != previousDtState:
            if dtState != clockState and dtState == 0:
                counter += 1                                # if dt state is 1, it is added
            elif dtState != clockState and dtState == 1:
                counter -= 1                                # if dt state is 1, it is subtracted

        self.previousClockState = clockState
        self.previousDtState = dtState

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

        if self.min_max_enabled:
            if counter > self.maximum:
                counter = self.maximum
            elif counter < self.minimum:
                counter = self.minimum

        return counter, changed


    def increment(self, int counter=0):
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

        cdef bint changed=False

        cdef bint delta = EncoderInput.read(self)

        # If input has changed
        if abs(delta) > 0:
            counter, changed = EncoderInput.rescale(self, counter, delta)

            #self.counter = counter
            return counter, changed, self.name
        else:
            return counter, changed, self.name


#######################


    def tester(self, dt, clk):
        prevClk = 0
        prevDt = 0
        c = "E"
        d = "E"
        while True:
            clkS = GPIO.input(clk)
            dtS    = GPIO.input(dt)
            if clkS != prevClk or dtS != prevDt:
                if clkS == 0:
                    c = "-"
                else:
                    c = "X"
                if dtS == 0:
                    d = "-"
                else:
                    d = "X"

                print(f"clk: {c} - dt: {d}")
                prevClk = clkS
                prevDt = dtS


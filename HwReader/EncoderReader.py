#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# EncoderReader
"""
Module for reading rotary encoder input.
name = EncoderInput(clock, dt)
name.read([counter])
"""

from RPi import GPIO

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

        self.counter = 0

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.clockPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(self.dtPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

        self.previousClockState = GPIO.input(self.clockPin)


    def read(self, counter=0):
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
                counter += 1
            elif dtState == clockState and dtState == 1:
                counter -= 1
            else:
                pass

        self.previousClockState = clockState

        return counter


    def rescale(self, counter, delta):
        '''Re-scales an input to requirement'''
        counter += delta*self.step
        if self.minimum != None and self.maximum != None:
            if counter > self.maximum:
                counter = self.maximum
            if counter < self.minimum:
                counter = self.minimum
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

        # If no counter override is defined, self.counter is used
        if counter == None:
            counter = self.counter

        changed=False

        delta = EncoderInput.read(self)

        # If input has changed
        if abs(delta) > 0:
            changed = True
            counter = EncoderInput.rescale(self, counter, delta)

            self.counter = counter
            return counter, changed, self.name
        else:
            return self.counter, changed, self.name

        
    def interrupt_callback(self, counter == None):
        """
        Interrupt callback function to be called when
        """
        if counter == None:
            counter = self.counter
            
        delta = EncoderInput.read(self)
        counter = EncoderInput.rescale(self, counter, delta)
        self.counter = counter
        
        # QUEUEING:
        # There is thinking to be done, about the zero debth queue. Is it still the way to go.
        try:
            self.inputQueue.get_nowait()
        except Empty:
            pass
        self.inputQueue.put((self.name, counter))   # We should use tuples, not lists for queue entries
        
        
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

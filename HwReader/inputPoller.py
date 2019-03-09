#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# inputPoller (HwReader)

from RPi import GPIO
from time import sleep
import threading
#from queue import Queue
from queue import Full, Empty


class InputPoller(threading.Thread):
    '''
    A thread to poll both analog and digital inputs.

    takes lists of input instances as input.
    The thread outputs values when they chance,
    in to the inputQueue.
    '''

    def __init__(self, analogInput, encoderInput, buttonInput, sleep, inputQueue):
        threading.Thread.__init__(self)
        self.analogInput = analogInput
        self.encoderInput = encoderInput
        self.buttonInput = buttonInput
        self.cycleTime = sleep
        self.inputQueue = inputQueue        # This is a new thing

    def run(self):
        # Analog Init
        value=[]
        for i in range(len(self.analogInput)):
            value.append(0)

        # Encoder Init
        counter=[]
        for i in range(len(self.encoderInput)):
            counter.append(0)

        # Button Init
        for i in range(len(self.buttonInput)):
            pass

        try:

            # Main Loop
            while True:

                # Potentiometer is read
                #
                # The operation is non-blocking.
                # If the queue is full, the new value is discarded.
                #
                # This is done, because analog inputs generate a
                # massive flow of new inputs for even a small change.
                # Discarding a few intermediary values will not hurt
                # accuarcy, but improves responciveness a great deal.
                #
                for i in range(len(self.analogInput)):
                    value[i], changed, name = self.analogInput[i].readUpdate()
                    if changed == True:
                        try:
                            self.inputQueue.put_nowait([name, value])
                        except Full:
                            pass

                # Encoder is read
                #
                # If a new value is received, purges the
                # queue and adds a new entry to it.
                # The operation is non-blocking.
                #
                for i in range(len(self.encoderInput)):
                    counter[i], changed, name = self.encoderInput[i].increment(counter[i])
                    if changed == True:
                        try:
                            self.inputQueue.get_nowait()
                        except Empty:
                            pass
                        self.inputQueue.put([name, counter[i]])

                for i in range(len(self.buttonInput)):
                    # Button is read
                    pass

                sleep(self.cycleTime)

        except KeyboardInterrupt:
            pass
        finally:
            GPIO.cleanup()

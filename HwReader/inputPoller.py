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

    def __init__(self, analogInput, encoderInput, buttonInput, switchInput, sleep, inputQueue):
        threading.Thread.__init__(self)

        self.analogInput = analogInput
        self.encoderInput = encoderInput
        self.buttonInput = buttonInput
        self.switchInput = switchInput

        self.cycleTime = sleep
        self.inputQueue = inputQueue

    def run(self):
        # Analog Init
        a_value=[]
        for i in range(len(self.analogInput)):
            a_value.append(0)

        # Encoder Init
        counter=[]
        for i in range(len(self.encoderInput)):
            counter.append(0)

        try:

            # Main Loop
            while True:

                # POTENTIOMETER is read
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
                    a_value[i], changed, name = self.analogInput[i].readUpdate()
                    if changed == True:
                        try:
                            self.inputQueue.put_nowait([name, a_value])
                        except Full:
                            pass

                # ENCODER is read
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

                # BUTTON is read
                #
                # A value is sent only if value is True.
                # Only a single True is sent for a press
                # Thus, the press must be registered properly!
                # Button press is blocking and waits to deposit
                # its value. (Sort of, but not exactly like an interrupt)
                for i in range(len(self.buttonInput)):
                    b_value, name = self.buttonInput[i].read()
                    if b_value == True:
                        self.inputQueue.put([name, b_value])

                # SWITCH is read
                #
                # A value is sent only if value is changed.
                # Only a single sginal is sent per press.
                # Thus, the press must be registered properly!
                # Button press is blocking and waits to deposit
                # its value. (Sort of, but not exactly like an interrupt)
                for i in range(len(self.switchInput)):
                    s_value, name = self.switchInput[i].read()
                    if s_value == True or s_value == False:
                        self.inputQueue.put([name, s_value])
                    else:
                        pass    # Switch returns only a True on enable
                                # False on disable and None when not changed

                sleep(self.cycleTime)

        except KeyboardInterrupt:
            pass
        finally:
            GPIO.cleanup()

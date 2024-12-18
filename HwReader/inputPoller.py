#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# inputPoller (HwReader)

from mcp23017 import GPIO
from time import sleep, time
import threading
from queue import Full, Empty
from logger import Logger

# Exceptions
from fileapi import VirtualMCPApiError
from gpiozero import exc

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

        logger = Logger(__name__)
        logger.info("InputPoller thread started")

        # PERFORMANCE IMPROVEMENTS
        # Precalculates ranges for polling "for" statements
        #
        analog_range = range(len(self.analogInput))
        encoder_range = range(len(self.encoderInput))
        button_range = range(len(self.buttonInput))
        switch_range = range(len(self.switchInput))
        #
        #
        # Converts class objects to local objects
        # to reduce refrencing and improve performance
        #
        cycleTime = self.cycleTime
        analogInput = self.analogInput
        encoderInput = self.encoderInput
        buttonInput = self.buttonInput
        switchInput = self.switchInput
        inputQueue = self.inputQueue

        # Encoder Init
        counter = [0 for i in encoder_range]

        q = 0   #Counter for a performance metric

        try:

            # Main Loop
            while True:

                start_time = time()

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
                for i in analog_range:
                    a_value, changed, name = analogInput[i].readUpdate()
                    if changed == True:
                        try:
                            inputQueue.put_nowait([name, a_value])
                        except Full:
                            pass

                # ENCODER is read
                #
                # When a new value is received,
                # Poller tries to put the input in queue (non-blocking).
                # If the queue is full, the oldes input will be removed
                # Finally the input is placed in the queue.
                # To ensure the delivery of the second attempt the
                # operaion is blocking.
                #
                for i in encoder_range:
                    counter[i], changed, name = encoderInput[i].increment(counter[i])
                    if changed == True:
                        try:
                            inputQueue.put_nowait([name, counter[i]])
                        except Full:
                            try:
                                inputQueue.get_nowait()
                            except Empty:
                                pass
                            inputQueue.put([name, counter[i]])

                # BUTTON is read
                #
                # A value is sent only if value is True.
                # Only a single True is sent for a press
                # Thus, the press must be registered properly!
                # Button press is blocking and waits to deposit
                # its value. (Sort of, but not exactly like an interrupt)
                for i in button_range:
                    b_value, name = buttonInput[i].read()
                    if b_value == True:
                        inputQueue.put([name, b_value])

                # SWITCH is read
                #
                # A value is sent only if value is changed.
                # Only a single signal is sent per press.
                # Thus, the press must be registered properly!
                # Button press is blocking and waits to deposit
                # its value. (Sort of, but not exactly like an interrupt)
                for i in switch_range:
                    s_value, changed, name = switchInput[i].read()
                    if changed:
                        inputQueue.put([name, s_value])
                    else:
                        pass    # Switch returns only a True on enable
                                # False on disable and None when not changed

                # PERFORMANCE METRICS
                #
                end_time = time()
                cycle_length = (end_time - start_time)
                if q >= 1000:
                    q = 0
                    logger.debug("InputPoller cycle time: %i ns" % int(cycle_length * 1000 * 1000))
                q += 1

                if cycle_length < cycleTime:
                    sleep(cycleTime - cycle_length)
                else:
                    #logger.debug("Cycle time exceeded: cycle %i ns" % int(cycle_length * 1000 * 1000))
                    #print((cycle_length * 1000 * 1000))
                    ###########################################################################
                    # Should we reserve some minimum sleep to give other threads time to run? #
                    ###########################################################################
                    pass

        except KeyboardInterrupt:
            pass
        except VirtualMCPApiError as e:
            logger.critical(e.__str__())
        finally:
            GPIO.cleanup()

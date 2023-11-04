#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 17.01.2019
# Cythonized 03.11.2023
# inputPoller (HwReader)

from mcp23017 import GPIO
from time import sleep, time
from threading import Thread
from queue import Full, Empty
from logger import Logger

cdef extern from "Python.h":
    void PyEval_InitThreads()


cdef class InputPoller():
    '''
    A thread to poll both analog and digital inputs.

    takes lists of input instances as input.
    The thread outputs values when they chance,
    in to the inputQueue.
    '''

    cdef list analogInput
    cdef list encoderInput
    cdef list buttonInput
    cdef list switchInput

    cdef float cycleTime

    cdef object inputQueue
    cdef object myThread
    cdef bint running


    def __init__(self, list analogInput, list encoderInput, list buttonInput,
                  list switchInput, float sleep, inputQueue):

        self.running = True
        PyEval_InitThreads()
        self.myThread = Thread(target=self.run, daemon=True)
        self.myThread.daemon = True

        self.analogInput = analogInput
        self.encoderInput = encoderInput
        self.buttonInput = buttonInput
        self.switchInput = switchInput

        self.cycleTime = sleep
        self.inputQueue = inputQueue


    def start(self):
        self.myThread.start()

    def is_alive(self) -> bool:
        # Check if the thread is alive
        return self.myThread.is_alive()

    def join(self, int i):
        # Terminate the thread by sending a
        # stop signal, breaking the main loop
        self.running = False

    cdef run(self):

        logger = Logger(__name__)
        logger.info("InputPoller thread started")

        # PERFORMANCE IMPROVEMENTS
        # Precalculates ranges for polling "for" statements
        #
        cdef object analog_range = range(len(self.analogInput))
        cdef object encoder_range = range(len(self.encoderInput))
        cdef object button_range = range(len(self.buttonInput))
        cdef object switch_range = range(len(self.switchInput))
        #
        #
        # Converts class objects to local objects
        # to reduce refrencing and improve performance
        #
        cdef float cycleTime = self.cycleTime
        cdef list analogInput = self.analogInput
        cdef list encoderInput = self.encoderInput
        cdef list buttonInput = self.buttonInput
        cdef list switchInput = self.switchInput
        inputQueue = self.inputQueue

        # Encoder Init
        cdef list counter = [0 for i in encoder_range]

        # Init Perf metric variables
        cdef int q = 0   #Counter for a performance metric
        cdef float start_time
        cdef float end_time
        cdef float cycle_length

        # Init temp variables
        cdef bint changed
        cdef float a_value
        cdef bint b_value
        cdef bint s_value

        cdef str name

        try:

            # Main Loop
            while self.running:

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
        finally:
            GPIO.cleanup()

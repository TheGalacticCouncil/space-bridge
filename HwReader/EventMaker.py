#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 27.02.2019
# EventMaker

from time import sleep
import threading
#from queue import Queue


class EventMaker(threading.Thread):
    '''A thread to process the inputs to events.'''


    def __init__(self, sleep, inputQueue):
        threading.Thread.__init__(self)
        self.cycleTime = sleep
        self.inputQueue = inputQueue        # This is a new thing

    def run(self):

        try:
            # Main Loop
            while True:
                item = self.inputQueue.get()
                print(" >>>", item[0], item[1])

                sleep(self.cycleTime)

        except KeyboardInterrupt:
            pass
        finally:
            pass

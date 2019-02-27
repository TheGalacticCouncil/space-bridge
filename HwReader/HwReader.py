#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.01.2019
# HwReader

from time import sleep
#import threading
import inputPoller
import inputConfig
import EventMaker
import KeyListener
from queue import Queue, Empty

# loads configuration from file
cycleTime, aConfig, eConfig, bConfig = inputConfig.loadConfig()
eventSleep = 0.5

# creates appropriate input instances from config file
aInput, eInput, bInput = inputConfig.collectInputs(aConfig, eConfig, bConfig)

# Creates queues with debth: 1 (item)
inputQueue = Queue(1)
keyQueue = Queue(1)

# Creates threads
inputThread = inputPoller.inputPoller(aInput, eInput, bInput, cycleTime, inputQueue)
eventThread = EventMaker.EventMaker(eventSleep, inputQueue)
listener = KeyListener.KeyListener(keyQueue)

# and marks them daemon
inputThread.daemon = True
eventThread.daemon = True
listener.daemon = True

print("Press Enter to quit")

# Spawn the input and event threads
inputThread.start()
eventThread.start()
listener.start()

dont_stop = True

try:
    while True:
        if inputThread.is_alive() and eventThread.is_alive() and dont_stop:
            try:
                dont_stop = keyQueue.get_nowait()
            except Empty:
                pass
            #print("Threads:", threading.active_count())
            sleep(0.5)
        else:
            #print("A thread crashed")
            break

except KeyboardInterrupt:
    inputThread.join(0.01)
    eventThread.join(0.01)
    listener.join(0.01)
    exit()

inputThread.join(0.01)
eventThread.join(0.01)
listener.join(0.01)

print("It's done")

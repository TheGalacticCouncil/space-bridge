#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.01.2019
# HwReader

'''
Main program in HwReader system.
Enables reading hardware inputs
configured in config.txt

Reprocesses the data in to events
and sends the events as UDP broadcast
packets.
'''

from time import sleep, time

start_time = time()

from inputPoller import InputPoller
from inputConfig import InputConfig
from EventMaker import EventMaker
from KeyListener import KeyListener
from eventConfig import EventConfig
from queue import Queue, Empty
from logger import Logger

end_time = time()
import_time = int(end_time - start_time)

logger = Logger(__name__)
logger.info("Module imports compleate in %i seconds" % import_time)

start_time = time()

# Loads the event configuration class
# It reads events.json and stores it as dict.
# The dict can be accessed with functions.
eventConfig = EventConfig()

# Loads the input configuration class.
# It stores input configuration and other
# settings and can be accessed with fuctions.
inputConfig = InputConfig()

# Loads input configuration from file
cycleTime = InputConfig.loadConfig(inputConfig, eventConfig)
eventSleep = 0.5
station = inputConfig.station

# creates appropriate input instances from config file
aInput, eInput, bInput, sInput = InputConfig.collectInputs(inputConfig)

# Creates input and key-press queues with debth: 1 (item) each.
# event Queue is infinite for now
inputQueue = Queue(1)
keyQueue = Queue(1)
eventQueue = Queue(0)

# Creates threads
inputThread = InputPoller(aInput, eInput, bInput, sInput, cycleTime, inputQueue)
eventThread = EventMaker(eventSleep, inputQueue, eventQueue,
                         eventConfig, inputConfig, station=station)
listener = KeyListener(keyQueue)

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

end_time = time()
boot_length = end_time - start_time
logger.info("Start-up complete in %i seconds" % boot_length)
#print("Start time", boot_length, "seconds")

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

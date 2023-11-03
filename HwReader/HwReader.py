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

filename = 'hwreader.log'
open(filename, 'w').close()     # Creates an empty log file
                                # Comment out to use append mode
from logger import Logger

end_time = time()
import_time = int((end_time - start_time)*1000)

logger = Logger(__name__)

license="""
   HwReader Copyright 2019 JValtteri

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
"""
print("\n\n\n\n"+license+"\n")

logger.debug("Module imports compleate in %i ms" % import_time)

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

# Creates input queue with debth: 2 (items).
#  This is to allow up to two events to be placed in the queue
#  from the same source.
# Creates key-press queue with debth: 1 (item).
# event Queue is un-used for now
inputQueue = Queue(2)
keyQueue = Queue(1)
eventQueue =  None # Queue(0)

# Creates threads
inputThread = InputPoller(aInput, eInput, bInput, sInput, cycleTime, inputQueue)
eventThread = EventMaker(eventSleep, inputQueue, eventQueue,
                         eventConfig, inputConfig, station=station)
listener = KeyListener(keyQueue)

# and marks them daemon
# inputThread.daemon = True  # InputPoller is defined internally
eventThread.daemon = True
listener.daemon = True

print("Press Enter to quit")

# Spawn the input and event threads
inputThread.start()
eventThread.start()
listener.start()

dont_stop = True

end_time = time()
boot_length = int((end_time - start_time)*1000)
logger.debug("Start-up complete in %i ms" % boot_length)
logger.info("Start-up complete")
logger.info("Press ENTER to quit")

# If one or more of the treads are not up, waits a while for them to wake up.
if inputThread.is_alive() and eventThread.is_alive():
    pass
else:
    logger.warning("Thread is not ready, waiting for it to boot.")
    sleep(0.5)


try:
    while dont_stop:
        if inputThread.is_alive() and eventThread.is_alive():
            try:
                dont_stop = keyQueue.get_nowait()
            except Empty:
                pass
            sleep(0.5)
        else:
            logger.critical("A thread has crashed. Terminating")
            break

except KeyboardInterrupt:
    logger.warning("KeyboardInterrupt: Exiting")
    inputThread.join(0.01)
    eventThread.join(0.01)
    listener.join(0.01)
    exit()

inputThread.join(0.01)
eventThread.join(0.01)
listener.join(0.01)

logger.info("Exited")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 27.02.2019
# EventMaker

from time import sleep
import threading
#import eventConfig
from inputConfig import InputConfig
from udpSender import UdpSender
#from datetime import datetime
import time
import json
import myIP
#from queue import Queue
from logger import Logger


class EventMaker(threading.Thread):
    '''A thread to process the inputs to events.'''


    def __init__(self, sleep, inputQueue, eventQueue,
                 eventConfig, inputConfig, station="Undefined Station"):

        threading.Thread.__init__(self)
        self.cycleTime = sleep
        self.inputQueue = inputQueue
        self.eventQueue = eventQueue
        self.eventConfig = eventConfig
        self.inputConfig = inputConfig
        self.station = station
        self.ip = myIP.myIP()

    @profile
    def event(self, input_name, value, settings):
        '''
        Formats the event input in to an event.
        - Takes the input name and value as inputs
        - Translates the input name to an event name
        ...
        '''

        # Collects event data
        #
        # A reminder:
        # This implementation of POSIX returns a float.
        # The default rounding used rounds "half down".
        # Therefore the timestamp may be at most 0.1 ms
        # too small.

        posix = time.time() * 1000

        event_name = InputConfig.eventName(self.inputConfig, input_name)

        # Makes the payload
        #
        # Dev. Status note:
        # Currently supports only a single payload field

        fields = self.eventConfig.event(event_name)

        payload = EventMaker.payloader(input_name, value, fields[0], settings)

        if payload == {}:
            # If a secondary event is defined, the input is a binary
            # input. Only values 1 and 0 are significant.
            if "event2" in settings[input_name] and value == 0:
                secondary_event = settings[input_name]["event2"]
                event_name = secondary_event
            ##else: Use the primary event_name, that was defined earlier.

        # Formats the event
        #
        event = {"timestamp": int(posix),                 # "timestamp": "ms-from-epoch, number",
                "sourceComponent": "HwReader",            # "sourceComponent": "HwReader",
                "sourceIp": self.ip,                      # "sourceIp": "We might need this",
                "event": event_name,                      # "event": "SET_THROTTLE",
                "station": self.station,                  # "station": "HELM",
                "payload": payload                       # "payload": {"value": 100}
        }
        return event

    @profile
    def payloader(input_name, value, fields, settings):
        '''
        Packs the payload for the event
        Searches the dict of events for payload configurations
        and interprits how to combine it with the [value].
        '''

        try:
            if "name" in fields:
                value_name = fields["name"]
                input_setting = settings[input_name]

                # Check if a [set_value] has been defined [value_name]
                # It is used if defined.
                if 'value' in input_setting:
                    if value_name in input_setting["value"]:
                        set_value = input_setting['value'][value_name]
                        payload = {value_name: set_value}

                # If "possibleValues" are defined and no predefined
                # value is set, cycles through the list.
                # Uses [value] as index for [possible] values
                elif "possibleValues" in fields:
                    possible = fields["possibleValues"]
                    payload = {value_name: possible[value]}

                # If nothing else, then the plain value is used
                else:
                    payload = {value_name: value}

        ##else: The event is a plain event, no "value" or "payload" is delivered
        except IndexError:
            pass

        return payload

    @profile
    def run(self):

        logger = Logger(__name__)
        logger.info("EventMaker thread started")

        # Configures the UDP-Sender and creates an instance
        udpIP = self.inputConfig.udp_ip         #.255
        udpPort = self.inputConfig.udp_port     #22100

        udpSender = UdpSender(udpIP, udpPort)

        settings = InputConfig.settings(self.inputConfig)

        try:
            # Main Loop
            while True:

                start_time = time.time()

                # Gets a new input message from queue
                item = self.inputQueue.get()
                ##print(" >>>", item[0], item[1])

                # A new event is created
                event = EventMaker.event(self, item[0], item[1], settings)

                # Prints a pretty json formatted event
                #print(json.dumps(event, sort_keys=False, indent=4))
                ##self.eventQueue.put(event)                        # If we decide to go with a threading solution

                logger.info("Event created %s - %s" % (event["event"], str(event["payload"]).strip("{''}")))

                end_time = time.time()
                cycle_length = int((end_time - start_time) * 1000)
                # logger.info("EventMaker cycle time: You were served in: %i ms" % cycle_length)
                logger.debug("EventMaker cycle time: %i ms" % cycle_length)


                start_time = time.time()
                udpSender.run(json.dumps(event))    # SEND HERE #
                end_time = time.time()
                cycle_length = int((end_time - start_time) * 1000)
                logger.debug("udpSender delivery time: %i ms" % cycle_length)

                # Sends the message (single threaded)
                # udpSender.run(json.dumps(event))

                # Sleeping is relevant only in TESTING.
                # In use, the Tread runs as fast as it can
                # and waits for the input queue...
                # this should validated on a single core Pi-0-W
                #sleep(self.cycleTime)

        except KeyboardInterrupt:
            pass
        finally:
            pass

if __name__ == '__main__':
    from queue import Queue
    import eventConfig
    from random import random

    inQ = Queue(1)
    eQ = Queue(0)
    eventTypes = eventConfig.EventConfig()
    inputConfig = InputConfig()
    eventmaker = EventMaker(0.5, inQ, eQ, eventTypes, inputConfig, 'self test station')
    settings = InputConfig.settings(eventmaker.inputConfig)
    #print(event.event("ButtonTest", 1))
    #event = EventMaker.event(event, "LOAD_TUBE", 1)
    #event = EventMaker(0.5, inQ, eQ, eventTypes, inputConfig, 'self test station')
    udpIP = "192.168.10.255"
    udpPort = 22100
    udpSender = UdpSender(udpIP, udpPort)

    # Pushes 1000 random events throughEventMaker to generate good data.
    #
    for i in range(1000):
        value = int(random() * 100)
        udpSender.run(json.dumps(eventmaker.event("TestInput1", value, settings)))

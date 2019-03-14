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

    def event(self, input_name, value):
        '''
        Formats the event input in to an event.
        - Takes the input name and value as inputs
        - Translates the input name to an event name
        ...
        '''

        settings = InputConfig.settings(self.inputConfig)

        # Collects event data
        #
        # A reminder:
        # This implementation of POSIX returns a float.
        # The default rounding used rounds "half down".
        # Therefore the timestamp may be at most 0.1 ms
        # too small.

        posix = time.time() * 1000
        event = {}
        payload = {}
        event_name = InputConfig.eventName(self.inputConfig , input_name)

        # Makes the payload
        #
        # Dev. Status note:
        # Currently supports only a single payload field

        fields = self.eventConfig.event(event_name)

        payload = EventMaker.payloader(input_name, value, fields, settings)

        if payload == {}:
            # If a secondary event is defined, the input is a binary
            # input. Only values 1 and 0 are significant.
            if "event2" in settings[input_name] and value == 0:
                secondary_event = settings[input_name]["event2"]
                event_name = secondary_event
            ##else: Use the primary event_name, that was defined earlier.

        # Formats the event
        #
        event["timestamp"] = int(posix)                 # "timestamp": "ms-from-epoch, number",
        event["sourceComponent"] = "HwReader"            # "sourceComponent": "HwReader",
        event["sourceIp"] = self.ip                      # "sourceIp": "We might need this",
        event["event"] = event_name                      # "event": "SET_THROTTLE",
        event["station"] = self.station                  # "station": "HELM",
        event["payload"] = payload                       # "payload": {"value": 100}

        return event

    def payloader(input_name, value, fields, settings):
        payload = {}

        try:
            if "name" in fields[0]:
                value_name = fields[0]["name"]

                # Check if a [set_value] has been defined [value_name]
                # It is used if defined.
                if 'value' in settings[input_name]:
                    if value_name in settings[input_name]["value"]:
                        set_value = settings[input_name]['value'][value_name]
                        payload[value_name] = set_value

                # If "possibleValues" are defined and no predefined
                # value is set, cycles through the list.
                # Uses [value] as index for [possible] values
                elif "possibleValues" in fields[0]:
                    possible = fields[0]["possibleValues"]
                    payload[value_name] = possible[value]

                # If nothing else, then the plain value is used
                else:
                    payload[value_name] = value

        ##else: The event is a plain event, no "value" or "payload" is delivered
        except IndexError:
            pass

        return payload

    def run(self):

        #########################################
        udpIP = '192.168.10.255'
        udpPort = 41114     #22100

        udpSender = UdpSender(udpIP, udpPort)
        #########################################

        try:
            # Main Loop
            while True:

                # Gets a new input message from queue
                item = self.inputQueue.get()
                ##print(" >>>", item[0], item[1])

                # A new event is created
                event = EventMaker.event(self, item[0], item[1])
                print(json.dumps(event, sort_keys=False, indent=4))
                ##self.eventQueue.put(event)

                # Sends the message (single threaded)
                udpSender.run(json.dumps(event))

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

    # inQ = Queue(1)
    # eQ = Queue(0)
    # eventTypes = eventConfig.EventConfig()
    # inputConfig = InputConfig()
    # a = EventMaker(0.5, inQ, eQ, eventTypes, inputConfig, 'self test station')
    # #print(a.event("LOAD_TUBE", 1, 0))
    # event = EventMaker.event(a, "LOAD_TUBE", 1)


#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 27.02.2019
# Cythonized 04.11.2023
# EventMaker

from time import sleep
from threading import Thread
from inputConfig import InputConfig
from udpSender import UdpSender
import time
import json
import myIP
from logger import Logger

cdef extern from "Python.h":
    void PyEval_InitThreads()


cdef class EventMaker():
    '''A thread to process the inputs to events.'''


    cdef float cycleTime
    cdef object inputQueue
    cdef object eventQueue
    cdef object eventConfig
    cdef object inputConfig
    cdef str station
    cdef str ip
    # cdef float posix Defined locally

    # Init Thread
    cdef object myThread
    cdef bint running

    def __init__(self, float sleep, object inputQueue, object eventQueue,
                 object eventConfig, object inputConfig, str station="Undefined Station"):

        # Configure Thread
        PyEval_InitThreads()
        self.myThread = Thread(target=self.run, daemon=True)

        self.cycleTime = sleep
        self.inputQueue = inputQueue
        self.eventQueue = eventQueue
        self.eventConfig = eventConfig
        self.inputConfig = inputConfig
        self.station = station
        self.ip = myIP.myIP()
        # self.posix = 0.0


    def start(self):
        self.myThread.start()

    def is_alive(self) -> bool:
        # Check if the thread is alive
        return self.myThread.is_alive()

    def join(self, int i):
        # Terminate the thread by sending a
        # stop signal, breaking the main loop
        self.running = False


    cdef event(self, str input_name, int value, object settings):
        '''
        Formats the event input in to an event.
        - Takes the input name and value as inputs
        - Translates the input name to an event name
        ...
        '''

        cdef float posix
        cdef str event_name
        cdef dict field
        cdef dict payload
        cdef dict event
        cdef list fields

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

        fields = self.eventConfig.event(event_name)     # list

        if len(fields) != 0:
            payload = EventMaker.payloader(self, input_name, value, fields[0], settings)
        else:
            # The event is a plain event, no "value" or "payload" is delivered
            payload = {}

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


    cdef payloader(self, str input_name, int value, dict fields, object settings):
        '''
        Packs the payload for the event
        Searches the dict of events for payload configurations
        and interprits how to combine it with the [value].
        '''

        cdef str value_name
        cdef dict input_setting
        cdef object set_value
        cdef dict payload
        cdef list possible

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

        return payload


    cdef run(self):

        cdef object logger
        cdef str udpIP
        cdef int udpPort
        cdef object udpSender
        cdef object settings

        cdef float start_time
        cdef float end_time
        cdef float cycle_length
        cdef object item       ## Fix this ##############################
        cdef dict event


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

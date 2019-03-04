#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 27.02.2019
# EventMaker

from time import sleep
import threading
import eventConfig
import datetime
import json
#from queue import Queue


class EventMaker(threading.Thread):
    '''A thread to process the inputs to events.'''


    def __init__(self, sleep, inputQueue, eventQueue, station=""):
        threading.Thread.__init__(self)
        self.cycleTime = sleep
        self.inputQueue = inputQueue
        self.eventQueue = eventQueue
        self.eventMapping = eventConfig.loadConfig()
        self.station = station

    def event(self, name, value):
        '''
        Formats the event input in to an event.
        - Takes the input name and value as inputs
        - Translates the input name to an event name
        ...
        '''


        # SCALE [value] AS NESSESARY HERE
        #
        #

        current_time = datetime.datetime.now()
        posix = datetime.datetime.timestamp(current_time)*1000
        event = {}
        try:
            event["timestamp0"] = int(posix)           # "timestamp": "ms-from-epoch, number",
            event["sourceComponent"] = "HwReader"      # "sourceComponent": "HwReader",
            #event["sourceIp"] = "0.0.0.0"             # "sourceIp": "We might need this",
            event["event"] = self.eventMapping[name]   # "event": "SET_THROTTLE",
            event["station"] = self.station            # "station": "HELM",
            event["payload"] = {"value": value}        # "payload": {"value": 100}

        except KeyError:
            ## KeyError May be raised if input [name] is not mapped
            ## to an event name, or the event is mis-spelled.
            ##
            ## To improve the reliability, EventMaker will tolerate a
            ## misconfigured or unconfigured input, but will warn if
            ## such an input is used.
            ##
            ## This is to not crash the controller from a small typo
            ## in a config file.
            ##
            print("Warning!")
            print("Input:", name, "does not have a")
            print("valid event configured to it.")
            event = {}

        return event

    def run(self):

        try:
            # Main Loop
            while True:

                ## Gets a new input message from queue
                item = self.inputQueue.get()
                #print(" >>>", item[0], item[1])

                ## A new event is created
                event = EventMaker.event(self, item[0], item[1])

                print(json.dumps(event, sort_keys=False, indent=4))

                #self.eventQueue.put(event)

                ## Sleeping is relevant only in TESTING.
                ## In use, the Tread runs as fast as it can
                ## and waits for the input queue...
                ## this should validated on a single core Pi-0-W
                sleep(self.cycleTime)

        except KeyboardInterrupt:
            pass
        finally:
            pass

if __name__ == '__main__':
    pass

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.02.2019
# eventConfigurator

'''
Uses an external events.json to define formats
for all valid events, and combines the information
with events.txt to map inputs to events.
'''

import json
from logger import Logger

class EventConfig():
    """
    Event configuration class:
    Loads events.json and stores it as dict.
    The dict can be accessed with functions.

    the full dict can be accessed with:
    EventConfig.events(self)
    """

    def __init__(self):
        self.logger = Logger(__name__)
        self._events = EventConfig.events(self)

    def loadEvents(self):
        """
        Reads the config file and returns the JSON
        """
        try:
            eventfile = open('events.json', 'r')
        except IOError:
            self.logger.critical("Error: Could not find 'events.json'")
            exit()

        eventFile = json.load(eventfile)

        return eventFile


    def events(self):
        '''
        Generates a dictinary of events
        '''
        eventTypes = EventConfig.loadEvents(self)

        # List comprehension performed poorly in the one-off type situation
        # Performance loss was 10x
        # events = {eventType["name"]: eventType["fields"] for eventType in eventTypes}

        events={}
        for eventType in eventTypes:
            eventName = eventType["name"]
            eventData = eventType["fields"]
            events[eventName] = eventData

        return events


    def event(self, name):
        '''
        takes an event name as parameter and returns
        the event format.
        '''
        return self._events[name]


    def minimum(self, name):
        '''
        Returns the minimum value of the event [name].
        If no minimum is defined, uses zero (0).
        '''
        try:
            minimum = self._events[name][0]["min"]
        except:
            minimum = 0
        return minimum


    def maximum(self, name):
        '''
        Returns the maximum value of the event [name].
        If no maximum is defined, uses one (1).
        '''
        try:
            maximum = self._events[name][0]["max"]
        except:
            try:
                # Enables scrolling through possibleValues
                # An enhancement would be for the scroll to be  and
                # infinite wrap around.
                maximum = len(self._events[name][0]["possibleValues"])-1
            except KeyError:
                maximum = 1
            except IndexError:
                #print(">>", self._events[name])
                maximum = 1
                #raise IndexError

        return maximum


    def test(self):
        '''
        Prints out neatly the json
        '''
        eventTypes = EventConfig.loadEvents()

        for eventType in eventTypes:
            print(json.dumps(eventType["name"], sort_keys=True, indent=4))
            for fields in eventType["fields"]:
                try:
                    print(list(fields.keys()))
                except IndexError:
                    pass
            print()


if __name__ == "__main__":
    pass
    #EventConfig.test()
    eventConfig = EventConfig()
    #print(EventConfig.events(eventConfig))
    #print(EventConfig.event(eventConfig, "SET_THROTTLE"))
    #print(json.dumps(EventConfig.event(eventConfig, "LOAD_TUBE"), indent=4))
    #print()
    #print(json.dumps(EventConfig.event(eventConfig, "SET_JUMP"), indent=4))
    #print()
    #print(json.dumps(EventConfig.event(eventConfig, "SET_THROTTLE"), indent=4))
    #print()
    print(json.dumps(EventConfig.event(eventConfig, "TARGET_NEXT_ENEMY"), indent=4))
    print(eventConfig.minimum("TARGET_NEXT_ENEMY"))
    #print(json.dumps(eventTypes[0][0]["name"], sort_keys=True, indent=4))

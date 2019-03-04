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

def loadEvents():
    """
    Reads the config file and returns the parameters from it
    """
    try:
        eventfile = open('events.json', 'r')
    except IOError:
        exit("Error: Could not find 'events.json'")

    eventTypes = json.load(eventfile)

    return eventTypes

def events():
    '''
    Generates a list of events
    '''
    eventTypes = loadEvents()

    events=[]
    for eventType in eventTypes:
        #print(json.dumps(eventType["name"], sort_keys=True, indent=4))
        events.append(eventType["name"])

    return events

def event(name):
    '''
    takes an event name as parameter and returns
    the event format.
    '''
    pass

def loadConfig():
    '''
    Reads the config file and returns the input-to-event mappings as dict
    '''

    #cycle=0.001

    try:
        eventConfig = open('events.txt', 'r')
    except IOError:
        exit("Error: Could not find 'events.txt'")

    # Let's create a dictionary for joining input to event
    eventMapping = {}

    line=eventConfig.readline()
    for line in eventConfig:
        ## Ignore commented and empty lines
        if line[0] in ['#','','\n']:
            pass
        else:
            components = line.strip('\n').split(' ')
            eventMapping[components[0]] = components[1]

    eventConfig.close()

    return eventMapping

def test():
    '''
    Prints out neatly the json
    '''
    eventTypes = loadEvents()

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
    #test()
    #print(events())

    eventMappings = loadConfig()
    print(eventMappings)

    #print(json.dumps(eventTypes[0][0]["name"], sort_keys=True, indent=4))
    #print(list(eventTypes[0][0]["fields"][0].keys()))
    #print()

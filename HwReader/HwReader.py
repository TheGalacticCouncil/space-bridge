#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.01.2019
# HwReader

#from time import sleep
import inputPoller
import inputConfig

# loads configuration from file
cycleTime, aConfig, eConfig, bConfig = inputConfig.loadConfig()

# creates appropriate input instances from config file
aInput, eInput, bInput = inputConfig.collectInputs(aConfig, eConfig, bConfig)

# Creates an input thread
inputThread = inputPoller.inputPoller(aInput, eInput, bInput, cycleTime)
# Mark thread as daemon
inputThread.daemon = True
# Spawn the input thread
inputThread.start()

print("Press Enter to quit")

try:
    while True:
        a=input("Exit? ")
        #if a != '':
        break
except KeyboardInterrupt:
    inputThread.join(0.01)
inputThread.join(0.01)

print("It's done")

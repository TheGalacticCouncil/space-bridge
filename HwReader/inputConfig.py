#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.01.2019
# inputConfigurator

from EncoderReader import EncoderInput
from AnalogReader import AnalogInput

def loadConfig():
    """
    Reads the config file and returns the parameters from it
    """
    try:
        configfile = open('config.txt', 'r')
    except IOError:
        exit("Error: Could not find 'config.txt'")

    cycle=0.001
    analog=[]
    encoder=[]
    button=[]

    line=configfile.readline()
    for line in configfile:
        # ignore commented and empty lines
        if line[0] in ['#','','\n']:
            pass

        # Analog inputs
        elif line.split(' ')[0] in ['a','A','analog','Analog']:
            # (channel, name, threshold, decimals, minimum, maximum)
            analog.append(line.strip('\n').split(' '))

        # Encoder inputs
        elif line.split(' ')[0] in ['e','E','encoder','Encoder']:
            # (channel, name, threshold, decimals, minimum, maximum)
            encoder.append(line.strip('\n').split(' '))

        # Button inputs
        elif line.split(' ')[0] in ['b','B','button','Button']:
            button.append(line.strip('\n').split(' '))

        elif line.split(' ')[0] in ['c','C','cycle','cycletime','cycleTime']:
            cycle=float(line.strip('\n').split(' ')[1])

    configfile.close()

    return cycle, analog, encoder, button


def collectInputs(analogConfig, encoderConfig, buttonConfig):
    '''
    Collects inputs:
    Creates input instanses from configuration data
    and returns lists of instances.'''

    analogInput=[]
    encoderInput=[]
    buttonInput=[]

    # The input is defined and signal processing is configured.
    for i in range(len(analogConfig)):

        # Analog config
        channel = int(analogConfig[i][1]) #0

        # Optional parameters
        try:
            name = analogConfig[i][2] # "Set_Analog"
            threshold = float(analogConfig[i][3]) #0.01   # sets the threshold for registering change
            decimals = int(analogConfig[i][4]) #9
            minClip = float(analogConfig[i][5]) #0.00245  # sets minimum value clipping
            maxClip = float(analogConfig[i][6]) #0.998    # sets maximum value clipping
        except:
            pass
            if len(analogConfig[i]) == 1:
                analogInput.append(AnalogInput(channel))
            elif len(analogConfig[i]) == 2:
                analogInput.append(AnalogInput(channel, name))
            elif len(analogConfig[i]) > 2:
                analogInput.append(AnalogInput(channel, name, threshold, decimals))
        else:
            analogInput.append(AnalogInput(channel, name, threshold, decimals, minClip, maxClip))

    for i in range(len(encoderConfig)):

        # Encoder config
        clk = int(encoderConfig[i][1]) #17       # Define clock pin
        dt = int(encoderConfig[i][2]) #24        # define dt pin

        # Optional parameters
        try:
            name = encoderConfig[i][3]
            minimum = int(encoderConfig[i][4])       # Minimum allowed value
            maximum = int(encoderConfig[i][5])       # Maximum allowed value
            step = int(encoderConfig[i][6])          # Step size
        except:
            if len(encoderConfig[i]) == 2:
                encoderInput.append(EncoderInput(clk, dt))
            elif len(encoderConfig[i]) == 3:
                encoderInput.append(EncoderInput(clk, dt, name))
            if len(encoderConfig[i]) > 3:
                encoderInput.append(EncoderInput(clk, dt, name, minimum, maximum))
        else:
            encoderInput.append(EncoderInput(clk, dt, name, minimum, maximum, step))

    for i in buttonConfig:
        pass

    return analogInput, encoderInput, buttonInput

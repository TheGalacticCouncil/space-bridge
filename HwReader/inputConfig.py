#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.01.2019
# inputConfigurator

from EncoderReader import EncoderInput
from AnalogReader import AnalogInput
from buttonInput import PushButton, SwitchInput
import yaml

class InputConfig():

    def __init__(self):
        self._settings = InputConfig.readConfig()
        self._analogConfig = []
        self._encoderConfig = []
        self._buttonConfig = []
        self._switchConfig = []
        self.station = ""

    def settings(self):
        '''Returns the full input settings dict'''

        return self._settings

    def eventName(self, name):
        '''returns the primary event_name of the input [name]'''
        event_name = self._settings[name]["event"]
        return event_name

    def setting(self, name):
        '''returns the configuration for a single input
        [name], as dict.'''

        return self._settings[name]

    def readConfig():
        """
        Reads the config file and returns the dict of
        all settings.
        """

        filename = "config.yml"

        try:
            configfile = open(filename, 'r')
        except IOError:
            exit("Error: Could not find", filename)

        settings = yaml.load(configfile)
        configfile.close()

        return settings

    def loadConfig(self, eventConfig):
        '''
        Extracts from the config file and event.json,
        the required settings for configuring the
        hardware input.

        Returns configuration lists for:
        analog, encoder and button inputs.
        '''

        settings = self._settings

        analog=[]
        encoder=[]
        button=[]
        switch=[]

        cycle=0.001

        for name in settings:
            config = settings[name]
            ##print(name)
            ##print(settings[name])
            try:
                # ANALOG
                if config["type"] == "analog":
                    analog.append([
                        config['channel'],
                        ##config['event'],
                        name,                        # "name"
                        config['threshold'],
                        config['decimals'],
                        config['min_clip'],
                        config['max_clip']])

                # ENCODER
                elif config["type"] == "encoder":
                    encoder.append([
                        config['clk'],
                        config['dt'],
                        ##config['event'],
                        name,                        # name
                        eventConfig.minimum(self.eventName(name)),
                        eventConfig.maximum(self.eventName(name)),
                        config['step'] ])

                # BUTTONS AND SWITCHES
                elif config["type"] in ["push_button", "switch"]:
                    ##print("button or switch detected")
                    button_conf = [
                        config["pin"],
                        name,
                        config["invert"] ]

                    if config["type"] == "push_button":
                        ##print("button detected")
                        button.append(button_conf)
                    else:
                        ##print("switch detected")
                        switch.append(button_conf)

                # GENERAL SETTINGS
                elif config["type"] == "config":
                    try:
                        cycle = config["cycle"]
                    except KeyError:
                        print("No cycle time defined, using fallback: (1 ms).")
                    try:
                        self.station = config["station"]
                    except KeyError:
                        print("No station defined, using fallback: ''.")

                else:
                    print("Undefined input type", settings[name]["type"])

            except KeyError:
                print("No 'type' defined for", name)

        self._analogConfig = analog
        self._encoderConfig = encoder
        self._buttonConfig = button
        self._switchConfig = switch
        self.station
        ##print(button)
        ##print(switch)
        return cycle

    def collectInputs(self):
        '''
        Collects inputs:
        Creates input instanses from configuration data
        and returns lists of instances.
        '''

        analogConfig = self._analogConfig
        encoderConfig = self._encoderConfig
        buttonConfig = self._buttonConfig
        switchConfig = self._switchConfig

        analogInput=[]
        encoderInput=[]
        buttonInput=[]
        switchInput=[]

        # ANALOG INPUTS
        # The input is defined and signal processing is configured.
        for i in range(len(analogConfig)):

            # Analog config
            channel = int(analogConfig[i][0]) #0

            # Optional parameters
            try:
                name = analogConfig[i][1] # "Set_Analog"
                threshold = float(analogConfig[i][2]) #0.01   # sets the threshold for registering change
                decimals = int(analogConfig[i][3]) #9
                minClip = float(analogConfig[i][4]) #0.00245  # sets minimum value clipping
                maxClip = float(analogConfig[i][5]) #0.998    # sets maximum value clipping
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

        # ENCODER INPUTS
        for i in range(len(encoderConfig)):

            # Encoder config
            clk = int(encoderConfig[i][0]) #17      # Define clock pin
            dt = int(encoderConfig[i][1]) #24       # define dt pin
            minimum = int(encoderConfig[i][3])      # Minimum allowed value
            maximum = int(encoderConfig[i][4])      # Maximum allowed value

            # Optional parameters
            name=""
            step=1
            try:
                name = encoderConfig[i][2]
            except: pass
            try:
                step = int(encoderConfig[i][5])    # Step size
            except: pass

            # Automatically configured parameters

            encoderInput.append(EncoderInput(clk, dt, name, minimum, maximum, step))

        # PUSH BUTTONS
        for i in range(len(buttonConfig)):
            pin = int(buttonConfig[i][0])
            name = buttonConfig[i][1]
            invert = buttonConfig[i][2]
            #buttonInput.append(PushButton(buttonConfig[i]))
            buttonInput.append(PushButton(pin, name, invert))

        # SWITSHES
        for i in range(len(switchConfig)):
            pin = int(switchConfig[i][0])
            name = switchConfig[i][1]
            invert = switchConfig[i][2]
            #switchInput.append(SwitchInput(switchConfig[i]))
            switchInput.append(SwitchInput(pin, name, invert))

        return analogInput, encoderInput, buttonInput, switchInput

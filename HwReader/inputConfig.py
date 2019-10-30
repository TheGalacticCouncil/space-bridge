#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 28.01.2019
# inputConfigurator

from EncoderReader import EncoderInput
from AnalogReader import AnalogInput
from buttonInput import PushButton, SwitchInput
import yaml
from logger import Logger


class ConfigurationError(Exception):
    """Exception raised for errors in the configuration.

    Attributes:
        message -- Configuration refrenced a pin that is out of range of sane GPIO
    """

class InputConfig():

    def __init__(self):
        self.logger = Logger(__name__)
        try:
            self._settings = self.readConfig()
        except:
            self.logger.critical("Encountered a critical error while reading config.")
            raise
        self._analogConfig = []
        self._encoderConfig = []
        self._buttonConfig = []
        self._switchConfig = []
        self.station = ""
        self.udp_ip = '192.168.10.255'
        self.udp_port = 41114 


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


    def readConfig(self):
        """
        Reads the config file and returns the dict of
        all settings.
        """

        filename = "config.yml"

        try:
            configfile = open(filename, 'r')
        except FileNotFoundError:
            self.logger.critical("Error: Could not find %s" % filename)
            exit()

        settings = yaml.load(configfile, Loader=yaml.BaseLoader)
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
            self.logger.debug("New input: %s" % name)
            try:
                # ANALOG
                if config["type"] == "analog":
                    self.logger.debug("Type: analog")
                    analog.append([
                        config['channel'],
                        name,                        # "name"
                        config['threshold'],
                        config['min_clip'],
                        config['max_clip'],
                        eventConfig.minimum(self.eventName(name)),
                        eventConfig.maximum(self.eventName(name)),
                        config['trigger']
                        ])
                    
                    if config['trigger'] in range(28, 100):
                        self.logger.critical("Configuration error: Invalid GPIO address '{}' for '{}': 'trigger'".format(config['trigger'], name))
                        raise ConfigurationError("Invalid GPIO address '{}' for '{}': 'trigger'".format(config['trigger'], name))

                # ENCODER
                elif config["type"] == "encoder":
                    self.logger.debug("Type: encoder")
                    encoder.append([
                        config['clk'],
                        config['dt'],
                        name,                        # name
                        eventConfig.minimum(self.eventName(name)),
                        eventConfig.maximum(self.eventName(name)),
                        config['step'] 
                        ])
                    
                    if config['clk'] in range(28, 100):
                        self.logger.critical("Configuration error: Invalid GPIO address '{}' for '{}': 'clk'".format(config['clk'], name))
                        raise ConfigurationError("Invalid GPIO address '{}' for '{}': 'clk'".format(config['clk'], name))
                        
                    if config['dt'] in range(28, 100):
                        self.logger.critical("Configuration error: Invalid GPIO address '{}' for '{}': 'dt'".format(config['dt'], name))
                        raise ConfigurationError("Invalid GPIO address '{}' for '{}': 'dt'".format(config['dt'], name))

                # BUTTONS AND SWITCHES
                elif config["type"] in ["push_button", "switch"]:
                    self.logger.debug("Type: button or switch")
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
                        
                    if config['pin'] in range(28, 100):
                        self.logger.critical("Configuration error: Invalid GPIO address '{}' for '{}': 'pin'".format(config['pin'], config[1]))
                        raise ConfigurationError("Invalid GPIO address '{}' for '{}': 'pin'".format(config['pin'], name))
                        
                    elif config['pin'] in range(28, 100):
                        self.logger.critical("Configuration error: Invalid GPIO address '{}' for '{}': 'pin'".format(config['pin'], config[1]))
                        raise ConfigurationError("Invalid GPIO address '{}' for '{}': 'pin'".format(config['pin'], config[1]))
                        
                # GENERAL SETTINGS
                elif config["type"] == "config":
                    self.logger.debug("Settings")
                    if "cycle" in config:
                        cycle = config["cycle"]
                        self.logger.debug("Cycle set to: %s" % cycle)
                    else:
                        self.logger.warning("No cycle time defined, using fallback: (%i ms)." % (int(cycle * 1000)))
                    if "station" in config:
                        self.station = config["station"]
                        self.logger.debug("Station set to: %s" % self.station)
                    else:
                        self.logger.warning("No station defined, using fallback: ''.")
                    if "udp_ip" in config:
                        self.udp_ip = config["udp_ip"]
                        self.logger.info("Broadcas address set to %s" % self.udp_ip)
                    else:
                        self.logger.error("Broadcast address not defined.")
                    if "udp_port" in config:
                        self.udp_port = config["udp_port"]
                        self.logger.info("Broadcas port set to %s" % self.udp_port)
                    else:
                        self.logger.warning("Port not defined. Using default %i" % self.udp_port)
                else:
                    self.logger.warning("Undefined input type '%s'" % settings[name]["type"])

            except KeyError:
                self.logger.warning("No 'type' defined for '%s'" % name)

        self._analogConfig = analog
        self._encoderConfig = encoder
        self._buttonConfig = button
        self._switchConfig = switch
        self.station
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
            name = analogConfig[i][1] # "Set_Analog"
            threshold = float(analogConfig[i][2]) #0.01   # sets the threshold for registering change
            minClip = float(analogConfig[i][3]) #0.00245  # sets minimum value clipping
            maxClip = float(analogConfig[i][4]) #0.998    # sets maximum value clipping
            minimum = float(analogConfig[i][5]) # 0       # Set the minimum value
            maximum = float(analogConfig[i][6]) # 100     # Set the maximum value
            trigger = int(analogConfig[i][7])
            analogInput.append(AnalogInput(channel, name, threshold, 
                                           minClip, maxClip, 
                                           minimum, maximum, trigger))

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

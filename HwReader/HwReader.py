#!/usr/bin/env python3
# J.V.Ojala 17.01.2019
# HwReader

from EncoderReader import EncoderInput
from AnalogReader import AnalogInput
from RPi import GPIO


def loadConfig():
    """
    Reads the config file and inputs the parameters from it
    """
    configfile = open('config', 'r')

    configfile.close()


if __name__ == "__main__":

    from time import sleep

    ######################
    ##    FOR TESTING

    # global congig
    idleTime = 0.001

    # Encoder config
    counter = 0      # Define counter
    clk = 17         # Define clock pin
    dt = 24          # define dt pin

    # Analog Config
    value = 0
    decimals = 9
    minimum = 0.00245
    maximum = 0.998
    threshold = 0.01

    # Analog config
    channel = 0

    # Initialize lists for input configs
    analogConfig = []
    encoderConfig = []

    # to test the input list, make the list non-empty
    analogConfig.append(0)
    encoderConfig.append(0)

    # Initialize input lists
    analogInput = []
    encoderInput = []

    # Collect inputs
    # The input is defined and signal processing is configured.
    for i in analogConfig:
        analogInput.append(AnalogInput(channel, threshold, decimals, minimum, maximum))

    for i in encoderConfig:
        encoderInput.append(EncoderInput(clk, dt))

    ##
    ######################

    try:

        # Main Loop
        while True:

            # counter will need to be replaced with something more flexible

            # Encoder is read
            counter, changed = encoderInput[0].increment(counter)
            if changed == True:
                print("encoder:", counter)

            # Potentiometer is read
            value, changed = analogInput[0].readUpdate()
            if changed == True:
                print("Potential:", value)

            sleep(idleTime)

    finally:
        GPIO.cleanup()

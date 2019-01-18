# J.V.Ojala 17.01.2019
# AnalogReader
"""
Module for reading potentiometer (analog) input.
name = AnalogInput(inputChannel)
  channel = [0-7]
name.read()
"""

# For ANALOG INPUT you need
# an MCP3008 AD converter chip

from RPi import GPIO            # Raspberry GPIO pins
from gpiozero import MCP3008    # A/D converter


class AnalogInput():

    def __init__(self, inputChannel):
        self.analogInput = MCP3008(inputChannel)

    def readRaw(self):
        return self.analogInput.value

    def read(self, decimals=2, minimum=0.0, maximum=1.0):
        """
        Rounds to [decimals].
        if decimals = 0, ommits dounding.
        Rescales the input from [minimum] to [maximum].
        """

        value = self.analogInput.value

        # Scaling
        value = (value-minimum)/(maximum-minimum)

        # Rounding
        if decimals > 0:
            value = round(value ,decimals)

        return value

# Module can be run directly to test its function
if __name__ == "__main__":
    from time import sleep

    input1 = AnalogInput(0)

    try:
        while True:
            value = input1.read(9, 0.0024, 100)
            print(value)
            sleep(0.1)
    finally:
        GPIO.cleanup()

##
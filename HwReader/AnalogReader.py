# J.V.Ojala 17.01.2019
# AnalogReader
'''Module for reading potentiometer (analog) input.
name = AnalogInput(inputChannel)
  channel = [0-7]
name.read()'''

# For ANALOG INPUT you need
# an MCP3008 AD converter chip

from RPi import GPIO            # Raspberry GPIO pins
from gpiozero import MCP3008    # A/D converter

class AnalogInput():
    def __init__(self, inputChannel):        
        self.analogInput = MCP3008(inputChannel)

    def readRaw(self):
        return self.analogInput.value
        
    def read(decimals=2, minimum=0, maximum=100):
        'rounds to [decimals]'
        'and rescales the input from [minimum] to [maximum]'
        
        # add rounding
        
        # add scaling
        
        return self.analogInput.value
        
# Module can be run directly to test its function
if __name__ == "__main__":
    from time import sleep
        
    input1 = AnalogInput(0)
    
    try:
        while True:
            value = input1.readRaw()
            print(value)
            sleep(0.1)
    finally:
        GPIO.cleanup()

##
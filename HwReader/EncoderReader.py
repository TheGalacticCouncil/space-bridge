# J.V.Ojala 17.01.2019
# EncoderReader
'''Module for reading rotary encoder input.
name = EncoderInput(clock, dt)
name.read([counter])'''

from RPi import GPIO

class EncoderInput():
    def __init__(self, clk, dt):
        self.clockPin = clk
        self.dtPin = dt

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.clockPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(self.dtPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

        self.previousClockState = GPIO.input(self.clockPin)

    def read(self, counter=0):
        clockState = GPIO.input(self.clockPin)
        dtState = GPIO.input(self.dtPin)
        if clockState != self.previousClockState:
            if dtState != clockState:
                counter += 1
            else:
                counter -= 1
        self.previousClockState = clockState    
        
        return counter

# Module can be run directly to test its function
if __name__ == "__main__":
    from time import sleep
    
    counter = 0      # Define counter
    clk = 17         # Define clock pin
    dt = 24          # define dt pin
    
    delta = 0
    
    input1 = EncoderInput(clk, dt)
    
    try:
        while True:
            ###
            delta = input1.read()
            if delta != 0:
                counter += delta
                print(counter)
            delta = 0
            ###
            sleep(0.001)
    finally:
        GPIO.cleanup()


##########
##########
        
## configurable module for reading a rotary encoder input
#'''
#encoder(
#  "clk" GPIO pin,
#  "dt" GPIO pin,
#  [a Counter to be incremented]) 
#Output:
#  incremented counter or relative change
#'''
#
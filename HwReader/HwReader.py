# J.V.Ojala 17.01.2019
# HwReader

from EncoderReader import EncoderInput
from RPi import GPIO


def delta(anInput, counter):
    delta = anInput
    if delta != 0:
        counter += delta
        return(counter)

if __name__ == "__main__":
    from time import sleep
    
    counter = 0      # Define counter
    clk = 17         # Define clock pin
    dt = 24          # define dt pin
    
    delta = 0
    
    input1 = EncoderInput(clk, dt)
    
    try:
        while True:
#            thing = delta(input1.read(), counter)
#            print(thing)
#            sleep(0.001)
            
            
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

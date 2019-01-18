# J.V.Ojala 17.01.2019
# HwReader

from .EncoderReader import EncoderInput
from RPi import GPIO

# add: read config from file
idleTime = 0.001


def change(value, counter=0, threshold=0, changed=False):
    """
    counter, changed = change(value, [counter], [threshold])
     - input value
     - a counter that is incremented (optional, default=0)
     - threshold for incrementing the counter (optional, default=0)
       > for digital inputs use zero
    """

    delta = value

    # If change is large enough to trigger an update
    # for digital inputs use zero
    if abs(delta) > threshold:
        changed = True
        counter += delta
        return counter, changed
    else:
        return counter, changed

def loadConfig():
    """
    Reads the config file and inputs the parameters from it
    """
    configfile = open('config', 'r')

    configfile.close()



if __name__ == "__main__":

    from time import sleep

    counter = 0      # Define counter
    clk = 17         # Define clock pin
    dt = 24          # define dt pin

    delta = 0

    input1 = EncoderInput(clk, dt)


    try:

        # Main Loop
        while True:

            counter, changed = change(input1.read(), counter)

            if changed == True:
                print(counter)

            sleep(idleTime)

    finally:
        GPIO.cleanup()

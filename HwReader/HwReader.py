# J.V.Ojala 17.01.2019
# HwReader

from EncoderReader import EncoderInput
from RPi import GPIO

# add: read config from file
idleTime = 0.001


def delta(value, counter=0, threshold=0):
    """
    value, [counter], [threshold]
    input value
    a counter that is incremented (optional, default=0)
    threshold for incrementing the counter (optional, default=0)
     -for digital inputs use zero
    """

    delta = value

    # If change is large enough to trigger an update
    # for digital inputs use zero
    if abs(delta) > threshold:
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
            sleep(idleTime)

    finally:
        GPIO.cleanup()

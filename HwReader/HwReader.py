#!/usr/bin/env python3
# J.V.Ojala 17.01.2019
# HwReader

import inputConfig
from RPi import GPIO


if __name__ == "__main__":

    from time import sleep

    # loads configuration from file
    cycleTime, analogConfig, encoderConfig, buttonConfig = inputConfig.loadConfig()

    # creates appropriate input instances from config file
    analogInput, encoderInput, buttonInput = inputConfig.collectInputs(analogConfig, encoderConfig, buttonConfig)

    # Analog Init
    value=[]
    for i in range(len(analogInput)):
        value.append(0)

    # Encoder Init
    counter=[]
    for i in range(len(encoderInput)):
        counter.append(0)

    # Button Init
    for i in range(len(buttonInput)):
        pass

    try:

        # Main Loop
        while True:

            for i in range(len(analogInput)):
                # Potentiometer is read
                value[i], changed, name = analogInput[i].readUpdate()
                if changed == True:
                    print("Potential:", value[i])

            for i in range(len(encoderInput)):
                # Encoder is read
                counter[i], changed, name = encoderInput[i].increment(counter[i])
                if changed == True:
                    print("encoder:", counter[i])

            for i in range(len(buttonInput)):
                # Button is read
                pass

            sleep(cycleTime)

    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 10.03.2019
# ButtonInput

from RPi import GPIO

class PushButton():
    """
    And object to read a button push.
    If the button input is default HIGH, the input can be inverted.
    """
    
    def __init__(self, pin, name='', invert=False):

        self.name = name
        self.pin = pin
        self.invert = invert

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        self.last_state = False

    @profile
    def read(self):
        """
        Reads the push button state.
        Returns True, if the button is pressed. 
        """

        if self.invert == True:
            state = GPIO.input(self.pin) == GPIO.LOW
        else:
            state = GPIO.input(self.pin) == GPIO.HIGH

        if state == True:
            if state != self.last_state:
                self.last_state = True
                return True, self.name
        else:
            self.last_state = False
        
        return False, self.name

class SwitchInput():
    """
    An object to read the state of a button
    """
    def __init__(self, pin, name='', invert=False):

        self.name = name
        self.pin = pin
        self.invert = invert

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        self.last_state = False

    @profile
    def read(self):
        """
        Reads the switch state.
        Returns True, if the button is pressed. 
        """

        if self.invert == True:
            state = GPIO.input(self.pin) == GPIO.LOW
        else:
            state = GPIO.input(self.pin) == GPIO.HIGH

        if state == True:
            if state != self.last_state:
                self.last_state = True
                return True, self.name

        else:
            if state != self.last_state:
                self.last_state = False
                return False, self.name
        
        return None, self.name


# Module can be run directly to test its function
if __name__ == "__main__":

    from time import sleep

    push_pin = 16       # Input pin
    switch_pin = 12     # 

    input1 = PushButton(push_pin, invert=True)
    input2 = SwitchInput(switch_pin, invert=True)

    print("pin: %i Push Button:\n" % push_pin)
    print("pin: %i Switch Button:\n" % switch_pin)

    try:
        while True:
            ###
            button, name = input1.read()
            if button == True:
                print("Hey! You pressed it!")
            ###
            switch, name = input2.read()
            if switch == True:
                print("Hey! You pressed the other it!")
            elif switch == False:
                print("Hey! You releaced the other it!")
            else:
                pass

            sleep(0.1)

    except:
        pass
    finally:
        GPIO.cleanup()
        print("\nClean exit")

#EOF#

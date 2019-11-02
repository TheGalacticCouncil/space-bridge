#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 10.03.2019
# ButtonInput

from mcp23017 import GPIO

class PushButton():
    """
    And object to read a button push.
    If the button input is default HIGH, the input can be inverted.
    """
    
    def __init__(self, pin, name='', invert=True, interrupt=True, debounse=300):

        self.name = name
        self.pin = pin
        self.invert = invert

        self.state = False
        # self.last_state = False
        self.changed = False

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        
        if self.invert == True:                             # Inversion is done in init, not read()
            self.level = GPIO.LOW
        else:
            self.level = GPIO.HIGH

        if interrupt==True:
            if invert == True:
                GPIO.add_event_detect(pin, GPIO.FALLING, callback=self.read, bounce=debounse)
            else:
                GPIO.add_event_detect(pin, GPIO.RISING, callback=self.read, bounce=debounse)


    def probe(self):
        """
        Probes state of the putton
        Returnes the stored values from the <button instance>
        """

        state = self.state          # Reads the changed state
        self.state = False          # Resets the changed state

        return state, self.name


    def read(self, foo):
        """
        Reads the push button state.
        Returns True, if the button is pressed. 
        """

        state = GPIO.input(self.pin) == self.level          # Compares the input to a chosen level
                                                            # Logic Hign or logic Low
        if state == True:
            # if state != self.last_state:
            #     self.last_state = True
            # return True, self.name
            self.state = True
        else:
            # self.last_state = False
            self.state = False
        
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

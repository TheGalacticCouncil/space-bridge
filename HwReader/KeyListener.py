#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 27.02.2019
# KeyListener

#from time import sleep
import threading
#from queue import Queue

class KeyListener(threading.Thread):
    '''Listens for an 'enter' and then sends 'False' to queue'''

    def __init__(self, inputQueue):
        threading.Thread.__init__(self)
        #self.cycleTime = sleep
        self.inputQueue = inputQueue

    def run(self):
        input()                        # Wait for enter
        self.inputQueue.put(False)      # When enter is pressed, send True
        exit()

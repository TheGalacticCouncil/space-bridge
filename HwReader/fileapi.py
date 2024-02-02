#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 02.02.2024
# MCP3008 - File API adapter

from gpiozero import MCP3008         # A/D converter

class MCP3008():
    '''
    Wrapper for MCP3008
    for inputVannel values under 8, uses the gpiozero library
    normally. With values [10..inf] uses the file api.
    '''

    def __init__(self, inputChannel):

        self.inputChannel = inputChannel
        self.filename = "/tmp/mcp3008-touched-values-output.txt"

        # Direct access channels
        if inputChannel < 8:
            self.value = MCP3008(inputChannel).value
        else:
            self.value = self.fileApi(inputChannel - 10)


    def fileApi(self, virtualChannel):
        '''
        Reads lines from file API
        Returns the line value as int
        '''
        with open(self.filename, 'r') as f:
            inputs = f.readlines()
        value = int(inputs[virtualChannel])
        return value

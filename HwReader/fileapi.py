#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 02.11.2019
# fileapi
"""
Module for reading potentiometer (analog) input.
name = AnalogInput(inputChannel)
  channel = [0-7]
name.read()
"""

class MCP3008():

    def __init__(self, channel):
        
        self.filename = "../HwDriver/testi.txt"
        self.channel = channel


    def read(self):

        raw_data = self.read_file()
        value = MCP3008.rescale(raw_data)

        return value

###
# INTERNALS
###

    def read_file(self):

        with open(self.filename, 'r') as inputs:
            raw_data = inputs.readline(self.channel)

            return int(raw_data.strip('\n'))

    @staticmethod
    def rescale(raw_data):

        return raw_data / 1023


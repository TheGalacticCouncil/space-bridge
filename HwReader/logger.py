#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 14.03.2019
# Logger

import logging

class Logger():
    '''
    Logging class to centrally take care of logging everyting
    Used to interface with the global logging module.
    '''

    def __init__(self, module_name):

        filename = 'HwReader.log'
        
        # Creates an empty log file
        # Comment out to use append mode 
        open(filename, 'w').close()

        self.module_name = module_name
        self.logger = logging.getLogger(self.module_name)
        self.logger.setLevel(logging.DEBUG)
        
        # Create handlers
        self.file_handler = logging.FileHandler(filename)
        self.stream_handler = logging.StreamHandler()

        # Set handler levels
        #logging_level=logging.DEBUG
        self.stream_handler.setLevel(logging.DEBUG)
        self.file_handler.setLevel(logging.DEBUG)

        # Set log format
        self.logging_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        # Add formatter to handlers
        self.stream_handler.setFormatter(self.logging_format)
        self.file_handler.setFormatter(self.logging_format)

        # Add handlers to the logger
        self.logger.addHandler(self.stream_handler)
        self.logger.addHandler(self.file_handler)

    def get_logger(self):
        '''
        returns the actual logger...
        '''
        return self.logger

    def debug(self, message):
        self.logger.debug(message)

    def info(self, message):
        self.logger.info(message)

    def warning(self, message):
        self.logger.warning(message)

    def error(self, message):
        self.logger.error(message)

    def critical(self, message):
        self.logger.critical(message)

if __name__ == "__main__":
    lokking = Logger(__name__)
    lokking.debug("foo")

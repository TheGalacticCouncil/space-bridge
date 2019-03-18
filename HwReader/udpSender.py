#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# J.V.Ojala 11.03.2019
# UdpSender

from time import sleep
#import threading           # UdpSender is easyly threadable, but
import socket               # on the one-core Pi-Zero-W it would

#class UdpSender(threading.Thread):
class UdpSender():

    def __init__(self, broadcast_ip, port):
        #threading.Thread.__init__(self)
        self.broadcast_ip = broadcast_ip
        self.port = port

    def run(self, message):
        byte_message = bytearray(message,"utf-8")
        network = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        network.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        network.sendto(byte_message, (self.broadcast_ip, self.port))

if __name__ == '__main__':

    udpIP = '192.168.10.255'
    #udpIP = '<broadcast>'

    udpPort = 41114     #22100
    #bufferSize = 508    #1024

    message = "Howdy world!"
    udpSender = UdpSender(udpIP, udpPort)
    udpSender.run(message)


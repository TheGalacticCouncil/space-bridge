#!/bin/bash
no_color=$(echo -e "\033[0m")
yellow=$(echo -e "\033[1;33m")
green=$(echo -e "\033[1;32m")
red=$(echo -e "\033[1;31m")
cyan=$(echo -e "\033[1;36m")

# System
echo "${green}System Version:${yellow}"
echo -n "    "
lsb_release -d | sed -e 's/^[ \t]*//' | cut -c 14-

# Network
echo "${green}Network:${yellow}"
echo -n "    "
ifconfig | grep "inet 192." | sed -e 's/^[ \t]*//'

# Uptime and load
echo "${green}Uptime and Load:${yellow}"
echo -n "    "
uptime | sed -e 's/^[ \t]*//'
echo "${no_color}"

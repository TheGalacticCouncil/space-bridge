#!/bin/bash
no_color=$(echo -e "\033[0m")
yellow=$(echo -e "\033[1;33m")
green=$(echo -e "\033[1;32m")
red=$(echo -e "\033[1;31m")
cyan=$(echo -e "\033[1;36m")

# The script expects an enviromental variable STATION. 
# Define it in .bashrc or profile
# export STATION=

#RESOURCE_PATH=/etc/
RESOURCE_PATH=~/motd/
#RESOURCE_PATH=~/git/space-bridge/resources/motd/

# Fonts: https://www.asciiart.eu/text-to-ascii-art

# Space Bridge
"$RESOURCE_PATH"/texts/echo_space_bridge.sh

# Station type
if [ "$STATION" == "engineer-a" ]; then
    "$RESOURCE_PATH"/texts/echo_engineer_a.sh
elif [ "$STATION" == "engineer-b" ]; then
    "$RESOURCE_PATH"/texts/echo_engineer_b.sh
elif [ "$STATION" == "weapons" ]; then
    "$RESOURCE_PATH"/texts/echo_weapons.sh
elif [ "$STATION" == "" ]; then
    echo ""
else
    echo "Station:"
    echo "    $STATION"
fi

# System info
"$RESOURCE_PATH"/texts/echo_system_info.sh

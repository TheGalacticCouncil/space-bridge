#!/bin/bash

# Set enviromental variable STATION as the station type before running the script
# You can change the station from .bashrc later
#STATION="example station"

if [ "$STATION" == "" ]; then
    echo "STATION variable not set"
    echo "Please set STATION enviromental variable with the name (type) of the station"
    echo "before running this script:"
    echo '   export STATION="engineer-a" '
    sleep 2
    exit
fi

echo "Setting up MOTD for <$STATION>"

# Copy scripts to HOME
cp -r ../motd ~/
# Setup an enviromen variable
echo "export STATION='$STATION'" >> ~/.bashrc
# Setup motd.sh to run at login
echo "~/motd/motd.sh" >> ~/.bashrc

echo "done"

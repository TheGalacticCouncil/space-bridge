#!/bin/bash
# Setup sctipt for installing HwReader and it's dependancies

echo "Installing Python 3"
sudo apt-get update
sudo apt-get install python3
sudo apt-get install python3-pip

echo "Update CA-certificates"
apt-get install -y --reinstall ca-certificates

echo "Installing libraries"
pip3 install -r requirements.txt  --break-system-packages

echo "================="
echo -e "\nInstall complete!"
echo "================="
echo -e "\nYou can run Hwreader by running run.sh"

echo -e "\n\nCreate a config.yml that matches your hardware configuration or"
echo -e "copy one from config examples and name as config.yml"

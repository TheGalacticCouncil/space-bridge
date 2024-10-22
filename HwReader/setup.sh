#!/bin/bash
# Setup sctipt for installing HwReader and it's dependancies

# Terminal Colors
no_color=$(echo -e "\033[0m")
yellow=$(echo -e "\033[1;36m")
green=$(echo -e "\033[1;32m")
red=$(echo -e "\033[1;31m")

echo -e "${yellow}Installing Python 3${no_color}"
sudo apt-get update
sudo apt-get install python3
sudo apt-get install python3-pip

echo -e "${yellow}Update CA-certificates${no_color}"
apt-get install -y --reinstall ca-certificates

echo -e "${yellow}Installing libraries${no_color}"
pip3 install -r requirements.txt  --break-system-packages

echo "================="
echo -e "${green}\nInstall complete!${no_color}"
echo "================="
echo -e "\nYou can run Hwreader by running run.sh"

echo -e "\n\nCreate a config.yml that matches your hardware configuration or"
echo -e "copy one from config examples and name as config.yml"

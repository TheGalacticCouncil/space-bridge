#!/bin/bash
# Setup sctipt for installing HwReader and it's dependancies
echo
echo "## Installing Python 3 ##"
sudo apt-get update
sudo apt-get install python3
sudo apt-get install python3-pip
echo
echo "## Updating CA-certificates ##"
apt-get install -y --reinstall ca-certificates
echo
echo "## Installing libraries ##"
pip3 install -r requirements.txt
echo
echo "## Installing Cython ##"
pip install Cython
echo
echo "## Building Cython modules ##"
python setup.py build_ext --inplace
echo
echo "================="
echo -e "\nInstall complete!"
echo "================="
echo -e "\nYou can run Hwreader by running run.sh"
echo
echo -e "\nCreate a config.yml that matches your hardware configuration or"
echo -e "copy one from config examples and name as config.yml"

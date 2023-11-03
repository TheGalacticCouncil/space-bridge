#!/bin/bash
# Setup sctipt for installing HwReader and it's dependancies

echo
echo "## Installing libraries ##"
pip3 install -r requirements.txt
echo
echo "## Building Cython modules ##"
python setup.py build_ext --inplace

echo "================="
echo -e "\nInstall complete!"
echo "================="
echo -e "\nYou can run Hwreader by running run.sh"

echo -e "\n\nCreate a config.yml that matches your hardware configuration or"
echo -e "copy one from config examples and name as config.yml"

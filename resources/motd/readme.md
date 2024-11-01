# Terminal Login MOTD Customization

1. Copy this folder: motd to home `cp -r motd ~/`
3. Add appropriate enviroment variable to `.bashrc`:
    - `echo "export STATION='engineer a'" >> ~/.bashrc` for Engineer A
    - `echo "export STATION='engineer b'" >> ~/.bashrc` for Engineer B
    - `echo "export STATION='weapons'" >> ~/.bashrc` for Weapons
2. Add `~/motd/motd.sh` to end of the `.bashrc` file: `echo "~/motd/motd.sh" >> ~/.bashrc`

The motd script will print out fancy ASCII art text and info of the system on every login

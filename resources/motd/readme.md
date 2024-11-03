# Terminal Login MOTD Customization

The motd script will print out fancy ASCII art text and info about the system on every login

## Automatic setup (recommended)

1. Set enviroment variable `STATION` to match one of the boards:
    - `weapons`
    - `engineer-a`
    - `engineer-b`
2. Run the `setup.sh` script from inside resources/motd/: `./setup.sh`

## Manual setup

1. Copy this folder: motd to home `cp -r motd ~/`
2. Add appropriate enviroment variable to `.bashrc`:
    - `echo "export STATION='engineer a'" >> ~/.bashrc` for Engineer A
    - `echo "export STATION='engineer b'" >> ~/.bashrc` for Engineer B
    - `echo "export STATION='weapons'" >> ~/.bashrc` for Weapons
3. Add `~/motd/motd.sh` to end of the `.bashrc` file: `echo "~/motd/motd.sh" >> ~/.bashrc`

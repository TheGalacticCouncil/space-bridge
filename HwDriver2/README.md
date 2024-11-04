# HwDriver2

HwDriver2 is a next-gen version of HwDriver, written in Go.


## Usage

### TL;DR

1. Donwload binary from the latest executed GitHub Actions job
2. Create configuration file `config.yaml`
3. Start pigpio daemon if not already done by running `sudo pigpiod -x 0x0FFFFFFF`
4. Run the binary


### Detailed instructions

HwDriver2 requires configuration file to initialize itself properly. The configuration file must be located in the
same folder with the executable and must be named `config.yaml`. All available configuration options are documented in
the `config.yaml` file in this folder. Example configuration files for each stationa are provided under the `examples/`
folder.

Once configuration file is in place, the application can be started by running the binary.


## Known-issues

* If the program is not terminated gracefully, SPI handles will be left open. 
  Once the limit of 32 handles has been reached, only way to recover is to restart Pi.

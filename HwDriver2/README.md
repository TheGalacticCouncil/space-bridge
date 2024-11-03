# HwDriver2

HwDriver2 is a next-gen version of HwDriver, written in Go. The work here is still heavily in process and is not usable
for anything yet.


## Known-issues

* If the program is not terminated gracefully, SPI handles will be left open. 
  Once the limit of 32 handles has been reached, only way to recover is to restart Pi.

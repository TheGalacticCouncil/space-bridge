# Known Issues

## Reading a Very Dense Encoders

### Issue

~~Rotating an **encoder** with a **large amount of pulses per revolution** causes the value to **increment erratically**.~~

~~Speed nor direction cannot be reliably controlled.~~

> #### Steps to reproduce
>
> ##### User Input
>
> - ~~Rotate a large encoder~~
>
> ##### Hardware
>
> - ~~Encoder with over a hundred pulses per revolution~~
> - ~~Raspberry Pi Zero W~~
> - ~~Multiple configured inputs (>20)~~

#### Analysis of cause

~~The behavior is consistent with either:~~
- ~~some pulses being missed or~~
- ~~there is noise in some pulse signal, causing the same pulse to be read twice~~

### Mitigation attempts

- ~~Implementing interrupts~~
	- ~~Did not work~~
	- ~~Code too slow to handle the flood of inputs~~
- ~~Spead up code with cython~~
	- ~~Did not work~~
	- ~~Internal diagnostics reports a faster cycle time, but the responsiveness hasn't improved~~
- ~~Code optimizations~~
	- ~~Did not work~~
	- ~~Seems that any "smart" way to streamline the reading or add filtering only deteriorates~~ the function further~~
- Using a `gpiozero`implementation for Encoders
	- Fixed the issue

### Notes

The design target has been to run everything on an inexpensive **Pi Zero W**. It has been noted, handling multiple inputs real time is problematic. ~~The polling rate of the current solution appears insufficient to reliably keep track of the rotary encoder.~~

Pi3 has demonstrated improved performance during development, in limited testing.

### Status

~~**To be tested: Will a Pi3 be sufficient to fix the issue in a full deployment setup.**~~

**Migrating to a new library implementation of encoders has fixed the problem.**

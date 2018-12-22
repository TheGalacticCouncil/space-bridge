# Space Bridge

**Why does this project exist?**

To allow playing the spaceship bridge simulator game [_EmptyEpsilon_ ](http://daid.github.io/EmptyEpsilon/) using custom built hardware consoles for controlling.

**What does it do?**

1. Reads inputs from the hardware consoles
2. Sends input data via LAN from the consoles to the players' computers
3. Sends HTTP requests based on input data to EmptyEpsilon's API
4. Uses EmptyEpsilon's state for hardware console effects during gameplay

NOTE: The project is still in an early phase, and no functionality is implemented at this time.

## CI

CI status per container

| Container | Status |
| --- | --- |
| Architecture |[![Build Status](https://travis-ci.com/TheGalacticCouncil/space-bridge.svg?branch=master)](https://travis-ci.com/TheGalacticCouncil/space-bridge)| 

# Space Bridge

**Why does this project exist?**

To allow playing the spaceship bridge simulator game [_EmptyEpsilon_ ](http://daid.github.io/EmptyEpsilon/) using custom built hardware consoles for controlling.

**What does it do?**

1. Reads inputs from the hardware consoles
2. Sends input data via LAN from the consoles to the players' computers
3. Sends HTTP requests based on input data to EmptyEpsilon's API
4. Uses EmptyEpsilon's state for hardware console effects during gameplay

**Progress**

A physical prototype for Weapons station has been created and play tested. The whole pipeline worked and the game was somewhat playable. No performance or latency issues were discovered. EmptyEpsilon's  HTTP API has been found to not support all actions required to play, so some additions to the HTTP API will be contributed.

**Next Milestones**

    -Expand HTTP API
    -Implement handling for more event types
    -Build consoles for other stations


## CI

CI status per container

| Container | Status |
| --- | --- |
| Architecture |[![Build Status](https://travis-ci.com/TheGalacticCouncil/space-bridge.svg?branch=master)](https://travis-ci.com/TheGalacticCouncil/space-bridge)| 

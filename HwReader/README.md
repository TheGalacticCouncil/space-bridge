# HwReader #

## What is It? ##

*HwReader* is a *Python3* program to read the status of hardware controls, in custom controller board. It uses ```RPi.GPIO```, ```RPi-MCP23017-Lite```, and ```gpiozero``` to read the inputs and package the inputs as control *events*. The *events* are broadcast as UDP packets.

## Features ##

**Supported control types:**
- Buttons (single acting)
- Switches (dual acting)
- Encoder Input (rotary encoders)
- Analog Inputs (potentiometers)

HwReader can be configured to accept virtually any combination of these input types. The inputs can be configured using the *config.yml* in the *HwReader's* root directory.

Input configuration is strongly linked to *events* configured for the system in *events.json*.


## Deployment ##

*HwReader* is designed to be run on **Raspberry Pi Zero W**, running **Raspian**, and connected to a custom control board. Depending on the number of inputs used, a number of **MCP23017** and/or **MCP3008** may be required. **HwReader** has built-in support for these chips.


## Pi Configuration ##

In order to function properly, **HwReader** needs the Pi to be configured to connect to the desired **(W)LAN**. Also, certain hardware features need to be enabled.

 1. run ```sudo raspi-config```
 2. select *interfaces*
 3. enable **I2C**, and **SSH***
 4. **SPI**
	 1. If you are using `MCP3008` ADC, without motorised slides - enable **SPI**
	 2. If you are using `MCP3008` with motorised slides
		 1. disable **SPI**
		 2. configure HardwareDriver
		 3. Configure analog inputs as [virtual inputs](#virtual-inputs)

 \*) *SSH is required, if you plan on controlling the Pi, without connecting a display and keyboard directly to it.*


## Installing HwReader ##

*Presently **Git** is all but required in the installation process, so reasonable first step is to install it.*

 0. Install Git
    - ```apt-get install git```
 1. Download HwReader
    - At precent, you can download HwReader only from git. As you have *Git* installed, it is easiest to use git to download HwReader
    1. Go to a folder where you whant to install **HwReader**
    2. ```git clone https://github.com/TheGalacticCouncil/space-bridge.git```
 2. Install HwReader
    - Run ```./setup.sh``` in **HwReader** folder. You may need to use ```sudo```
    - After installation, assuming no critical errors were raised, you can proceed to *configuring HwReader*.

### Troubleshooting Install: ###
Install installs an up to date version of *Python3* as well as several Python libraries. In case of problems, you can check if *Python3* was installed correctly, by running a command: ```$ python3 --version```.

This should return the version of the *Python3* installed. It should look like this ```Python 3.X.X```.
If *Python3* was not found, you can install it manually: ```sudo apt-get instal python3```

After *Python3* is installed, you can re-run ```./setup.sh```


## Configuring HwReader ##

Inputs for *HwReader* are configured with *config.yml*. There are (going to be) a number of pre-made configs for example boards. Example configs are found under **HwReader/config_examples**.

You can *copy-paste* a relevant config to */HwReader* folder and rename it as *config.yml*. If your board is identical to our examples, all you need to do is check the *general configuration* section in the config.yml.


### General Configuration ###

The general config is used to define the

|  | default |  |
| ---- | :--: | ---- |
| Poller **cycle time** | `0.001` | Minimum allowed poller cycle time. Setting this to zero will allow the poller to use all the available CPU time. This may disrupt other processes. |
| Station **name** |  | Sets the role of the controller. Valid roles are <br>`WEAPONS`, `ENGINEER`, `HELM` or `SCIENCE` |
| **Broadecast IP** | `192.168.1.255` | The broadcast address used for **UDP** packets.<br>Usual format is `192.168.xxx.255`. Edit to match your network subnet. |
|  **port** | `41114` | Port number used for **UDP** packets. Make sure it matches the other components used. |

```yaml
General:
  type: config            # config
  cycle: 0.001            # Recommended 0.001
  station: WEAPONS        # HELM, ENGINEERING, SCIENCE
  udp_ip: 192.168.1.255
  udp_port: 41114
```

### Input Configuration ###

If you choose to build a control board different from ours, you'll have to configure your inputs yourself.

|  | Button or<br>Switch | Encoder | Analog input | Example | Notes |
| :--: | :--: | :--: | :--: | :--: | ---- |
| unique name | ***x*** | ***x*** | ***x*** | `FireButton0` | **Every input must have a unique name,** <br>e.g. `FireButton02`. |
| `event` | ***x*** | ***x*** | ***x*** | `FIRE_TUBE` | Must match a valid event type from [events.json](https://github.com/TheGalacticCouncil/space-bridge/blob/master/EventMonitor/events.json) |
| `type` | ***x*** | ***x*** | ***x*** | `push-button` | Input type (`push_button`, `switch`, `encoder` or `analog`)<br>This must match the physical component used |
| `pin` | ***x*** |  |  | `14` | Valid for `push_button` and `switch`. This is the *BCM* type **GPIO** pin number the `push_button` or `switch` is connected to on the PI |
| `clk` |  | ***x*** |  | `27` | **Clock** pin for an encoder |
| `dt` |  | ***x*** |  | `22` | **DT** pin for an encoder |
| `channel` |  |  | ***x*** | `7` | Pin on MCP3008 ADC `[0...7]` *or*<br>Virtual input `[10...inf]` *( see [virtual inputs](#virtual-inputs) )* |
| `invert` | ***x*** |  |  | `True` | If the behaviour of a button or switch is reversed, set `invert` to `True` or `False` |
| `step` |  | ***x*** |  | `1` | Defines how much the *value* changes per tick<br>Default `1` (see [steps](#steps)) |
| `threshold` |  |  | ***x*** | `0.1` | Minimum change in raw value to trigger a new event. Default: `0.1` |
| `max_clip` |  |  | ***x*** | `0.98` | Define the input value interpreted as 100%<br>For direct inputs typically: `0.90`..`1.0` |
| `min_clip` |  |  | ***x*** | `0.02` | Define the input value interpreted as 0%<br>For direct inputs typically: `0.0`..`0.10` |
| `trigger` |  |  | ***x*** | `0` | Used to create a conditional input, such as a touch sensitive input.<br>Defines the **input pin** that must be activated, before triggering any event<br>If ```trigger``` is not used, set to zero ```0``` |
| `value` | ***x*** |  |  | `value: tubeId: 0` | Value sent as the payload for the event.<br>For event `FIRE_TUBE` it is `tubeId: N`, where `N` is the tube number. See [events.json](https://github.com/TheGalacticCouncil/space-bridge/blob/master/EventMonitor/events.json) for complete list of events and values. |
**See [events.json](https://github.com/TheGalacticCouncil/space-bridge/blob/master/EventMonitor/events.json) for the complete list of valid and supported events.**

### Sample Configs ###

```yaml
FireButton0:
  event: FIRE_TUBE
  type: push_button
  pin: 100
  invert: True
  value:
    tubeId: 0
```
*Simple button attached to external GPIO expansion*

```yaml
SwitchShields:
  event: SHIELDS_UP
  event2: SHIELDS_DOWN
  type: switch
  pin: 16
  invert: True
```
*Switch, with events for both positions*

```yaml
TargetEncoder0b:
  event: TARGET_NEXT_ENEMY
  event2: TARGET_PREVIOUS_ENEMY
  type: encoder
  clk: 27
  dt: 22
  step: -10 # optional
  wrap: False
```
*Encoder configured for incremental events, triggered every 10th click'*

```yaml
AnalogWeaponPower:
  event: SET_BEAM_WEAPONS_POWER
  type: analog
  channel: 12
  threshold: 0.1
  min_clip: 0
  max_clip: 1023
  min: 0
  max: 300
  trigger: 0
```
*Analog input configured with virtual input 0..1023 and output values ranging 0 to 300*

See more [config examples](https://github.com/TheGalacticCouncil/space-bridge/tree/hwreader-engineer-update/HwReader/config_examples)


### Syntax ###
Syntax is standard [yaml syntax](https://en.wikipedia.org/wiki/YAML#Syntax).
Each parameter for an input should be indented by two spaces.

### Name ###
Each input ***must have a unique name***. Eg. ```FireButton0:```

### Events
   - For an *input event* to be crated, the *input* must have at least one *event* linked to it.
   - The events are defined in the *events.json* and are linked to **EmptyEpsilon** API

### Input Types
   - ```push_button``` (for buttons and switches that give a singnal only when activated)
   - ```switch``` (for buttons and switches that give a signal when activated and when deactivated)
   - ```encoder``` (for mechanical or optical (rotary) encoders, that count clicks and recodnise the direction it is turned)
   - ```analog``` (for potentiometers. Gives a smooth input from minimum value to maximum)

   `pin`, `clk` and `dt` are the *BCM* type pin number on the **Pi**, or GPIO pin number on expansion board, while `channel` is the input pin number on the **MCP3008 ADC**.

### Steps
- Defines how much the *value* changes per tick (default `1`)
	- Step: `5`  would increment the value by 5 for every click.
- Negative step can be used to reduce sensitivity.
	- `-10` means that the value increments by 1 every 10th click
### Virtual Inputs

When using **HwDriver** to control motorised slides, virtual inputs should be used,to avoid conflict with **HwDriver**.

Virtual inputs use a file API. Input values are read from `"/tmp/mcp3008-touched-values-output.txt"`. Normal value range for virtual inputs managed by HwDriver is `[0...1023]`

Valid channels for virtual inputs are `[10..inf]`. Input numbers are in the order that they are defined in **HwDriver**

If HwDriver is not used, the input channels correspond to the input pins on **MCP3008**, `[0..7]`

## Issues ##

[Known Issues](https://github.com/TheGalacticCouncil/space-bridge/blob/master/HwReader/known-issues.md)

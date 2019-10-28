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

*HwReader* is designed to be run on **Raspberry Pi Zero W**, running **Raspian**, and connected to a custom control board. Depending on the number of inputs used, a number of **MCP23017** and/or **MCP3008** may be required. **HwReader** has built in support for these chips.


### Pi Configuration ###

In order to function properly, **HwReader** needs the Pi to be configured to connect to the desired **(W)LAN**. Also, certain hardware features need to be enabled.

 1. run ```sudo raspi-config```
 2. select *interfaces*
 3. enable **I2C**, **SPI** and **SSH***

 *) SSH is required, if you plan on controlling the Pi, without connecting a display and keyboard directly to it.


### Installing HwReader ###

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
    
#### Troubleshooting Install: ####
Install installs an up to date version of *Python3* as well as several Python libraries. In case of problems, you can check if *Python3* was installed correctly, by running a command: ```$ python3 --version```.

This should return the version of the *Python3* installed. It should look like this ```Python 3.X.X```. 
If *Python3* was not found, you can install it manually: ```sudo apt-get instal python3```

After *Python3* is installed, you can re-run ```./setup.sh```


## Configuring HwReader ##

Inputs for *HwReader* are configured with *config.yml*. There are (going to be) a number of pre-made configs for example boards. Example configs are found under **HwReader/config_examples**. 

You can *copy-paste* a relevant config to */HwReader* folder and rename it as *config.yml*. If your board is identical to our examples, all you need to do is check the *general configuration* section in the config.yml.


### General Configuration ###

The general config is used to define the
 - Poller **cycle time**
 - Station **name**
 - **Broadecast IP**
 - and communication **port**

```yaml
General:
  type: config            # config
  cycle: 0.001            # Recommended 0.001
  station: WEAPONS   # HELM, ENGINEERING, SCIENCE
  udp_ip: 192.168.1.255
  udp_port: 41114
```

#### Make sure: #### 
- the ```udp_ip:``` is in the same *IP space* as your **game***. This means the three **first sets of numbers** in the IP.
- ```station:``` is according to the role of the staion either:
   - ```WEAPONS```
   - ```ENGINEERING```
   - ```HELM```
   - or ```SCIENCE```

*) Simplification, but keep your setup simple.


### Input Configuration ###

If you choose to build a controll board different from ours, you'll have to configure your inputs your self.

```yaml
FireButton0:
  event: FIRE_TUBE
  type: push_button
  pin: 100
  invert: True
  value:
    tubeId: 0
```

#### Syntax ####

Each input must have a unique name. Eg. ```FireButton0:```
Each parameter for an input should be indented by two spaces.

1. Define the *event* linked to the input. 
   - For an *input event* to be crated, the *input* must have at least one *event* linked to it.
   - The events are defined in the *events.json* and are linked to **EmptyEpsilon** API
2. Define the type of an input:
   - ```push_button``` (for buttons and switches that give a singnal only when activated)
   - ```switch``` (for buttons and switches that give a signal when activated and when deactivated)
   - ```encoder``` (for mechanical or optical (rotary) encoders, that count clicks and recodnise the direction it is turned)
   - ```analog``` (for potentiometers. Gives a smooth input from minimum value to maximum)
3. Define where the input pin or pins are connected:
   - *pin* for ```push_button``` or ```switch```
   - *clk* and *dt* for ```encoder```
   - *channel* for ```analog```

   *pin*, *clk* and *dt* are the *BCM* type pin number on the **Pi**, or GPIO pin number on expansion board, while *channel* is the input pin number on the **MCP3008 ADC**.
   
4a. ```Invert```
   - Defined for *buttons* and *switches*. 
   - Normally ```invert``` is ```True```, when button is activated, by grounding the input pin. 
     If, however, the button activates, when the button is releaced, the function can be inverted, by changing this value to ```False```.

4b. ```step```
   - Defined for *encoders*
   - Defines how much the *value* changes per tick
   - 

# Empty Epsilon HTTP-api funktiot

Pyrkimyksenä on kerätä tähän dokumenttiin käytettävät funktiot esimerkkeineen per asema. 

Ainakin seuraavat funktiot toimivat

```
PlayerSpaceship:commandSetTarget(P<SpaceObject> target)
PlayerSpaceship:commandSetShields(bool enabled)
PlayerSpaceship:commandMainScreenSetting(EMainScreenSetting mainScreen)
PlayerSpaceship:commandMainScreenOverlay(EMainScreenOverlay mainScreen)
PlayerSpaceship:commandScan(P<SpaceObject> object)
PlayerSpaceship:commandSetSystemPowerRequest(ESystem system, float power_level)
PlayerSpaceship:commandSetSystemCoolantRequest(ESystem system, float coolant_level)
PlayerSpaceship:commandDock(P<SpaceObject> station)
PlayerSpaceship:commandUndock()
PlayerSpaceship:commandAbortDock()
PlayerSpaceship:commandOpenTextComm(P<SpaceObject> obj)
PlayerSpaceship:commandCloseTextComm()
PlayerSpaceship:commandAnswerCommHail(bool awnser)
PlayerSpaceship:commandSendComm(uint8_t index)
PlayerSpaceship:commandSendCommPlayer(string message)
PlayerSpaceship:commandSetAutoRepair(bool enabled)
PlayerSpaceship:commandSetBeamFrequency(int32_t frequency)
PlayerSpaceship:commandSetBeamSystemTarget(ESystem system)
PlayerSpaceship:commandSetShieldFrequency(int32_t frequency)
PlayerSpaceship:commandAddWaypoint(sf::Vector2f position)
PlayerSpaceship:commandRemoveWaypoint(int32_t index)
PlayerSpaceship:commandMoveWaypoint(int32_t index, sf::Vector2f position)
PlayerSpaceship:commandActivateSelfDestruct()
PlayerSpaceship:commandCancelSelfDestruct()
PlayerSpaceship:commandConfirmDestructCode(int8_t index, uint32_t code)
PlayerSpaceship:commandSetScienceLink(int32_t id)
```

## Helm 
```
// NOTE: APIssa 0 on oikealla, pelissä ylhäällä. 0-360
PlayerSpaceship:commandTargetRotation(float target)

// 1000 = 1U, HUOM: Ei tarkasta että arvo on aluksen sallimissa rajoissa 
PlayerSpaceship:commandJump(float distance) 

// min: -1.0 max: 1.0, muut arvot autom. rajoitetaan tuolle välille
PlayerSpaceship:commandImpulse(float target)

// NOTE: Peli ei rajoita apilla syötettyjä arvoja, anna max 4! 
PlayerSpaceship:commandWarp(int8_t target) 

// Peli ei rajoita, mutta 0.0 =< amount =< 1.0, y-koord
PlayerSpaceship:commandCombatManeuverBoost(float amount) 

// NOTE: Ei ole vielä käytettävissä, -1.0 =< amount =< 1.0, x-koord
PlayerSpaceship:commandCombatManeuverStrafe(float amount) 
```

Huomioita:  
- UI kontrollit warpille ja jumpille eivät päivity annettujen arvojen mukaan

## Weapons
|EMissileWeapons|
---
|Homing|
|Nuke|
|Mine|
|EMP|
|HVLI|

| ESystem |
---
|Hull|
|Reactor|
|beamweapons|
|Missilesystem|
|Maneuver|
|Impulse|
|Warp|
|Jumpdrive|
|Frontshield|
|Rearshield|

Note: Kirjasinkoolla ei ole väliä, string tulee laittaa api kutsussa tuplahipsuihin

```
PlayerSpaceship:commandLoadTube(int8_t tubeNumber, EMissileWeapons missileType)

// Note: Tuubit ovat aina 0-(N-1), missä n tuubien lkm
PlayerSpaceship:commandUnloadTube(int8_t tubeNumber)

PlayerSpaceship:getWeaponTubeCount() 

// angle 0-360, manuaalitähtäyksen suunta
PlayerSpaceship:commandFireTube(int8_t tubeNumber, float missile_target_angle) 

// Kalibroi kilvet suoraan annettuun arvoon
// 0-20, 0=400THz, 20=800THz
SpaceShip:commandSetShieldFrequency(int32_t freq)

// Shield frequency UI selection
SpaceShip:commandSetShieldFrequencySelection(int32_t freq)

// Select next shield frequency
SpaceShip:commandSetNextShieldFrequencySelection()

// Select previous shield frequency
SpaceShip:commandSetPreviousShieldFrequencySelection()

// Enable/disable shields
PlayerSpaceship:commandSetShields(bool enabled)

// 0-20, 0=400THz, 20=800THz
PlayerSpaceship:commandSetBeamFrequency(int32_t frequency)

PlayerSpaceship:commandSetBeamSystemTarget(ESystem system)

// Cycle through targets
PlayerSpaceship::commandNextTarget()
PlayerSpaceship::commandPreviousTarget()

// Calibrate shields to (previously) selected frequency
PlayerSpaceship::commandCalibrateShields()

// Set state of aim lock
PlayerSpaceship::commandSetAimLock(bool enabled)

// Set angle on manual aim (0-360)
PlayerSpaceship::commanSetAimAngle(float angle)

```

Huomioita:
- Tuubilla ammuttaess tulee aina antaa suunta. Peli laskee tämän maagisesti targetoitaessa vihollista, miten me hoidetaan asia?
ks. https://github.com/daid/EmptyEpsilon/pull/507
- Kilpien taajuusvalitsimen arvoa ei voi säätää, vaan kilvet kalibroidaan "suoraan"
- Beam target ja frequency EI päivity UI:n rendauksen jälkeen...
- Targetointi vaatii tuen lisäämisen EE:n puolelle.

## Engineer
| ESystem |
---
|Hull|
|Reactor|
|beamweapons|
|Missilesystem|
|Maneuver|
|Impulse|
|Warp|
|Jumpdrive|
|Frontshield|
|Rearshield|
```
// Hyväksyy mitä tahansa power_level arvoja, sallitut 0-3
PlayerSpaceship:commandSetSystemPowerRequest(ESystem system, float power_level)

// Hyväksyy mitä tahansa coolant_level arvoja, sallitut 0-100
PlayerSpaceship:commandSetSystemCoolantRequest(ESystem system, float coolant_level)

PlayerSpaceship:commandSetAutoRepair(bool enabled)

PlayerSpaceship:commandActivateSelfDestruct()
PlayerSpaceship:commandCancelSelfDestruct()

// Tämä tullaan korvaamaan custom funktiolla, joka vain aloittaa laskennan samantien.
PlayerSpaceship:commandConfirmDestructCode(int8_t index, uint32_t code)
```

Huomioita:
- power ja coolant sliderin paikka ei muutu, lukuarvo muuttuu
- Coolant ei balansoidu => mahdollista laittaa kaikkialle coolanttia!!
- Ei funktiota järjestelmän valitsemiselle.
- Self destructin aktivointi ei kysy konfirmaatiota

## Science
Huomioita:
- Lisää tai selvitä funktiot seuraaville
- Zoom
- UI-painikkeet
- Database navigation

## Relay
| EAlertLevel |
---
|normal|
|yellow|
|red|
```
PlayerSpaceship:commandSetAlertLevel(EAlertLevel level)
```
Huomioita:
- Lisää tai selvitä funktiot seuraaville
- Zoom
- UI-painikkeet

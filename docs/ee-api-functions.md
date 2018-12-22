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

// 0-20, 0=400THz, 20=800THz
SpaceShip:commandSetShieldFrequency(int32_t freq)

PlayerSpaceship:commandSetShields(bool enabled)

// 0-20, 0=400THz, 20=800THz
PlayerSpaceship:commandSetBeamFrequency(int32_t frequency)

PlayerSpaceship:commandSetBeamSystemTarget(ESystem system)
```

Huomioita:
- Tuubilla ammuttaess tulee aina antaa suunta. Peli laskee tämän maagisesti targetoitaessa vihollista, miten me hoidetaan asia?
- Kilpien taajuusvalitsimen arvoa ei voi säätää, vaan kilvet kalibroidaan "suoraan"
- Beam target ja frequency EI päivity UI:n rendauksen jälkeen...
- Targetointi vaatii tuen lisäämisen EE:n puolelle.

## Engineer

## Science

## Relay

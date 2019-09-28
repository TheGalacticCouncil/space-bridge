import IGetRequest from "./models/IGetRequest";
import IPostRequest from "./models/IPostRequest";

const GET = "get";
const POST = "post";

export const setReactorPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Reactor, ${powerLevel})`
});

export const setBeamWeaponsPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Beamweapons, ${powerLevel})`
});

export const setMissileSystemPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Missilesystem, ${powerLevel})`
});

export const setManeuveringPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Maneuver, ${powerLevel})`
});

export const setImpulseEnginePower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Impulse, ${powerLevel})`
});

export const setJumpDrivePower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Jumpdrive, ${powerLevel})`
});

export const setWarpDrivePower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Warp, ${powerLevel})`
});

export const setFrontShieldPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Frontshield, ${powerLevel})`
});

export const setRearShieldPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Rearshield, ${powerLevel})`
});

export const setReactorCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Reactor, ${coolantLevel})`
});

export const setBeamWeaponsCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Beamweapons, ${coolantLevel})`
});

export const setMissileSystemCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Missilesystem, ${coolantLevel})`
});

export const setManeuveringCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Maneuver, ${coolantLevel})`
});

export const setImpulseEngineCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Impulse, ${coolantLevel})`
});

export const setJumpDriveCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Jumpdrive, ${coolantLevel})`
});

export const setWarpDriveCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Warp, ${coolantLevel})`
});

export const setFrontShieldCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Frontshield, ${coolantLevel})`
});

export const setRearShieldCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua=commandSetSystemPowerRequest(Rearshield, ${coolantLevel})`
});

export const loadTube = (tubeId: number, ammoType: string): IGetRequest => ({
  method: GET,
  path: `set.lua?commandLoadTube(${tubeId}, "${ammoType}")`
});

export const unloadTube = (tubeId: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandUnloadTube(${tubeId})`
});

export const fireTube = (tubeId: number): IPostRequest => ({
  method: POST,
  path: "exec.lua",
  body: `
        us = getPlayerShip(-1)
        target = us:getTarget()
        if target == nil then
          us:commandFireTube(${tubeId}, 0)
        else
          us:commandFireTubeAtTarget(${tubeId}, target)
        end`
});

export const setBeamTarget = (target: string): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetBeamSystemTarget(${target})`
});

export const setBeamFrequency = (frequency: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetBeamFrequency(${frequency})`
});

export const setShieldFrequency = (frequency: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetShieldFrequencySelection(${frequency})`
});

export const increaseShieldFrequency = () => ({
  method: GET,
  path: `set.lua?commandSetNextShieldFrequencySelection()`
});

export const decreaseShieldFrequency = () => ({
  method: GET,
  path: `set.lua?commandSetPreviousShieldFrequencySelection()`
});

export const calibrateShields = (frequency: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetShieldFrequency(${frequency})`
});

export const shieldsUp = () => ({
  method: GET,
  path: "set.lua?commandSetShields(true)"
});

export const shieldsDown = () => ({
  method: GET,
  path: "set.lua?commandSetShields(false)"
});

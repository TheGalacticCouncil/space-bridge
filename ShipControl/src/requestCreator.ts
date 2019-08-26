import _ from "lodash";

let request = {
  method: "",
  body: "",
  path: ""
};


export function setReactorPower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Reactor, ${powerLevel})`;
  return request;
}

export function setBeamWeaponsPower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Beamweapons, ${powerLevel})`;
  return request;
}

export function setMissileSystemPower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Missilesystem, ${powerLevel})`;
  return request;
}

export function setManeuveringPower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Maneuver, ${powerLevel})`;
  return request;
}

export function setImpulseEnginePower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Impulse, ${powerLevel})`;
  return request;
}

export function setJumpDrivePower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Jumpdrive, ${powerLevel})`;
  return request;
}

export function setWarpDrivePower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Warp, ${powerLevel})`;
  return request;
}

export function setFrontShieldPower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Frontshield, ${powerLevel})`;
  return request;
}

export function setRearShieldPower(powerLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Rearshield, ${powerLevel})`;
  return request;
}

export function setReactorCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Reactor, ${coolantLevel})`;
  return request;
}

export function setBeamWeaponsCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Beamweapons, ${coolantLevel})`;
  return request;
}

export function setMissileSystemCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Missilesystem, ${coolantLevel})`;
  return request;
}

export function setManeuveringCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Maneuver, ${coolantLevel})`;
  return request;
}

export function setImpulseEngineCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Impulse, ${coolantLevel})`;
  return request;
}

export function setJumpDriveCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Jumpdrive, ${coolantLevel})`;
  return request;
}

export function setWarpDriveCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Warp, ${coolantLevel})`;
  return request;
}

export function setFrontShieldCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Frontshield, ${coolantLevel})`;
  return request;
}

export function setRearShieldCoolant(coolantLevel: number) {
  request.method = "get";
  request.path = `set.lua=commandSetSystemPowerRequest(Rearshield, ${coolantLevel})`;
  return request;
}

export function loadTube(tubeId: number, ammoType: string) {

  request.method = "get";
  request.path = `set.lua?commandLoadTube(${tubeId}, "${ammoType}")`;
  return request;
}

export function unloadTube(tubeId: number) {

  request.method = "get";
  request.path = `set.lua?commandUnloadTube(${tubeId})`;
  return request;
}

export function fireTube(tubeId: number) {
  request.method = "post";
  request.path = "exec.lua";
  request.body = `
        us = getPlayerShip(-1)
        target = us:getTarget()
        if target == nil then
          us:commandFireTube(${tubeId}, 0)
        else
          us:commandFireTubeAtTarget(${tubeId}, target)
        end`;
  return request;
}

export function setBeamTarget(target: string) {
  request.method = "get";
  request.path = `set.lua?commandSetBeamSystemTarget(${target})`;
  return request;
}

export function setBeamFrequency(frequency: number) {
  request.method = "get";
  request.path = `set.lua?commandSetBeamFrequency(${frequency})`;
  return request;
}

export function setShieldFrequency(frequency: number) {
  request.method = "get";
  request.path = `set.lua?commandSetShieldFrequencySelection(${frequency})`;
  return request;
}

export function increaseShieldFrequency() {
  request.method = "get";
  request.path = `set.lua?commandSetNextShieldFrequencySelection()`;
  return request;
}

export function decreaseShieldFrequency() {
  request.method = "get";
  request.path = `set.lua?commandSetPreviousShieldFrequencySelection()`;
  return request;
}

export function calibrateShields(frequency: number) {
  request.method = "get";
  request.path = `set.lua?commandSetShieldFrequency(${frequency})`;
  return request;
}

export function shieldsUp() {
  request.method = "get";
  request.path = "set.lua?commandSetShields(true)";
  return request;
}

export function shieldsDown() {
  request.method = "get";
  request.path = "set.lua?commandSetShields(false)";
  return request;
}

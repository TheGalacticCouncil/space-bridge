import EAmmoType from "./models/EAmmoType";
import ESystem from "./models/ESystem";
import IBeamTarget from "./models/IBeamTarget";
import IGetRequest from "./models/IGetRequest";
import IPostRequest from "./models/IPostRequest";

const GET = "get";
const POST = "post";

export const selectReactor = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.REACTOR}")`
});

export const selectBeamWeapons = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.BEAM_WEAPONS}")`
});

export const selectMissileSystem = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.MISSILE_SYSTEM}")`
});

export const selectManeuvering = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.MANEUVERING}")`
});

export const selectImpulseEngine = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.IMPULSE_ENGINES}")`
});

export const selectJumpDrive = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.JUMP_DRIVE}")`
});

export const selectWarpDrive = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.WARP_DRIVE}")`
});

export const selectFrontShield = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.FRONT_SHIELD_GENERATOR}")`
});

export const selectRearShield = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSelectSystem("${ESystem.REAR_SHIELD_GENERATOR}")`
});

export const setReactorPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.REACTOR}", ${powerLevel})`
});

export const setBeamWeaponsPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.BEAM_WEAPONS}", ${powerLevel})`
});

export const setMissileSystemPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.MISSILE_SYSTEM}", ${powerLevel})`
});

export const setManeuveringPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.MANEUVERING}", ${powerLevel})`
});

export const setImpulseEnginePower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.IMPULSE_ENGINES}", ${powerLevel})`
});

export const setJumpDrivePower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.JUMP_DRIVE}", ${powerLevel})`
});

export const setWarpDrivePower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.WARP_DRIVE}", ${powerLevel})`
});

export const setFrontShieldPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.FRONT_SHIELD_GENERATOR}", ${powerLevel})`
});

export const setRearShieldPower = (powerLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemPowerRequest("${ESystem.REAR_SHIELD_GENERATOR}", ${powerLevel})`
});

export const setReactorCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.REACTOR}", ${coolantLevel  / 10})`
});

export const setBeamWeaponsCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.BEAM_WEAPONS}", ${coolantLevel  / 10})`
});

export const setMissileSystemCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.MISSILE_SYSTEM}", ${coolantLevel  / 10})`
});

export const setManeuveringCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.MANEUVERING}", ${coolantLevel  / 10})`
});

export const setImpulseEngineCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.IMPULSE_ENGINES}", ${coolantLevel / 10})`
});

export const setJumpDriveCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.JUMP_DRIVE}", ${coolantLevel  / 10})`
});

export const setWarpDriveCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.WARP_DRIVE}", ${coolantLevel  / 10})`
});

export const setFrontShieldCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.FRONT_SHIELD_GENERATOR}",${coolantLevel  / 10})`
});

export const setRearShieldCoolant = (coolantLevel: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetSystemCoolantRequest("${ESystem.REAR_SHIELD_GENERATOR}", ${coolantLevel  / 10})`
});

export const selectAmmoType = (ammoType: EAmmoType): IGetRequest => {

  const ammo = EAmmoType[`${ammoType}`];

  return {
    method: GET,
    path: `set.lua?commandSelectWeapon("${ammo}")`
  };

};

export const loadTube = (tubeId: number, ammoType: string): IGetRequest => ({
  method: GET,
  path: `set.lua?commandLoadTube(${tubeId}, "${ammoType}")`
});

export const unloadTube = (tubeId: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandUnloadTube(${tubeId})`
});

export const fireTube = (tubeId: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandFireTubeAtCurrentTarget(${tubeId})`,
});

export const setBeamTarget = (target: IBeamTarget): IGetRequest => ({
    method: GET,
    path: `set.lua?commandSetBeamSystemTarget("${target}")`
});

export const setBeamFrequency = (frequency: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetBeamFrequency(${frequency})`
});

export const setShieldFrequency = (frequency: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetShieldFrequencySelection(${frequency})`
});

export const increaseShieldFrequency = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetNextShieldFrequencySelection()`
});

export const decreaseShieldFrequency = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetPreviousShieldFrequencySelection()`
});

export const calibrateShields = (): IGetRequest => ({
  method: GET,
  path: `set.lua?commandCalibrateShields()`
});

export const shieldsUp = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandSetShields(true)"
});

export const shieldsDown = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandSetShields(false)"
});

export const nextTarget = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandNextTarget()"
});

export const previousTarget = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandPreviousTarget()"
});

export const setAimLock = (enabled: boolean): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetAimLock(${enabled})`
});

export const setAimAngle = (angle: number): IGetRequest => ({
  method: GET,
  path: `set.lua?commandSetAimAngle(${angle})`
});

export const startRepair = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandSetAutoRepair(true)"
});

export const stopRepair = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandSetAutoRepair(false)"
});

export const activateSelfDestruct = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandActivateSelfDestruct()"
});

export const cancelSelfDestruct = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandCancelSelfDestruct()"
});

export const confirmSelfDestruct = (): IGetRequest => ({
  method: GET,
  path: "set.lua?commandConfirmSelfDestruct()"
});

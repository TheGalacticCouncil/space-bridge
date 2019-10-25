import _ from "lodash";

import EAmmoType from "./models/EAmmoType";
import EStation from "./models/EStation";
import ESystem from "./models/ESystem";
import IBeamTarget from "./models/IBeamTarget";
import IRequest from "./models/IRequest";
import * as requestCreator from "./requestCreator";

const config: any = require("../config.json");

export class EventHandler {

        beamTarget: IBeamTarget;
        beamFrequency: number;
        selectedAmmoType: EAmmoType;
        stations: EStation[];
        selfDestructActive: boolean;
        selfDestructConfirmations: object;

    constructor() {
        this.beamTarget = "HULL";
        this.beamFrequency = 0;
        this.selectedAmmoType = EAmmoType.NONE;
        this.stations = config.consoles;
        this.selfDestructActive = false;
        this.selfDestructConfirmations = {};

        this.initializeSelfDestructConfirmations();
    }

    initializeSelfDestructConfirmations(): {} {
        _.forEach(this.stations, (station) => {
            this.selfDestructConfirmations[station] = false;
        });

        return this.selfDestructConfirmations;
    }

    selectAmmoType(newAmmoType: EAmmoType) {
        return this.selectedAmmoType = newAmmoType;
    }

    increaseBeamFrequency() {
        if (this.beamFrequency < 20) {
            return this.beamFrequency++;
        }

        return this.beamFrequency = 20;
    }

    decreaseBeamFrequency() {
        if (this.beamFrequency > 0) {
            return this.beamFrequency--;
        }

        return this.beamFrequency = 0;
    }

    setBeamFrequency(newFrequency: number) {
        if (newFrequency > 20) {
            return this.beamFrequency = 20;
        } else if (newFrequency < 0) {
            return this.beamFrequency = 0;
        } else {
            return this.beamFrequency = newFrequency;
        }
    }

    setBeamTarget(newTarget: IBeamTarget) {
        return this.beamTarget = newTarget;
    }

    nextBeamTarget() {
        switch (this.beamTarget) {
            case "HULL":
                return this.beamTarget = ESystem.REACTOR;
            case ESystem.REACTOR:
                return this.beamTarget = ESystem.MISSILE_SYSTEM;
            case ESystem.MISSILE_SYSTEM:
                return this.beamTarget = ESystem.MANEUVERING;
            case ESystem.MANEUVERING:
                return this.beamTarget = ESystem.IMPULSE_ENGINES;
            case ESystem.IMPULSE_ENGINES:
                return this.beamTarget = ESystem.WARP_DRIVE;
            case ESystem.WARP_DRIVE:
                return this.beamTarget = ESystem.JUMP_DRIVE;
            case ESystem.JUMP_DRIVE:
                return this.beamTarget = ESystem.FRONT_SHIELD_GENERATOR;
            case ESystem.FRONT_SHIELD_GENERATOR:
                return this.beamTarget = ESystem.REAR_SHIELD_GENERATOR;
            case ESystem.REAR_SHIELD_GENERATOR:
            default:
                return this.beamTarget = "HULL";
        }
    }

    activateSelfDestruct(message: any): IRequest[] {

        const station: EStation = message.station;

        if (station === EStation.ENGINEER) {
            this.selfDestructActive = true;
            this.selfDestructConfirmations[EStation.ENGINEER] = true;
            return [requestCreator.activateSelfDestruct()];
        }

        return [];
    }

    confirmSelfDestruct(message: any): IRequest[] {

        const station: EStation = message.station;

        if (_.includes(this.stations, station)) {

            if (this.selfDestructActive) {

                this.selfDestructConfirmations[station] = true;

                const allStationsConfirmed = _.every(this.selfDestructConfirmations, (stationConfirmed) => {
                    return stationConfirmed;
                });

                if (allStationsConfirmed) {
                    return [requestCreator.confirmSelfDestruct()];
                }
            }
        }

        return [];
    }

    revokeSelfDestruct(message: any): boolean {

        const station: EStation = message.station;

        if (_.includes(this.stations, station)) {

            this.selfDestructConfirmations[station] = false;
            return true;
        }

        return false;
    }

    cancelSelfDestruct(message: any): IRequest[] {

        const station: EStation = message.station;

        if (station === EStation.ENGINEER) {

            this.selfDestructActive = false;
            this.initializeSelfDestructConfirmations();

            return [requestCreator.cancelSelfDestruct()];
        }

        return [];
    }

    public handleEvent(message: any): IRequest[] {

        console.log(`Event of type ${message.event} received from ${message.station}`);

        switch (message.event) {
            // case "SET_THROTTLE":
            //     console.log("SET_THROTTLE:", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SET_JUMP":
            //     console.log("SET_JUMP: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SET_WARP":
            //     console.log("SET_WARP: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SET_HEADING":
            //     console.log("SET_HEADING: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SET_COMBAT_MANOUVER":
            //     console.log("SET_COMBAT_MANOUVER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "ACTIVATE_JUMP":
            //     console.log("ACTIVATE_JUMP: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "REQUEST_DOCK":
            //     console.log("REQUEST_DOCK: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "UNDOCK":
            //     console.log("UNDOCK: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SELECT_SUBSYSTEM": // THIS EVENT IS NOT USED
            // return [requestCreator.selectSubsystem(message.payload.value)];

            case "SELECT_REACTOR":
                return [requestCreator.selectReactor()];

            case "SELECT_BEAM_WEAPONS":
                return [requestCreator.selectBeamWeapons()];

            case "SELECT_MISSILE_SYSTEM":
                return [requestCreator.selectMissileSystem()];

            case "SELECT_MANEUVERING":
                return [requestCreator.selectManeuvering()];

            case "SELECT_IMPULSE_ENGINES":
                return [requestCreator.selectImpulseEngine()];

            case "SELECT_JUMP_DRIVE":
                return [requestCreator.selectJumpDrive()];

            case "SELECT_WARP_DRIVE":
                return [requestCreator.selectWarpDrive()];

            case "SELECT_FRONT_SHIELD_GENERATOR":
                return [requestCreator.selectFrontShield()];

            case "SELECT_REAR_SHIELD_GENERATOR":
                return [requestCreator.selectRearShield()];

            // case "SET_SUBSYSTEM_POWER": // THIS EVENT IS NOT USED
            //     console.log("SET_SUBSYSTEM_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            case "SET_REACTOR_POWER":
                return [requestCreator.setReactorPower(message.payload.value)];

            case "SET_BEAM_WEAPONS_POWER":
                return [requestCreator.setBeamWeaponsPower(message.payload.value)];

            case "SET_MISSILE_SYSTEM_POWER":
                return [requestCreator.setMissileSystemPower(message.payload.value)];

            case "SET_MANEUVERING_POWER":
                return [requestCreator.setManeuveringPower(message.payload.value)];

            case "SET_IMPULSE_ENGINES_POWER":
                return [requestCreator.setImpulseEnginePower(message.payload.value)];

            case "SET_JUMP_DRIVE_POWER":
                return [requestCreator.setJumpDrivePower(message.payload.value)];

            case "SET_WARP_DRIVE_POWER":
                return [requestCreator.setWarpDrivePower(message.payload.value)];

            case "SET_FRONT_SHIELD_GENERATOR_POWER":
                return [requestCreator.setFrontShieldPower(message.payload.value)];

            case "SET_REAR_SHIELD_GENERATOR_POWER":
                return [requestCreator.setRearShieldPower(message.payload.value)];

            // case "SET_SUBSYSTEM_COOLANT": // THIS EVENT IS NOT USED
            //     console.log("SET_SUBSYSTEM_COOLANT", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            case "SET_REACTOR_COOLANT":
                return [requestCreator.setReactorCoolant(message.payload.value)];

            case "SET_BEAM_WEAPONS_COOLANT":
                return [requestCreator.setBeamWeaponsCoolant(message.payload.value)];

            case "SET_MISSILE_SYSTEM_COOLANT":
                return [requestCreator.setMissileSystemCoolant(message.payload.value)];

            case "SET_MANEUVERING_COOLANT":
                return [requestCreator.setManeuveringCoolant(message.payload.value)];

            case "SET_IMPULSE_ENGINES_COOLANT":
                return [requestCreator.setImpulseEngineCoolant(message.payload.value)];

            case "SET_JUMP_DRIVE_COOLANT":
                return [requestCreator.setJumpDriveCoolant(message.payload.value)];

            case "SET_WARP_DRIVE_COOLANT":
                return [requestCreator.setWarpDriveCoolant(message.payload.value)];

            case "SET_FRONT_SHIELD_GENERATOR_COOLANT":
                return [requestCreator.setFrontShieldCoolant(message.payload.value)];

            case "SET_REAR_SHIELD_GENERATOR_COOLANT":
                return [requestCreator.setRearShieldCoolant(message.payload.value)];

            case "REPAIR":
                return [
                    requestCreator.startRepair(),
                    requestCreator.stopRepair()
                ];

            case "ACTIVATE_SELF_DESTRUCT":
                return this.activateSelfDestruct(message);

            case "CANCEL_SELF_DESTRUCT":
                return this.cancelSelfDestruct(message);

            case "CONFIRM_SELF_DESTRUCT":
                return this.confirmSelfDestruct(message);

            case "REVOKE_CONFIRM_SELF_DESTRUCT":
                this.revokeSelfDestruct(message);
                return [];

            // case "SET_ZOOM_LEVEL":
            //     console.log("SET_ZOOM_LEVEL: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "CLEAR_ALERT":
            //     console.log("CLEAR_ALERT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "YELLOW_ALERT":
            //     console.log("YELLOW_ALERT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "RED_ALERT":
            //     console.log("RED_ALERT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "PREPARE_PROBE_LAUNCH":
            //     console.log("PREPARE_PROBE_LAUNCH: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "LAUNCH_PROBE":
            //     console.log("LAUNCH_PROBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;



            case "SELECT_WEAPON":
                return [requestCreator.selectAmmoType(message.payload.value)];

            case "LOAD_TUBE":
                if (_.has(message.payload, "weapon")) {
                    this.selectAmmoType(message.payload.weapon);
                }
                return [requestCreator.loadTube(message.payload.tubeId, this.selectedAmmoType)];

            case "LOAD_OR_UNLOAD_TUBE":
                if (_.has(message.payload, "weapon")) {
                    this.selectAmmoType(message.payload.weapon);
                }

                return [
                    requestCreator.loadTube(message.payload.tubeId, this.selectedAmmoType),
                    requestCreator.unloadTube(message.payload.tubeId)
                ];

            case "FIRE_TUBE":
                return [requestCreator.fireTube(message.payload.tubeId)];

            case "UNLOAD_TUBE":
                return [requestCreator.unloadTube(message.payload.tubeId)];

            case "TARGET_NEXT_ENEMY":
                return [requestCreator.nextTarget()];

            case "TARGET_PREVIOUS_ENEMY":
                return [requestCreator.previousTarget()];

            case "SET_BEAM_TARGET":
                this.setBeamTarget(message.payload.value);
                return [requestCreator.setBeamTarget(message.payload.value)];

            case "NEXT_BEAM_TARGET":
                this.nextBeamTarget();
                return [requestCreator.setBeamTarget(this.beamTarget)];

            case "SET_BEAM_FREQUENCY":
                return [requestCreator.setBeamFrequency(message.payload.value)];

            case "NEXT_BEAM_FREQUENCY":
                this.increaseBeamFrequency();
                return [requestCreator.setBeamFrequency(this.beamFrequency)];

            case "PREVIOUS_BEAM_FREQUENCY":
                this.decreaseBeamFrequency();
                return [requestCreator.setBeamFrequency(this.beamFrequency)];

            case "SET_SHIELD_FREQUENCY":
                return [requestCreator.setShieldFrequency(message.payload.value)];

            case "NEXT_SHIELD_FREQUENCY":
                return [requestCreator.increaseShieldFrequency()];

            case "PREVIOUS_SHIELD_FREQUENCY":
                return [requestCreator.decreaseShieldFrequency()];

            case "CALIBRATE_SHIELDS":
                return [requestCreator.calibrateShields()];

            case "SHIELDS_UP":
                return [requestCreator.shieldsUp()];

            case "SHIELDS_DOWN":
                return [requestCreator.shieldsDown()];

            case "MANUAL_TARGETING":
                return [requestCreator.setAimLock(false)];

            case "AUTOMATIC_TARGETING":
                return [requestCreator.setAimLock(true)];

            case "MISSILE_TARGET_ANGLE":
                return [requestCreator.setAimAngle(message.payload.value)];
            // case "PREPARE_WAYPOINT_PLACEMENT":
            //     console.log("PREPARE_WAYPOINT_PLACEMENT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "PLACE_WAYPOINT":
            //     console.log("PLACE_WAYPOINT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SELECT_PROBE":
            //     console.log("SELECT_PROBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SELECT_WAYPOINT":
            //     console.log("SELECT_WAYPOINT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "DELETE_SELECTED_WAYPOINT":
            //     console.log("DELETE_SELECTED_WAYPOINT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "LINK_SELECTED_PROBE":
            //     console.log("LINK_SELECTED_PROBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "UNLINK_SELECTED_PROBE":
            //     console.log("UNLINK_SELECTED_PROBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "UNLINK_PROBE":
            //     console.log("UNLINK_PROBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "OPEN_COMMS_TO_SELECTED":
            //     console.log("OPEN_COMMS_TO_SELECTED: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "CANCEL_OPENING_COMMS":
            //     console.log("CANCEL_OPENING_COMMS: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "CLOSE_COMMS":
            //     console.log("CLOSE_COMMS: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "OPEN_COMMS_LOG":
            //     console.log("OPEN_COMMS_LOG: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "START_HACKING":
            //     console.log("START_HACKING: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "STOP_HACKING":
            //     console.log("STOP_HACKING: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "ACTIVATE_PROBE_VIEW":
            //     console.log("ACTIVATE_PROBE_VIEW: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "DEACTIVATE_PROBE_VIEW":
            //     console.log("DEACTIVATE_PROBE_VIEW: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "ACTIVATE_RADAR_VIEW":
            //     console.log("ACTIVATE_RADAR_VIEW: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "ACTIVATE_DATABASE_VIEW":
            //     console.log("ACTIVATE_DATABASE_VIEW: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "PAUSE":
            //     console.log("PAUSE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "UNPAUSE":
            //     console.log("UNPAUSE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "TARGET_NEXT_SPACE_OBJECT":
            //     console.log("TARGET_NEXT_SPACE_OBJECT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "TARGET_PREVIOUS_SPACE_OBJECT":
            //     console.log("TARGET_PREVIOUS_SPACE_OBJECT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SCAN":
            //     console.log("SCAN: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SCAN_SLIDER_1":
            //     console.log("SCAN_SLIDER_1: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SCAN_SLIDER_2":
            //     console.log("SCAN_SLIDER_2: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SCAN_SLIDER_3":
            //     console.log("SCAN_SLIDER_3: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SHOW_SYSTEMS":
            //     console.log("SHOW_SYSTEMS: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SHOW_TACTICAL":
            //     console.log("SHOW_TACTICAL: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            default:
                throw (new Error("Event type not recognized."));
        }
    }
}

export default EventHandler;

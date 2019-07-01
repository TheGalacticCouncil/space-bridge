import _ from "lodash";

import * as requestCreators from "./requestCreators";

const NOT_SELECTED = "NOT_SELECTED";

export class EventHandler {
    beamTarget: string;
    beamFrequency: number;
    selectedAmmoType: string;
    constructor() {
        this.beamTarget = "HULL";
        this.selectedAmmoType = NOT_SELECTED;
    }

    selectAmmoType(newAmmoType: string) {
        return this.selectedAmmoType = newAmmoType;
    }

   increaseBeamFrequency() {
        return this.beamFrequency++;
    }

    decreaseBeamFrequency() {
        return this.beamFrequency--;
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

    setBeamTarget(newTarget: string) {
        return this.beamTarget = newTarget;
    }

    nextBeamTarget() {
        switch (this.beamTarget) {
            case "HULL":
                return this.beamTarget = "REACTOR";
            case "REACTOR":
                return this.beamTarget = "MISSILE_SYSTEM";
            case "MISSILE_SYSTEM":
                return this.beamTarget = "MANEUVERING";
            case "MANEUVERING":
                return this.beamTarget = "IMPULSE_ENGINES";
            case "IMPULSE_ENGINES":
                return this.beamTarget = "WARP_DRIVE";
            case "WARP_DRIVE":
                return this.beamTarget = "JUMP_DRIVE";
            case "JUMP_DRIVE":
                return this.beamTarget = "FRONT_SHIELD_GENERATOR";
            case "FRONT_SHIELD_GENERATOR":
                return this.beamTarget = "REAR_SHIELD_GENERATOR";
            case "REAR_SHIELD_GENERATOR":
                return this.beamTarget = "HULL";
            default:
                return this.beamTarget = "HULL";
        }
    }

    public handleEvent(message: any) {


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
            // case "SELECT_SUBSYSTEM":
            //     console.log("SELECT_SUBSYSTEM: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "SET_SUBSYSTEM_POWER":
            //     console.log("SET_SUBSYSTEM_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            case "SET_REACTOR_POWER":
                return requestCreators.setReactorPower(message.event.value);
            case "SET_BEAM_WEAPONS_POWER":
                return requestCreators.setBeamWeaponsPower(message.event.value);
            case "SET_MISSILE_SYSTEM_POWER":
                return requestCreators.setMissileSystemPower(message.event.value);
            case "SET_MANEUVERING_POWER":
                return requestCreators.setManeuveringPower(message.event.value);
            case "SET_IMPULSE_ENGINES_POWER":
                return requestCreators.setImpulseEnginePower(message.event.value);
            case "SET_JUMP_DRIVE_POWER":
                return requestCreators.setJumpDrivePower(message.event.value);
            case "SET_WARP_DRIVE_POWER":
                return requestCreators.setWarpDrivePower(message.event.value);
            case "SET_FRONT_SHIELD_GENERATOR_POWER":
                return requestCreators.setFrontShieldPower(message.event.value);
            case "SET_REAR_SHIELD_GENERATOR_POWER":
                return requestCreators.setRearShieldPower(message.event.value);
            // case "SET_SUBSYSTEM_COOLANT":
            //     console.log("SET_SUBSYSTEM_COOLANT", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            case "SET_REACTOR_COOLANT":
                return requestCreators.setReactorCoolant(message.event.value);
            case "SET_BEAM_WEAPONS_COOLANT":
                return requestCreators.setBeamWeaponsCoolant(message.event.value);
            case "SET_MANEUVERING_COOLANT":
                return requestCreators.setManeuveringCoolant(message.event.value);
            case "SET_IMPULSE_ENGINES_COOLANT":
                return requestCreators.setImpulseEngineCoolant(message.event.value);
            case "SET_WARP_DRIVE_COOLANT":
                return requestCreators.setWarpDriveCoolant(message.event.value);
            case "SET_FRONT_SHIELD_GENERATOR_COOLANT":
                return requestCreators.setFrontShieldCoolant(message.event.value);
            case "SET_REAR_SHIELD_GENERATOR_COOLANT":
                return requestCreators.setRearShieldCoolant(message.event.value);
            // case "REPAIR":
            //     console.log("REPAIR: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "ACTIVATE_SELF_DESTRUCT":
            //     console.log("ACTIVATE_SELF_DESTRUCT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "CONFIRM_SELF_DESTRUCT":
            //     console.log("CONFIRM_SELF_DESTRUCT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "CANCEL_SELF_DESTRUCT":
            //     console.log("CANCEL_SELF_DESTRUCT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
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



            // TODO: Replace returning rejected promises with more elegant solutions when events don't cause requests.

            // This should be modified when EE UI allows selecting weapon types through HTTP API
            case "SELECT_WEAPON":
                this.selectAmmoType(message.payload.value);
                return Promise.reject(); // more elegant solution for events which do not send requests?

            case "LOAD_TUBE":
                if (_.has(message.payload, "weapon")) {
                    this.selectAmmoType(message.payload.weapon);
                }
                return requestCreators.loadTube(message.payload.tubeId, this.selectedAmmoType);

            case "LOAD_OR_UNLOAD_TUBE":
                if (_.has(message.payload, "weapon")) {
                    this.selectAmmoType(message.payload.weapon);
                }

                requestCreators.loadTube(message.payload.tubeId, this.selectedAmmoType);
                return requestCreators.unloadTube(message.payload.tubeId);

            // case "LOAD_REAR_TUBE":
            //     console.log("LOAD_REAR_TUBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            case "FIRE_TUBE":
                return requestCreators.fireTube(message.payload.tubeId);

            case "UNLOAD_TUBE":
                return requestCreators.unloadTube(message.payload.tubeId);

            // case "TARGET_NEXT_ENEMY":
            //     console.log("TARGET_NEXT_ENEMY: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "TARGET_PREVIOUS_ENEMY":
            //     console.log("TARGET_PREVIOUS_ENEMY: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            case "SET_BEAM_TARGET":
                this.setBeamTarget(message.payload.value);
                return requestCreators.setBeamTarget(message.payload.value);

            case "NEXT_BEAM_TARGET":
                this.nextBeamTarget();
                return this.setBeamTarget(this.beamTarget);

            case "SET_BEAM_FREQUENCY":
                this.setBeamFrequency(message.payload.value);
                return Promise.reject(); // more elegant solution for events which do not send requests?

            case "NEXT_BEAM_FREQUENCY":
                this.increaseBeamFrequency();
                return requestCreators.setBeamFrequency(this.beamFrequency);

            case "PREVIOUS_BEAM_FREQUENCY":
                this.decreaseBeamFrequency();
                return requestCreators.setBeamFrequency(this.beamFrequency);

            case "SET_SHIELD_FREQUENCY":
                return requestCreators.setShieldFrequency(message.payload.value);

            case "NEXT_SHIELD_FREQUENCY":
                return requestCreators.increaseShieldFrequency();

            case "PREVIOUS_SHIELD_FREQUENCY":
                return requestCreators.decreaseShieldFrequency();

            case "CALIBRATE_SHIELDS":
                return requestCreators.calibrateShields(message.payload.value);

            case "SHIELDS_UP":
                return requestCreators.shieldsUp()

            case "SHIELDS_DOWN":
                return requestCreators.shieldsDown();

            // case "MANUAL_TARGETING":
            //     console.log("MANUAL_TARGETING: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "AUTOMATIC_TARGETING":
            //     console.log("AUTOMATIC_TARGETING: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
            // case "MISSILE_TARGET_ANGLE":
            //     console.log("MISSILE_TARGET_ANGLE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
            //     break;
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
        }
    }
}

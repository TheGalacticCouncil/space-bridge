import dgram from "dgram"

export class RequestCreator {

    constructor() {}

    public handleMessage(message: Buffer) {
        let parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.event) {
            case "SET_THROTTLE":
                console.log("SET_THROTTLE:", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_JUMP":
                console.log("SET_JUMP: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_WARP":
                console.log("SET_WARP: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_HEADING":
                console.log("SET_HEADING: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_COMBAT_MANOUVER":
                console.log("SET_COMBAT_MANOUVER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "ACTIVATE_JUMP":
                console.log("ACTIVATE_JUMP: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "REQUEST_DOCK":
                console.log("REQUEST_DOCK: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "UNDOCK":
                console.log("UNDOCK: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SELECT_SUBSYSTEM":
                console.log("SELECT_SUBSYSTEM: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_SUBSYSTEM_POWER":
                console.log("SET_SUBSYSTEM_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_REACTOR_POWER":
                console.log("SET_REACTOR_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----")
            case "SET_BEAM_WEAPONS_POWER":
                console.log("SET_BEAM_WEAPONS_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_MISSILE_SYSTEM_POWER":
                console.log("SET_MISSILE_SYSTEM_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_MANEUVERING_POWER":
                console.log("SET_MANEUVERING_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_IMPULSE_ENGINES_POWER":
                console.log("SET_IMPULSE_ENGINES_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_JUMP_DRIVE_POWER":
                console.log("SET_JUMP_DRIVE_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_WARP_DRIVE_POWER":
                console.log("SET_WARP_DRIVE_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_FRONT_SHIELD_GENERATOR_POWER":
                console.log("SET_FRONT_SHIELD_GENERATOR_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_REAR_SHIELD_GENERATOR_POWER":
                console.log("SET_REAR_SHIELD_GENERATOR_POWER: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_REACTOR_COOLANT":
                console.log("SET_REACTOR_COOLANT", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_BEAM_WEAPONS_COOLANT":
                console.log("SET_BEAM_WEAPONS_COOLANT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_MANEUVERING_COOLANT":
                console.log("SET_MANEUVERING_COOLANT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_IMPULSE_ENGINES_COOLANT":
                console.log("SET_IMPULSE_ENGINES_COOLANT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "REPLACE":
                console.log("REPLACE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_WARP_DRIVE_COOLANT":
                console.log("SET_WARP_DRIVE_COOLANT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_FRONT_SHIELD_GENERATOR_COOLANT":
                console.log("SET_FRONT_SHIELD_GENERATOR_COOLANT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_REAR_SHIELD_GENERATOR_COOLANT":
                console.log("SET_REAR_SHIELD_GENERATOR_COOLANT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "REPAIR":
                console.log("REPAIR: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "ACTIVATE_SELF_DESTRUCT":
                console.log("ACTIVATE_SELF_DESTRUCT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "CONFIRM_SELF_DESTRUCT":
                console.log("CONFIRM_SELF_DESTRUCT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "CANCEL_SELF_DESTRUCT":
                console.log("CANCEL_SELF_DESTRUCT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_ZOOM_LEVEL":
                console.log("SET_ZOOM_LEVEL: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "CLEAR_ALERT":
                console.log("CLEAR_ALERT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "YELLOW_ALERT":
                console.log("YELLOW_ALERT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "RED_ALERT":
                console.log("RED_ALERT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "PREPARE_PROBE_LAUNCH":
                console.log("PREPARE_PROBE_LAUNCH: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "LAUNCH_PROBE":
                console.log("LAUNCH_PROBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SELECT_WEAPON":
                console.log("SELECT_WEAPON: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "LOAD_TUBE":
                console.log("LOAD_TUBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "LOAD_REAR_TUBE":
                console.log("LOAD_REAR_TUBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "FIRE_TUBE":
                console.log("FIRE_TUBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "UNLOAD_TUBE":
                console.log("UNLOAD_TUBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "TARGET_NEXT_ENEMY":
                console.log("TARGET_NEXT_ENEMY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "TARGET_PREVIOUS_ENEMY":
                console.log("TARGET_PREVIOUS_ENEMY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_BEAM_TARGET":
                console.log("SET_BEAM_TARGET: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "NEXT_BEAM_FREQUENCY":
                console.log("NEXT_BEAM_FREQUENCY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "PREVIOUS_BEAM_FREQUENCY":
                console.log("PREVIOUS_BEAM_FREQUENCY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SET_SHIELD_FREQUENCY":
                console.log("SET_SHIELD_FREQUENCY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "NEXT_SHIELD_FREQUENCY":
                console.log("NEXT_SHIELD_FREQUENCY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "PREVIOUS_SHIELD_FREQUENCY":
                console.log("PREVIOUS_SHIELD_FREQUENCY: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "CALIBRATE_SHIELDS":
                console.log("CALIBRATE_SHIELDS: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SHIELDS_UP":
                console.log("SHIELDS_UP: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SHIELDS_DOWN":
                console.log("SHIELDS_DOWN: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "MANUAL_TARGETING":
                console.log("MANUAL_TARGETING: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "AUTOMATIC_TARGETING":
                console.log("AUTOMATIC_TARGETING: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "MISSILE_TARGET_ANGLE":
                console.log("MISSILE_TARGET_ANGLE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "PREPARE_WAYPOINT_PLACEMENT":
                console.log("PREPARE_WAYPOINT_PLACEMENT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "PLACE_WAYPOINT":
                console.log("PLACE_WAYPOINT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SELECT_PROBE":
                console.log("SELECT_PROBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SELECT_WAYPOINT":
                console.log("SELECT_WAYPOINT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "DELETE_SELECTED_WAYPOINT":
                console.log("DELETE_SELECTED_WAYPOINT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "LINK_SELECTED_PROBE":
                console.log("LINK_SELECTED_PROBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "UNLINK_SELECTED_PROBE":
                console.log("UNLINK_SELECTED_PROBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "UNLINK_PROBE":
                console.log("UNLINK_PROBE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "OPEN_COMMS_TO_SELECTED":
                console.log("OPEN_COMMS_TO_SELECTED: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "CANCEL_OPENING_COMMS":
                console.log("CANCEL_OPENING_COMMS: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "CLOSE_COMMS":
                console.log("CLOSE_COMMS: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "OPEN_COMMS_LOG":
                console.log("OPEN_COMMS_LOG: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "START_HACKING":
                console.log("START_HACKING: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "STOP_HACKING":
                console.log("STOP_HACKING: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "ACTIVATE_PROBE_VIEW":
                console.log("ACTIVATE_PROBE_VIEW: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "DEACTIVATE_PROBE_VIEW":
                console.log("DEACTIVATE_PROBE_VIEW: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "ACTIVATE_RADAR_VIEW":
                console.log("ACTIVATE_RADAR_VIEW: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "ACTIVATE_DATABASE_VIEW":
                console.log("ACTIVATE_DATABASE_VIEW: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "PAUSE":
                console.log("PAUSE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "UNPAUSE":
                console.log("UNPAUSE: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "TARGET_NEXT_SPACE_OBJECT":
                console.log("TARGET_NEXT_SPACE_OBJECT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "TARGET_PREVIOUS_SPACE_OBJECT":
                console.log("TARGET_PREVIOUS_SPACE_OBJECT: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SCAN":
                console.log("SCAN: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SCAN_SLIDER_1":
                console.log("SCAN_SLIDER_1: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SCAN_SLIDER_2":
                console.log("SCAN_SLIDER_2: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SCAN_SLIDER_3":
                console.log("SCAN_SLIDER_3: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SHOW_SYSTEMS":
                console.log("SHOW_SYSTEMS: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
            case "SHOW_TACTICAL":
                console.log("SHOW_TACTICAL: ", parsedMessage.event, "-----NOT_IMPLEMENTED!!-----");
                break;
        }
    }
}

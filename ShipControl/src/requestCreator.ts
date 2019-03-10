import _ from "lodash";

const NOT_SELECTED = "NOT_SELECTED";

export class RequestCreator {
  shieldFrequency: number;
  beamTarget: string;
  beamFrequency: number;
  selectedAmmoType: string;
  constructor() {
    this.shieldFrequency = 0;
    this.beamTarget = "HULL";
    this.selectedAmmoType = NOT_SELECTED;
  }

  selectAmmoType(newAmmoType: string) {
    this.selectedAmmoType = newAmmoType;
  }

  changeShieldFrequency(increase: Boolean) {
    if (increase) {
      this.shieldFrequency++;
    } else {
      this.shieldFrequency--;
    }
  }

  setShieldFrequency(newFrequency: number) {
    if (newFrequency > 20) {
      this.shieldFrequency = 20;
    } else if (newFrequency < 0) {
      this.shieldFrequency = 0;
    } else {
      this.shieldFrequency = newFrequency;
    }
  }

  changeBeamFrequency(increase: Boolean) {
    if (increase) {
      this.beamFrequency++;
    } else {
      this.beamFrequency--;
    }
  }

  setBeamFrequency(newFrequency: number) {
    if (newFrequency > 20 ) {
      this.shieldFrequency = 20;
    } else if (newFrequency < 0) {
      this.shieldFrequency = 0;
    } else {
      this.shieldFrequency = newFrequency;
    }
  }

  setBeamTarget(newTarget: string) {
    this.beamTarget = newTarget;
  }

  nextBeamTarget() {
    switch (this.beamTarget) {
      case "HULL":
        this.beamTarget = "REACTOR";
        break;
      case "REACTOR":
        this.beamTarget = "MISSILE_SYSTEM";
        break;
      case "MISSILE_SYSTEM":
        this.beamTarget = "MANEUVERING";
        break;
      case "MANEUVERING":
        this.beamTarget = "IMPULSE_ENGINES";
        break;
      case "IMPULSE_ENGINES":
        this.beamTarget = "WARP_DRIVE";
        break;
      case "WARP_DRIVE":
        this.beamTarget = "JUMP_DRIVE";
        break;
      case "JUMP_DRIVE":
        this.beamTarget = "FRONT_SHIELD_GENERATOR";
        break;
      case "FRONT_SHIELD_GENERATOR":
        this.beamTarget = "REAR_SHIELD_GENERATOR";
        break;
      case "REAR_SHIELD_GENERATOR":
        this.beamTarget = "HULL";
        break;
      default:
        this.beamTarget = "HULL";
    }
  }

  public handleEvent(message: any) {
    let request: string;

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
      // case "SET_REACTOR_POWER":
      //     console.log("SET_REACTOR_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----")
      //     break;
      // case "SET_BEAM_WEAPONS_POWER":
      //     console.log("SET_BEAM_WEAPONS_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_MISSILE_SYSTEM_POWER":
      //     console.log("SET_MISSILE_SYSTEM_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_MANEUVERING_POWER":
      //     console.log("SET_MANEUVERING_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_IMPULSE_ENGINES_POWER":
      //     console.log("SET_IMPULSE_ENGINES_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_JUMP_DRIVE_POWER":
      //     console.log("SET_JUMP_DRIVE_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_WARP_DRIVE_POWER":
      //     console.log("SET_WARP_DRIVE_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_FRONT_SHIELD_GENERATOR_POWER":
      //     console.log("SET_FRONT_SHIELD_GENERATOR_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_REAR_SHIELD_GENERATOR_POWER":
      //     console.log("SET_REAR_SHIELD_GENERATOR_POWER: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_SUBSYSTEM_COOLANT":
      //     console.log("SET_SUBSYSTEM_COOLANT", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_REACTOR_COOLANT":
      //     console.log("SET_REACTOR_COOLANT", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_BEAM_WEAPONS_COOLANT":
      //     console.log("SET_BEAM_WEAPONS_COOLANT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_MANEUVERING_COOLANT":
      //     console.log("SET_MANEUVERING_COOLANT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_IMPULSE_ENGINES_COOLANT":
      //     console.log("SET_IMPULSE_ENGINES_COOLANT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_WARP_DRIVE_COOLANT":
      //     console.log("SET_WARP_DRIVE_COOLANT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_FRONT_SHIELD_GENERATOR_COOLANT":
      //     console.log("SET_FRONT_SHIELD_GENERATOR_COOLANT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "SET_REAR_SHIELD_GENERATOR_COOLANT":
      //     console.log("SET_REAR_SHIELD_GENERATOR_COOLANT: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
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

      // This should be modified when EE UI allows selecting weapon types through HTTP API
      case "SELECT_WEAPON":
        this.selectAmmoType(message.payload.value);
        break;
      case "LOAD_TUBE":
        if (_.has(message.payload, "weapons")) {
          this.selectAmmoType(message.payload.weapon);
        }
        request = `set.lua?commandLoadTube(${message.payload.tubeId}, \"${
          this.selectedAmmoType
        }\")`;
        return request;

      // case "LOAD_REAR_TUBE":
      //     console.log("LOAD_REAR_TUBE: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      case "FIRE_TUBE":
        // TODO: second param (target angle) needs to be figured out
        request = `set.lua?commandFireTube(${message.payload.tubeId}, 90)`;
        return request;

      case "UNLOAD_TUBE":
        request = `set.lua?commandUnloadTube(${message.payload.tubeId})`;
        return request;

      // case "TARGET_NEXT_ENEMY":
      //     console.log("TARGET_NEXT_ENEMY: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      // case "TARGET_PREVIOUS_ENEMY":
      //     console.log("TARGET_PREVIOUS_ENEMY: ", message.event, "-----NOT_IMPLEMENTED!!-----");
      //     break;
      case "SET_BEAM_TARGET":
        this.setBeamTarget(message.payload.value);
        request = `set.lua?commandSetBeamSystemTarget(${
          message.payload.value
        })`;
        return request;

      case "NEXT_BEAM_TARGET":
        this.nextBeamTarget();
        request = `set.lua?commandSetBeamSystemTarget(${this.beamTarget})`;
        return request;

      case "SET_BEAM_FREQUENCY":
        this.setBeamFrequency(message.payload.value);

      case "NEXT_BEAM_FREQUENCY":
        this.changeBeamFrequency(true);
        request = `set.lua?commandSetShieldFrequency(${this.beamFrequency})`;
        return request;

      case "PREVIOUS_BEAM_FREQUENCY":
        this.changeBeamFrequency(false);
        request = `set.lua?commandSetShieldFrequency(${this.beamFrequency})`;
        return request;

      case "SET_SHIELD_FREQUENCY":
        this.setShieldFrequency(message.payload.value);
        request = `set.lua?commandSetShieldFrequency(${this.shieldFrequency})`;
        return request;

      case "NEXT_SHIELD_FREQUENCY":
        this.changeShieldFrequency(true);
        // request = `set.lua?commandSetShieldFrequency(${this.shieldFrequency})`;
        // return request;
        break;

      case "PREVIOUS_SHIELD_FREQUENCY":
        this.changeShieldFrequency(false);
        // request = `set.lua?commandSetShieldFrequency(${this.shieldFrequency})`;
        // return request;
        break;

      case "CALIBRATE_SHIELDS":
        request = `set.lua?commandSetShieldFrequency(${this.shieldFrequency})`;
        break;

      case "SHIELDS_UP":
        request = `set.lua?commandSetShields(true)`;
        return request;

      case "SHIELDS_DOWN":
        request = `set.lua?commandSetShields(false)`;
        return request;

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

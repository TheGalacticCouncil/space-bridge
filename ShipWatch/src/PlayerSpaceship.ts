import { stat } from "fs";
import { EEClient } from "./EEClient.js";

export enum SpaceshipSystem {
    REACTOR = "Reactor",
    BEAMS = "BeamWeapons",
    MISSILES = "MissileSystem",
    MANEUVER = "Maneuver",
    IMPULSE = "Impulse",
    WARP = "Warp",
    JUMP_DRIVE = "JumpDrive",
    FRONT_SHIELDS = "FrontShield",
    REAR_SHIELDS = "RearShield"
}

interface SpaceshipSystemStatus {
    coolantLevel: number;
    powerLevel: number;
}

export interface SpaceshipStatus {
    systems: {
        [SpaceshipSystem.REACTOR]: SpaceshipSystemStatus;
        [SpaceshipSystem.BEAMS]: SpaceshipSystemStatus;
        [SpaceshipSystem.MISSILES]: SpaceshipSystemStatus;
        [SpaceshipSystem.MANEUVER]: SpaceshipSystemStatus;
        [SpaceshipSystem.IMPULSE]: SpaceshipSystemStatus;
        [SpaceshipSystem.WARP]: SpaceshipSystemStatus;
        [SpaceshipSystem.JUMP_DRIVE]: SpaceshipSystemStatus;
        [SpaceshipSystem.FRONT_SHIELDS]: SpaceshipSystemStatus;
        [SpaceshipSystem.REAR_SHIELDS]: SpaceshipSystemStatus;
    }
}

interface CoolantLevelResponse {
    [SpaceshipSystem.REACTOR]: number;
    [SpaceshipSystem.BEAMS]: number;
    [SpaceshipSystem.MISSILES]: number;
    [SpaceshipSystem.MANEUVER]: number;
    [SpaceshipSystem.IMPULSE]: number;
    [SpaceshipSystem.WARP]: number;
    [SpaceshipSystem.JUMP_DRIVE]: number;
    [SpaceshipSystem.FRONT_SHIELDS]: number;
    [SpaceshipSystem.REAR_SHIELDS]: number;
}

interface PowerLevelResponse {
    [SpaceshipSystem.REACTOR]: number;
    [SpaceshipSystem.BEAMS]: number;
    [SpaceshipSystem.MISSILES]: number;
    [SpaceshipSystem.MANEUVER]: number;
    [SpaceshipSystem.IMPULSE]: number;
    [SpaceshipSystem.WARP]: number;
    [SpaceshipSystem.JUMP_DRIVE]: number;
    [SpaceshipSystem.FRONT_SHIELDS]: number;
    [SpaceshipSystem.REAR_SHIELDS]: number;
}

export class PlayerSpaceship {
    client: EEClient;
    status: SpaceshipStatus = {
        systems: {
            [SpaceshipSystem.REACTOR]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.BEAMS]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.MISSILES]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.MANEUVER]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.IMPULSE]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.WARP]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.JUMP_DRIVE]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.FRONT_SHIELDS]: {coolantLevel: 0, powerLevel: 0},
            [SpaceshipSystem.REAR_SHIELDS]: {coolantLevel: 0, powerLevel: 0}
        }
    }

    constructor(client: EEClient) {
        this.client = client;
    }

    public async update() {
        await this.updateSystemsStatus();

        // process.stdout.write("\u001b[2J\u001b[0;0H");
        // console.log("Current spaceship status:\n", this.status);
    }

    public getSpaceshipStatus(): SpaceshipStatus {
        return structuredClone(this.status);
    }

    private async updateSystemsStatus(): Promise<void> {
        await Promise.all([
            this.updateSystemsCoolantLevel(),
            this.updateSystemsPowerLevel()
        ]);
    }

    private async updateSystemsCoolantLevel(): Promise<void> {
        const status: any = await this.client.get('Reactor=getCurrentCoolantLevel("Reactor")&BeamWeapons=getCurrentCoolantLevel("BeamWeapons")&MissileSystem=getCurrentCoolantLevel("MissileSystem")&Maneuver=getCurrentCoolantLevel("Maneuver")&Impulse=getCurrentCoolantLevel("Impulse")&Warp=getCurrentCoolantLevel("Warp")&JumpDrive=getCurrentCoolantLevel("JumpDrive")&FrontShield=getCurrentCoolantLevel("FrontShield")&RearShield=getCurrentCoolantLevel("RearShield")');

        if (status["ERROR"] == "No game") {
            return;
        } else if (status["error"] == "No valid object") {
            return;
        } else if (status["ERROR"] != undefined) {
            console.error(status);
            return;
        } else if (status["error"] != undefined) {
            console.error(status);
            return;
        } else if (Object.keys(status).length == 0) {
            console.error("Empty response from server");
            return;
        }

        // TODO: Properly assert the type of status
        const coolantLevelStatus : CoolantLevelResponse = status;

        for (const system in status) {
            this.status.systems[system as SpaceshipSystem].coolantLevel = status[system as SpaceshipSystem];
        }
    }

    private async updateSystemsPowerLevel(): Promise<void> {
        const status: any = await this.client.get('Reactor=getCurrentPowerLevel("Reactor")&BeamWeapons=getCurrentPowerLevel("BeamWeapons")&MissileSystem=getCurrentPowerLevel("MissileSystem")&Maneuver=getCurrentPowerLevel("Maneuver")&Impulse=getCurrentPowerLevel("Impulse")&Warp=getCurrentPowerLevel("Warp")&JumpDrive=getCurrentPowerLevel("JumpDrive")&FrontShield=getCurrentPowerLevel("FrontShield")&RearShield=getCurrentPowerLevel("RearShield")');

        if (status["ERROR"] == "No game") {
            return;
        } else if (status["error"] == "No valid object") {
            return;
        } else if (status["ERROR"] != undefined) {
            console.error(status);
            return;
        } else if (status["error"] != undefined) {
            console.error(status);
            return;
        } else if (Object.keys(status).length == 0) {
            console.error("Empty response from server");
            return;
        }

        // TODO: Properly assert the type of status
        const powerLevelStatus : PowerLevelResponse = status;

        for (const system in status) {
            this.status.systems[system as SpaceshipSystem].powerLevel = status[system as SpaceshipSystem];
        }
    }
}

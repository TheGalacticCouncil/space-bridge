export var SpaceshipSystem;
(function (SpaceshipSystem) {
    SpaceshipSystem["REACTOR"] = "Reactor";
    SpaceshipSystem["BEAMS"] = "BeamWeapons";
    SpaceshipSystem["MISSILES"] = "MissileSystem";
    SpaceshipSystem["MANEUVER"] = "Maneuver";
    SpaceshipSystem["IMPULSE"] = "Impulse";
    SpaceshipSystem["WARP"] = "Warp";
    SpaceshipSystem["JUMP_DRIVE"] = "JumpDrive";
    SpaceshipSystem["FRONT_SHIELDS"] = "FrontShield";
    SpaceshipSystem["REAR_SHIELDS"] = "RearShield";
})(SpaceshipSystem || (SpaceshipSystem = {}));
export class PlayerSpaceship {
    client;
    status = {
        systems: {
            [SpaceshipSystem.REACTOR]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.BEAMS]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.MISSILES]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.MANEUVER]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.IMPULSE]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.WARP]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.JUMP_DRIVE]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.FRONT_SHIELDS]: { coolantLevel: 0, powerLevel: 0 },
            [SpaceshipSystem.REAR_SHIELDS]: { coolantLevel: 0, powerLevel: 0 }
        }
    };
    constructor(client) {
        this.client = client;
    }
    async update() {
        await this.updateSystemsStatus();
        // process.stdout.write("\u001b[2J\u001b[0;0H");
        // console.log("Current spaceship status:\n", this.status);
    }
    getSpaceshipStatus() {
        return structuredClone(this.status);
    }
    async updateSystemsStatus() {
        await Promise.all([
            this.updateSystemsCoolantLevel(),
            this.updateSystemsPowerLevel()
        ]);
    }
    async updateSystemsCoolantLevel() {
        const status = await this.client.get('Reactor=getCurrentCoolantLevel("Reactor")&BeamWeapons=getCurrentCoolantLevel("BeamWeapons")&MissileSystem=getCurrentCoolantLevel("MissileSystem")&Maneuver=getCurrentCoolantLevel("Maneuver")&Impulse=getCurrentCoolantLevel("Impulse")&Warp=getCurrentCoolantLevel("Warp")&JumpDrive=getCurrentCoolantLevel("JumpDrive")&FrontShield=getCurrentCoolantLevel("FrontShield")&RearShield=getCurrentCoolantLevel("RearShield")');
        if (status["ERROR"] == "No game") {
            return;
        }
        else if (status["error"] == "No valid object") {
            return;
        }
        else if (status["ERROR"] != undefined) {
            console.error(status);
            return;
        }
        else if (status["error"] != undefined) {
            console.error(status);
            return;
        }
        else if (Object.keys(status).length == 0) {
            console.error("Empty response from server");
            return;
        }
        // TODO: Properly assert the type of status
        const coolantLevelStatus = status;
        for (const system in status) {
            this.status.systems[system].coolantLevel = status[system];
        }
    }
    async updateSystemsPowerLevel() {
        const status = await this.client.get('Reactor=getCurrentPowerLevel("Reactor")&BeamWeapons=getCurrentPowerLevel("BeamWeapons")&MissileSystem=getCurrentPowerLevel("MissileSystem")&Maneuver=getCurrentPowerLevel("Maneuver")&Impulse=getCurrentPowerLevel("Impulse")&Warp=getCurrentPowerLevel("Warp")&JumpDrive=getCurrentPowerLevel("JumpDrive")&FrontShield=getCurrentPowerLevel("FrontShield")&RearShield=getCurrentPowerLevel("RearShield")');
        if (status["ERROR"] == "No game") {
            return;
        }
        else if (status["error"] == "No valid object") {
            return;
        }
        else if (status["ERROR"] != undefined) {
            console.error(status);
            return;
        }
        else if (status["error"] != undefined) {
            console.error(status);
            return;
        }
        else if (Object.keys(status).length == 0) {
            console.error("Empty response from server");
            return;
        }
        // TODO: Properly assert the type of status
        const powerLevelStatus = status;
        for (const system in status) {
            this.status.systems[system].powerLevel = status[system];
        }
    }
}

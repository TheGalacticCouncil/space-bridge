import { PlayerSpaceship, SpaceshipStatus, SpaceshipSystem } from "./PlayerSpaceship.js";
import dgram from "dgram";
//@ts-ignore
import config from "../config.json" with { type: "json" };

interface SystemConfig {
    [SpaceshipSystem.REACTOR]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.BEAMS]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.MISSILES]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.MANEUVER]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.IMPULSE]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.WARP]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.JUMP_DRIVE]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.FRONT_SHIELDS]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
    [SpaceshipSystem.REAR_SHIELDS]: {
        coolantMotorNumber: number;
        powerMotorNumber: number;
    };
}

export class EngineerConsole {
    playerSpaceship: PlayerSpaceship;
    lastStatus: SpaceshipStatus;
    systemConfig: SystemConfig = config.systems;
    socket: dgram.Socket;
    broadcastPort: number = config.broadcast.port;
    broadcastAddress: string = config.broadcast.address;

    constructor(playerSpaceship: PlayerSpaceship) {
        this.playerSpaceship = playerSpaceship;
        this.lastStatus = playerSpaceship.getSpaceshipStatus();
        this.socket = dgram.createSocket("udp4");

        this.socket.bind(0, "0.0.0.0", () => this.socket.setBroadcast(true));
    }

    public async update() {
        const newStatus = this.playerSpaceship.getSpaceshipStatus();

        // Emit broadcast events for any changes in coolant levels
        for (const [systemName, systemProperties] of Object.entries(newStatus.systems)) {
            if (systemProperties.coolantLevel !== this.lastStatus.systems[systemName as SpaceshipSystem].coolantLevel) {
                console.log(`Spaceship ${systemName} coolant level changed to ${systemProperties.coolantLevel}`);

                setImmediate(() => this.broadcastMotorPositionEvent(
                    this.systemToCoolantMotorNumber(systemName as SpaceshipSystem),
                    this.coolantLevelToMotorPosition(systemProperties.coolantLevel)
                ));
            }
            if (systemProperties.powerLevel !== this.lastStatus.systems[systemName as SpaceshipSystem].powerLevel) {
                console.log(`Spaceship ${systemName} power level changed to ${systemProperties.powerLevel}`);

                setImmediate(() => this.broadcastMotorPositionEvent(
                    this.systemToPowerMotorNumber(systemName as SpaceshipSystem),
                    this.powerLevelToMotorPosition(systemProperties.powerLevel)
                ));
            }
        }

        this.lastStatus = newStatus;
    }

    private systemToCoolantMotorNumber(system: SpaceshipSystem): number {
        return this.systemConfig[system].coolantMotorNumber;
    }

    private systemToPowerMotorNumber(system: SpaceshipSystem): number {
        return this.systemConfig[system].powerMotorNumber;
    }

    private coolantLevelToMotorPosition(coolantLevel: number): number {
        return Math.round(coolantLevel * 100);
    }

    private powerLevelToMotorPosition(coolantLevel: number): number {
        return Math.round(coolantLevel / 3 * 1000);
    }

    private broadcastMotorPositionEvent(motor: number, positionValue: number) {
        const event = {
            timestamp: Date.now(),
            sourceComponent: "ShipWatch",
            sourceIp: "0.0.0.0",
            event: `MOTOR_${motor}_POSITION`,
            station: "ENGINEER",
            payload: {
                value: positionValue,
            }
        };

        const message = JSON.stringify(event);

        this.socket.send(message, 0, message.length, this.broadcastPort, this.broadcastAddress, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

}

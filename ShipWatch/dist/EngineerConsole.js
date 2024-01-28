import { SpaceshipSystem } from "./PlayerSpaceship.js";
import dgram from "dgram";
//@ts-ignore
import config from "../config.json" with { type: "json" };
export class EngineerConsole {
    playerSpaceship;
    lastStatus;
    systemConfig = config.systems;
    socket;
    broadcastPort = config.broadcast.port;
    broadcastAddress = config.broadcast.address;
    constructor(playerSpaceship) {
        this.playerSpaceship = playerSpaceship;
        this.lastStatus = playerSpaceship.getSpaceshipStatus();
        this.socket = dgram.createSocket("udp4");
        this.socket.bind(0, "0.0.0.0", () => this.socket.setBroadcast(true));
    }
    async update() {
        const newStatus = this.playerSpaceship.getSpaceshipStatus();
        // Emit broadcast events for any changes in coolant levels
        for (const [systemName, systemProperties] of Object.entries(newStatus.systems)) {
            if (systemProperties.coolantLevel !== this.lastStatus.systems[systemName].coolantLevel) {
                console.log(`Spaceship ${systemName} coolant level changed to ${systemProperties.coolantLevel}`);
                setImmediate(() => this.broadcastMotorPositionEvent(this.systemToCoolantMotorNumber(systemName), this.coolantLevelToMotorPosition(systemProperties.coolantLevel)));
            }
            if (systemProperties.powerLevel !== this.lastStatus.systems[systemName].powerLevel) {
                console.log(`Spaceship ${systemName} power level changed to ${systemProperties.powerLevel}`);
                setImmediate(() => this.broadcastMotorPositionEvent(this.systemToPowerMotorNumber(systemName), this.powerLevelToMotorPosition(systemProperties.powerLevel)));
            }
        }
        this.lastStatus = newStatus;
    }
    systemToCoolantMotorNumber(system) {
        return this.systemConfig[system].coolantMotorNumber;
    }
    systemToPowerMotorNumber(system) {
        return this.systemConfig[system].powerMotorNumber;
    }
    coolantLevelToMotorPosition(coolantLevel) {
        return Math.round(coolantLevel * 100);
    }
    powerLevelToMotorPosition(coolantLevel) {
        return Math.round(coolantLevel / 3 * 1000);
    }
    broadcastMotorPositionEvent(motor, positionValue) {
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

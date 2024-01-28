//@ts-ignore
import config from "../config.json" with { type: "json" };
export class EEClient {
    emptyEpsilonServerIp;
    emptyEpsilonServerPort;
    constructor() {
        this.emptyEpsilonServerIp = config.server.address;
        this.emptyEpsilonServerPort = config.server.port;
    }
    async get(query) {
        let result = {};
        try {
            const response = await fetch(`http://${this.emptyEpsilonServerIp}:${this.emptyEpsilonServerPort}/get.lua?${query}`);
            result = await response.json();
        }
        catch (error) {
            console.error(error);
        }
        return result;
    }
}

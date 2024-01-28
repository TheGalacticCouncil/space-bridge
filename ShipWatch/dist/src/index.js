import { EEClient } from "./EEClient.js";
import { PlayerSpaceship } from "./PlayerSpaceship.js";
let playerSpaceship;
async function main() {
    const client = new EEClient();
    playerSpaceship = new PlayerSpaceship(client);
    console.log("Starting main loop");
    setTimeout(mainLoop, 1000);
}
async function mainLoop() {
    await playerSpaceship.update();
    setTimeout(mainLoop, 1000);
}
await main();

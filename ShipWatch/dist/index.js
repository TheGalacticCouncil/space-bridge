import { EEClient } from "./EEClient.js";
import { EngineerConsole } from "./EngineerConsole.js";
import { PlayerSpaceship } from "./PlayerSpaceship.js";
let playerSpaceship;
let engineerConsole;
function main() {
    const client = new EEClient();
    playerSpaceship = new PlayerSpaceship(client);
    engineerConsole = new EngineerConsole(playerSpaceship);
    console.log("Starting main loop");
    setTimeout(mainLoop, 1000);
    console.log("Starting event broadcast loop");
    setTimeout(eventBroadcastLoop, 1000);
}
async function mainLoop() {
    await playerSpaceship.update();
    setTimeout(mainLoop, 25);
}
function eventBroadcastLoop() {
    setTimeout(eventBroadcastLoop, 50);
    engineerConsole.update();
}
main();

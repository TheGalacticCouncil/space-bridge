import _ from "lodash";
import dgram from "dgram";


function main() {
    const config = require("../config.json");

    if (config.disableLogging) {
        console.log = () => { };
    }

    // Load events
    const eventTypes: object[] = require(`../${config.eventsFile}`);
    const client = dgram.createSocket("udp4");

    client.bind(0, "0.0.0.0", () => client.setBroadcast(true));

    console.log(eventTypes);

    if (config.autosend) {
        setInterval(update, config.sendIntervalMs);
    } else {
        process.stdin.on("data", () => {
            process.stdin.read();
            update();
        });
    }

    function update() {
        // pick random index
        const index = _.random(0, eventTypes.length - 1);

        const eventType = eventTypes[index];

        const generatedEvent = generateEvent(eventType);

        console.log(generatedEvent);

        const message = JSON.stringify(generatedEvent);

        client.send(message, 0, message.length, config.broadcastPort, config.broadcastAddress);
    }
}

function generateEvent(eventType): object {
    const event = {
        timestamp: Date.now(),
        sourceComponent: "EventGenerator",
        sourceIp: "1.1.1.1",
        event: eventType.name,
        station: randomStation(),
        payload: {}
    };

    if (!_.isEmpty(eventType.fields)) {
        event.payload = generatePayload(eventType.fields);
    }

    return event;
}

function randomStation(): string {
    const stations = [
        "HELM",
        "WEAPONS",
        "ENGINEER",
        "SCIENCE",
        "RELAY"
    ];

    const i = _.random(0, stations.length - 1);

    return stations[i];
}

function generatePayload(fields): object {
    const payload = {};

    _.forEach(fields, field => {
        let value;

        if (field.datatype === "int") {
            const min = _.get(field, "min", 0);
            const max = _.get(field, "max", 100);

            value = _.round(_.random(min, max));

        } else if (field.datatype === "string") {
            value = "value";

            if (field.possibleValues) {
                value = field.possibleValues[_.random(0, field.possibleValues.length - 1)];
            }
        } else if (field.datatype === "SPACEUNIT") {
            value = _.random(-100, 100, true);
        }

        payload[field.name] = value;
    });

    return payload;
}

main();

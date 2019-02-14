import dgram from "dgram";
import { AddressInfo } from "net";
import { RequestCreator } from "./requestCreator"

const server: dgram.Socket = dgram.createSocket("udp4");

const requestCreator: RequestCreator = new RequestCreator();

server.on("error", (err) => {
    console.log(`Server shutdown due to following error:\n ${err}`);
    server.close;
});

server.on("listening", () => {
    const address: AddressInfo = server.address() as AddressInfo;
    console.log(`Server listening to ${address.address}:${address.port}`);
});

server.on("message", (message) => {
    let request = requestCreator.handleMessage(message);
})

server.bind(41114);

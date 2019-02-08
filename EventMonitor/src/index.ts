import dgram from "dgram";
import { AddressInfo } from "net";

const server: dgram.Socket = dgram.createSocket("udp4");

server.on("error", (err) => {
    console.log(`Server shutdown due to following error:\n ${err}`);
    server.close;
});

server.on("listening", () => {
    const address: AddressInfo = server.address() as AddressInfo;
    console.log(`Server listening to ${address.address}:${address.port}`);
});

server.on("message", (buffer) => {
    let message = JSON.parse(buffer.toString());
    console.log("-------------------START OF MESSAGE-----------------------");
    console.log(message);
    console.log("-----------------------END OF MESSAGE---------------------");
})

server.bind(41114);

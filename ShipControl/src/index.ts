import dgram from "dgram";
import { AddressInfo } from "net";
import { RequestCreator } from "./requestCreator";
import { RequestSender } from "./requestSender";
import validator from "event-validator";

const server: dgram.Socket = dgram.createSocket("udp4");

const requestCreator: RequestCreator = new RequestCreator();
const requestSender: RequestSender = new RequestSender();

server.on("error", err => {
  console.log(`Server shutdown due to following error:\n ${err}`);
  server.close;
});

server.on("listening", () => {
  const address: AddressInfo = server.address() as AddressInfo;
  console.log(`Server listening to ${address.address}:${address.port}`);
});

server.on("message", message => {
  validator
    .validateRawEvent(message)
    .then((event: any) => {
      return requestCreator.handleEvent(event);
    })
    .then((request: string) => {
      requestSender.send(request);
    })
    .catch(err => {
      console.log("Invalid event!");
      console.log(err);
    });
});

server.bind(41114);

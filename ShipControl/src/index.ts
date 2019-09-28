import dgram from "dgram";
import { AddressInfo } from "net";
import { EventHandler } from "./eventHandler";
import { RequestSender } from "./requestSender";
import validator from "event-validator";
import IRequest from "./models/IRequest";

const server: dgram.Socket = dgram.createSocket("udp4");

const eventHandler: EventHandler = new EventHandler();
const requestSender: RequestSender = new RequestSender();

server.on("error", err => {
  console.log(`Server shutdown due to following error:\n ${err}`);
  server.close();
});

server.on("listening", () => {
  const address: AddressInfo = server.address() as AddressInfo;
  console.log(`Server listening to ${address.address}:${address.port}`);
});

server.on("message", message => {
  validator
    .validateRawEvent(message)
    .then((event: any) => {
      return eventHandler.handleEvent(event);
    })
    .then((request: IRequest) => {
      return requestSender.send(request);
    })
    .catch(err => {
      console.log("Invalid event!");
      console.log(err);
    });
});

server.bind(41114);

import _ from "lodash";

import axios from "axios";
import IRequest from "./models/IRequest";

const config: any = require("../config.json");

export class RequestSender {

  serverAddress: string;
  serverPort: string;
  url: string;
  requestQueue: IRequest[];

  constructor() {
    this.serverAddress = config.server.address;
    this.serverPort = config.server.port;
    this.url = this.serverAddress + ":" + this.serverPort;
    this.requestQueue = [];
  }

  public async startSending(): Promise<void> {
    while (!_.isEmpty(this.requestQueue)) {

      const request: IRequest | undefined = this.requestQueue.shift();
      if (request !== undefined) {
        try {
          await this.send(request);
        } catch (error) {
          console.log("error");
        }
      }
    }
    setTimeout(() => { this.startSending() }, 10);
  }

  public addToSendQueue(requests: IRequest[]): void {
    for (const request of requests) {
      this.requestQueue.push(request);
    }
  }

  public async send(request: IRequest): Promise<void> {

    console.log(`Request in Sender: ${request}`);
    if (request.method === "get") {
      try {
        await axios.get(`${this.url}/${request.path}`)
          .then(() => Promise.resolve())
          .catch(err => {
            throw (err);
          });
      } catch (error) {
        console.log("error");
      }

    } else {
      try {
        await axios.post(`${this.url}/${request.path}`, request.body)
          .then(() => Promise.resolve())
          .catch(err => {
            throw (err);
          });
      } catch (error) {
        console.log("error");
      }
    }

    return Promise.resolve();
  }
}

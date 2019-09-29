import _ from "lodash";

import axios from "axios";
import IRequest from "./models/IRequest";

const config: any = require("../config.json");

export class RequestSender {

  serverAddress: string;
  serverPort: string;
  url: string;

  constructor() {
    this.serverAddress = config.serverAddress;
    this.serverPort = config.serverPort;
    this.url = this.serverAddress + ":" + this.serverPort;
  }

  public async send(requests: IRequest[]): Promise<void> {

    _.forEach(requests, async (request: IRequest): Promise<void> => {

      // console.log(`Request in Sender: ${request}`);
      if (request.method === "get") {

        await axios.get(`${this.url}/${request.path}`)
        .then(() => Promise.resolve())
        .catch(err => {
          throw(err);
        });

      } else {

        await axios.post(`${this.url}/${request.path}`, request.body)
        .then(() => Promise.resolve())
        .catch(err => {
          throw(err);
        });
      }
    });

    return Promise.resolve();
  }
}

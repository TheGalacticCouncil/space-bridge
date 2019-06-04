import axios from "axios";

const config: any = require("../config.json");

export class RequestSender {

  serverAddress: string;
  serverPort: string;
  url: string;
  constructor () {
    this.serverAddress = config.serverAddress;
    this.serverPort = config.serverPort;
    this.url = this.serverAddress + ":" + this.serverPort;
  }

  send(request: any) {

    console.log(request);
    if (request.method === "get") {
      axios.get(`${this.url}/${request.path}`)
      .catch(err => {
        console.log(err);
      });
    } else if (request.method === "post") {
      axios.post(`${this.url}/${request.path}`, request.body)
      .catch(err => {
        console.log(err);
      });
    } else {
      console.log("Unknown method!");
    }
  }
}

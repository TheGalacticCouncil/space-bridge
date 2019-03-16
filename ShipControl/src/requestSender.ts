import axios from "axios";

export class RequestSender {

  url: string;
  constructor () {
    this.url = "http://localhost:8080";
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

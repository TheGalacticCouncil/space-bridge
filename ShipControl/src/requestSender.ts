import axios from "axios";

export class RequestSender {
  send(request: string) {
    axios.get(`http://localhost:8080/${request}`)
    .catch(err => {
      console.log(err);
    });
  }
}

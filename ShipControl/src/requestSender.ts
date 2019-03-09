import dgram from "dgram";

export class RequestSender {
  send(request: string, server: dgram.Socket) {
    server.send(request, 41114, "localhost", err => {
      server.close();
    });
  }
}

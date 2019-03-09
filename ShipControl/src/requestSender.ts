import dgram from "dgram";

export class RequestSender {
  send(request: string, server: dgram.Socket) {
    server.send(request, 8080, "localhost", err => {
      server.close();
    });
  }
}

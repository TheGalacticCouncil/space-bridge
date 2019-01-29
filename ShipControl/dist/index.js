"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const server = dgram_1.default.createSocket("udp4");
server.on("error", (err) => {
    console.log(`Server shutdown due to following error:\n ${err}`);
    server.close;
});
server.on("listening", () => {
    const address = server.address();
    console.log(`Server listening to ${address.address}:${address.port}`);
});
server.bind(41114);
//# sourceMappingURL=index.js.map
import http from "node:http";
import { WebSocketServer } from "ws";
import { watchStorage } from "./lib/watchStorage.js";
import { requestHandler } from "./routes/handler.js";

const server = http.createServer();

server.on("request", (req, res) => {
  requestHandler(req, res);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  watchStorage(ws);
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

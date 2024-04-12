import http from "node:http";
import { routeHandler } from "./routes/handler";

const server = http.createServer();

server.on("request", (req, res) => {
  routeHandler(req, res)
})

server.listen(3000, () => {
  console.log("Server is running on port 3000");
})

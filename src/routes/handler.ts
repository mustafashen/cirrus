import {IncomingMessage, ServerResponse} from "node:http";
import {dir2route} from 'dir2route'
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileTransfer } from "./file-transfer";


const routes = async () => {
  const pageRoutes = await dir2route()

  return {
    ...pageRoutes,
    ...fileTransfer
  }
}

export async function routeHandler(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  console.log(req.headers)
  const handler = (await routes())[req.url]
  if (handler) {
    handler(req, res)
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    const path = join(process.cwd(), "public", "404.html");
    res.end((await readFile(path, "utf-8")));
  }
}
import { IncomingMessage, ServerResponse } from "node:http";
import { dir2route } from "dir2route";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileTransfer } from "./file-transfer.js";
import { parseUrl } from "../lib/parseUrl.js";

const routes = async () => {
  const pageRoutes = await dir2route();

  return {
    ...pageRoutes,
    ...fileTransfer,
  };
};

export async function requestHandler(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  const parsedUrl = parseUrl(req)
  const route = (await routes())[parsedUrl.pathname]
  const handler = route ? route[req.method] : undefined
  if (handler) {
    handler(req, res, parsedUrl);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    const path = join(process.cwd(), "public", "404.html");
    res.end(await readFile(path, "utf-8"));
  }
}

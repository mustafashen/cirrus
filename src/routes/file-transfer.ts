import { IncomingMessage, ServerResponse } from "http";
import { stream2buffer } from "../lib/stream2buffer.js";
import { saveBuffer } from "../lib/fileOperations.js";
import { Url } from "url";
import { ParsedUrlQuery } from "querystring";
import { join } from "path";
import { storage } from "../lib/constants.js";
import { access } from "fs/promises";
import { createReadStream } from "fs";

export const fileTransfer = {
  "/upload": {
    POST: async (
      req: IncomingMessage,
      res: ServerResponse<IncomingMessage>
    ) => {
      try {
        const buffer = await stream2buffer(req);
        const saveStatus = await saveBuffer(buffer);

        console.log(saveStatus);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "File uploaded successfully" }));
      } catch (error: unknown) {
        res.writeHead(500, { "Content-Type": "application/json" });
        if (error instanceof Error)
          res.end(JSON.stringify({ message: error.message }));
        else res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    },
  },
  "/download": {
    GET: async (
      req: IncomingMessage,
      res: ServerResponse<IncomingMessage>,
      parsedUrl?: Url
    ) => {
      try {
        const query = parsedUrl.query as ParsedUrlQuery;
        if (query && "type" in query && "name" in query) {
          const filePath = join(storage, query.type as string, query.name as string);
          await access(filePath);
          res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${query.file}"`,
            "Transfer-Encoding": "chunked",
          });
          const readStream = createReadStream(filePath);
          readStream.pipe(res);
        } else {
          throw new Error("Error during file download");
        }
      } catch (error: unknown) {
        res.writeHead(500, { "Content-Type": "application/json" });
        if (error instanceof Error)
          res.end(JSON.stringify({ message: error.message }));
        else res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    },
  },
};

import { IncomingMessage, ServerResponse } from "http";
import { stream2buffer } from "../lib/stream2buffer.js";
import { bufferType } from "../lib/bufferType.js";
import { saveBuffer } from "../lib/fileOperations.js";

export const fileTransfer = {
  "/upload": async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => {
    try {
      if (req.method !== "POST" || req.headers.multipart !== "form-data")
        throw new Error("Method not allowed");

      const buffer = await stream2buffer(req);
      const fileType = await bufferType(buffer);
      const saveStatus = await saveBuffer(buffer, fileType);

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
};

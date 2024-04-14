import { writeFile } from "fs/promises";
import { join } from "path";
import { createNecessaryDirs } from "./createNecessaryDirs.js";
import { storage } from "./constants.js";
import { bufferType } from "./bufferType.js";

export async function saveBuffer(buffer: Buffer) {
  try {
    const fileType = await bufferType(buffer);
    const saveDir = join(storage, fileType.mime.split('/')[0])

    await createNecessaryDirs(storage, saveDir);

    await writeFile(join(saveDir, `${Date.now()}.${fileType.ext}`), buffer);

    return {
      success: true,
      message: "File saved successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Error during saving file");
  }
}

import { FileTypeResult } from "file-type";
import { writeFile, access, mkdir } from "fs/promises";
import { join } from "path";
import { createNecessaryDirs } from "./createNecessaryDirs.js";
import { storage } from "./constants.js";

export async function saveBuffer(
  buffer: Buffer,
  fileType: FileTypeResult
) {
  try {
    await createNecessaryDirs(storage);

    await writeFile(
      join(storage, `${Date.now()}.${fileType.ext}`),
      buffer
    );
    
    return {
      success: true,
      message: "File saved successfully",
    }
    
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Error during saving file");
  }
}

import { writeFile } from "fs/promises";
import { join } from "path";

const storage = join(process.cwd(), "storage")
export async function saveBuffer(buffer: Buffer, format: {format: string}) {
  try {
    await writeFile(join(storage, `${Date.now()}.${format.format}`), buffer)
    return {
      success: true,
      message: "File saved successfully"
    }
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message)
    throw new Error('Error during saving file')
  }
}
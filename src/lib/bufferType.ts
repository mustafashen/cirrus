import { fileTypeFromBuffer } from "file-type"

export async function bufferType(buffer: Buffer) {
  try {
    const fileType = await fileTypeFromBuffer(buffer)
    return fileType    
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Error during detecting file type')
    }
  }
} 
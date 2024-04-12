
const bufferFormatMagicNumbers = {
  'ffd8ffe0': 'jpeg',
  '89504e47': 'png',
  '52494646': 'webp',
};

export function bufferType(buffer: Buffer) {
  try {
    const magicNumber = buffer.toString('hex', 0, 4).toLocaleLowerCase()

    if (bufferFormatMagicNumbers[magicNumber]) {
      return {format: bufferFormatMagicNumbers[magicNumber]}
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Error during detecting file type')
    }
  }
} 
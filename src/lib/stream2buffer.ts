import { IncomingMessage } from "http";

export function stream2buffer(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    
    const chunks = []
    req.on("data", (chunk) => {
      chunks.push(chunk)
    })

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      } catch (error) {
        reject(error)
      }
    })

    req.on("error", (err) => {
      reject(err)
    })

  })
}
import { readdir, watch } from "fs/promises"
import { createNecessaryDirs } from "./createNecessaryDirs.js"
import { storage } from "./constants.js"

function sendStorageDirectoryState(ws) {
  readdir(storage).then(files => {
    ws.send(JSON.stringify(files))
  })
}

export async function watchStorage(ws) {
  try {
    await createNecessaryDirs(storage)
    sendStorageDirectoryState(ws)
    const watcher = watch(storage, {recursive: true})
    console.log('Initiated watcher for storage dir')
    for await (const event of watcher) {
      sendStorageDirectoryState(ws)
    }
  } catch (error) {
    if (error instanceof Error) {
      ws.send(error.message)
    } else {
      ws.send('Error during watching storage dir')
    }
  }
}
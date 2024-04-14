import { readdir, watch } from "fs/promises";
import { createNecessaryDirs } from "./createNecessaryDirs.js";
import { storage } from "./constants.js";

async function sendStorageDirectoryState(ws) {
  const entities = await readdir(storage, {
    recursive: true,
    withFileTypes: true,
  });
  const files = entities.filter((entitiy) => entitiy.isFile());
  ws.send(
    JSON.stringify(
      files.map((file) => {
        const type = file.path.split(storage)[1].replace("/", "");
        return {
          name: file.name,
          type,
          mime: `${type}/${file.name.split(".")[1]}`,
        };
      })
    )
  );
}

export async function watchStorage(ws) {
  try {
    await createNecessaryDirs(storage);
    await sendStorageDirectoryState(ws);
    const watcher = watch(storage, { recursive: true });
    console.log("Initiated watcher for storage dir");
    for await (const event of watcher) {
      await sendStorageDirectoryState(ws);
    }
  } catch (error) {
    if (error instanceof Error) {
      ws.send(error.message);
    } else {
      ws.send("Error during watching storage dir");
    }
  }
}

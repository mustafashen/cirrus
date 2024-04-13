import { access, mkdir } from "fs/promises";

export async function createNecessaryDirs(...dirs: string[]) {
  try {
    for (const dir of dirs) {
      await access(dir);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ('code' in error && error.code === "ENOENT") {
        for (const dir of dirs) {
          await mkdir(dir, { recursive: true });
        }
      } else throw new Error(error.message);
    }
  }
}
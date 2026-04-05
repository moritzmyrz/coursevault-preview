import { readFile as fsReadFile } from "node:fs/promises";
import { resolveSafe, assertExists } from "../utils/errors.js";

export async function readFile(baseDir: string, relativePath: string): Promise<string> {
  const fullPath = resolveSafe(baseDir, relativePath);
  await assertExists(fullPath, relativePath);

  try {
    return await fsReadFile(fullPath, "utf-8");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not read "${relativePath}": ${msg}`);
  }
}

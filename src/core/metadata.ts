import { stat } from "node:fs/promises";
import { basename, extname } from "node:path";
import type { FileMetadata } from "../types/index.js";
import { resolveSafe, assertExists } from "../utils/errors.js";

export async function getFileMetadata(
  baseDir: string,
  relativePath: string,
): Promise<FileMetadata> {
  const fullPath = resolveSafe(baseDir, relativePath);
  await assertExists(fullPath, relativePath);

  const stats = await stat(fullPath);

  return {
    relativePath,
    filename: basename(relativePath),
    extension: extname(relativePath),
    sizeBytes: stats.size,
    modifiedAt: stats.mtime,
  };
}

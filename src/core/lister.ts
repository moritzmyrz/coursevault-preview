import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { resolveSafe } from "../utils/errors.js";

/**
 * Recursively walks a directory and returns all file paths as relative paths
 * sorted alphabetically.
 */
async function walk(dir: string, base: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(full, base)));
    } else {
      results.push(relative(base, full));
    }
  }

  return results;
}

export async function listFiles(baseDir: string): Promise<string[]> {
  // Validate baseDir itself is accessible before walking
  resolveSafe(baseDir, ".");

  try {
    const files = await walk(baseDir, baseDir);
    return files.sort();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not list files in "${baseDir}": ${msg}`);
  }
}

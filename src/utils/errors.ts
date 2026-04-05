import { access } from "node:fs/promises";
import { normalize, join, sep } from "node:path";

/**
 * Resolves a relative path against baseDir and verifies it does not escape
 * the base directory. Returns the normalized path.
 */
export function resolveSafe(baseDir: string, relativePath: string): string {
  const base = normalize(baseDir);
  const full = normalize(join(base, relativePath));

  // startsWith(base) alone is insufficient — it matches sibling directories that
  // share a name prefix (e.g. base="/a/b", full="/a/b2/evil" passes the string
  // check but escapes the tree). Require a separator after the base prefix.
  if (full !== base && !full.startsWith(base + sep)) {
    throw new Error(
      `Path "${relativePath}" escapes the base directory — possible path traversal.`,
    );
  }

  return full;
}

/**
 * Throws if the resolved file does not exist or is not accessible.
 */
export async function assertExists(fullPath: string, relativePath: string): Promise<void> {
  try {
    await access(fullPath);
  } catch {
    throw new Error(`File not found: "${relativePath}"`);
  }
}

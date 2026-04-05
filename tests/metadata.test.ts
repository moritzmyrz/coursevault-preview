import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { getFileMetadata } from "../src/core/metadata.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("getFileMetadata", () => {
  it("returns correct metadata for a .txt file", async () => {
    const meta = await getFileMetadata(FIXTURES, "notes.txt");
    expect(meta.relativePath).toBe("notes.txt");
    expect(meta.filename).toBe("notes.txt");
    expect(meta.extension).toBe(".txt");
    expect(meta.sizeBytes).toBeGreaterThan(0);
    expect(meta.modifiedAt).toBeInstanceOf(Date);
  });

  it("returns correct metadata for a nested file", async () => {
    const meta = await getFileMetadata(FIXTURES, "week1/lecture.txt");
    expect(meta.filename).toBe("lecture.txt");
    expect(meta.extension).toBe(".txt");
  });

  it("returns the correct extension for a .json file", async () => {
    const meta = await getFileMetadata(FIXTURES, "course-config.json");
    expect(meta.extension).toBe(".json");
  });

  it("throws for a file that does not exist", async () => {
    await expect(getFileMetadata(FIXTURES, "ghost.txt")).rejects.toThrow(
      /File not found/,
    );
  });

  it("throws on path traversal", async () => {
    await expect(getFileMetadata(FIXTURES, "../../etc/passwd")).rejects.toThrow(
      /escapes the base directory/,
    );
  });
});

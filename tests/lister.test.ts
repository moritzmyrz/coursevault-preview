import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { listFiles } from "../src/core/lister.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("listFiles", () => {
  it("returns all files recursively", async () => {
    const files = await listFiles(FIXTURES);
    expect(files).toContain("notes.txt");
    expect(files).toContain("syllabus.md");
    expect(files).toContain("course-config.json");
    expect(files).toContain("week1/lecture.txt");
  });

  it("returns paths sorted alphabetically", async () => {
    const files = await listFiles(FIXTURES);
    const sorted = [...files].sort();
    expect(files).toEqual(sorted);
  });

  it("throws a clear error for a non-existent directory", async () => {
    await expect(listFiles("/tmp/does-not-exist-xyz")).rejects.toThrow(
      /Could not list files/,
    );
  });
});

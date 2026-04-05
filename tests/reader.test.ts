import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { readFile } from "../src/core/reader.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("readFile", () => {
  it("returns the raw content of a text file", async () => {
    const content = await readFile(FIXTURES, "notes.txt");
    expect(content).toContain("distributed system");
  });

  it("returns the raw content of a markdown file", async () => {
    const content = await readFile(FIXTURES, "syllabus.md");
    expect(content).toContain("# CS 401");
  });

  it("returns the raw content of a JSON file", async () => {
    const content = await readFile(FIXTURES, "course-config.json");
    expect(content).toContain("CS401");
  });

  it("throws for a missing file", async () => {
    await expect(readFile(FIXTURES, "missing.txt")).rejects.toThrow(
      /File not found/,
    );
  });

  it("throws on path traversal attempt", async () => {
    await expect(readFile(FIXTURES, "../package.json")).rejects.toThrow(
      /escapes the base directory/,
    );
  });
});

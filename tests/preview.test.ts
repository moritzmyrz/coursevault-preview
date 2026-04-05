import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { previewFile } from "../src/core/preview.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("previewFile", () => {
  describe(".txt files", () => {
    it("returns the content as-is", async () => {
      const result = await previewFile(FIXTURES, "notes.txt");
      expect(result.format).toBe("txt");
      expect(result.content).toContain("distributed system");
      expect(result.relativePath).toBe("notes.txt");
    });
  });

  describe(".md files", () => {
    it("strips heading markers", async () => {
      const result = await previewFile(FIXTURES, "syllabus.md");
      expect(result.format).toBe("md");
      expect(result.content).not.toMatch(/^#/m);
    });

    it("strips bold markers", async () => {
      const result = await previewFile(FIXTURES, "syllabus.md");
      expect(result.content).not.toContain("**");
    });

    it("preserves the text content", async () => {
      const result = await previewFile(FIXTURES, "syllabus.md");
      expect(result.content).toContain("CS 401");
      expect(result.content).toContain("Consensus");
    });
  });

  describe(".json files", () => {
    it("pretty-prints the JSON", async () => {
      const result = await previewFile(FIXTURES, "course-config.json");
      expect(result.format).toBe("json");
      // Pretty-printed JSON has newlines and indentation
      expect(result.content).toContain("\n");
      expect(result.content).toContain("  ");
      expect(result.content).toContain("CS401");
    });
  });

  it("throws for an unsupported file type", async () => {
    // Use a file that exists but has an unsupported extension by writing a temp test
    // We can test the error path by faking the path string (lister won't be called)
    await expect(previewFile(FIXTURES, "notes.csv")).rejects.toThrow(
      /unsupported type/,
    );
  });
});

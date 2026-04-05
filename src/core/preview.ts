import { extname } from "node:path";
import type { PreviewResult, SupportedFormat } from "../types/index.js";
import { readFile } from "./reader.js";

const SUPPORTED: Record<string, SupportedFormat> = {
  ".txt": "txt",
  ".md": "md",
  ".json": "json",
};

export async function previewFile(
  baseDir: string,
  relativePath: string,
): Promise<PreviewResult> {
  const ext = extname(relativePath).toLowerCase();
  const format = SUPPORTED[ext];

  if (!format) {
    const supported = Object.keys(SUPPORTED).join(", ");
    throw new Error(
      `Cannot preview "${relativePath}": unsupported type "${ext}". Supported: ${supported}`,
    );
  }

  const raw = await readFile(baseDir, relativePath);

  const content =
    format === "md" ? stripMarkdown(raw)
    : format === "json" ? prettyJson(raw, relativePath)
    : raw;

  return { relativePath, format, content };
}

/**
 * Strips common Markdown syntax to produce a plain-text preview.
 * Not a full renderer — just enough for a readable summary.
 */
function stripMarkdown(source: string): string {
  return source
    .replace(/^#{1,6}\s+/gm, "")          // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")       // bold
    .replace(/\*(.+?)\*/g, "$1")           // italic
    .replace(/`{3}[\s\S]*?`{3}/g, "")     // fenced code blocks
    .replace(/`(.+?)`/g, "$1")             // inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")   // links
    .replace(/^[-*+]\s+/gm, "• ")          // unordered lists
    .replace(/^\d+\.\s+/gm, "")           // ordered lists
    .replace(/^>\s+/gm, "")               // blockquotes
    .replace(/\n{3,}/g, "\n\n")           // collapse excess blank lines
    .trim();
}

function prettyJson(raw: string, relativePath: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    throw new Error(`Failed to parse JSON in "${relativePath}": invalid JSON`);
  }
}

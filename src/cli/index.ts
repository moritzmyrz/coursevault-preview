#!/usr/bin/env node
import { Command } from "commander";
import { resolve } from "node:path";
import { createCoursevaultPreview } from "../index.js";

const program = new Command();

program
  .name("coursevault-preview")
  .description("Preview course material files from a configured directory")
  .version("0.1.0")
  .option("-d, --dir <path>", "base directory (defaults to cwd)", process.cwd());

program
  .command("list")
  .description("List all files in the base directory")
  .action(async () => {
    await run(async (preview) => {
      const files = await preview.listFiles();
      if (files.length === 0) {
        console.log("No files found.");
      } else {
        files.forEach((f) => console.log(f));
      }
    });
  });

program
  .command("meta <path>")
  .description("Show metadata for a file")
  .action(async (filePath: string) => {
    await run(async (preview) => {
      const meta = await preview.getFileMetadata(filePath);
      console.log(JSON.stringify(meta, jsonReplacer, 2));
    });
  });

program
  .command("read <path>")
  .description("Print the raw contents of a file")
  .action(async (filePath: string) => {
    await run(async (preview) => {
      const content = await preview.readFile(filePath);
      process.stdout.write(content);
    });
  });

program
  .command("preview <path>")
  .description("Print a processed preview of a file (.txt, .md, .json)")
  .action(async (filePath: string) => {
    await run(async (preview) => {
      const result = await preview.previewFile(filePath);
      console.log(`[${result.format}] ${result.relativePath}\n`);
      console.log(result.content);
    });
  });

program.parse();

// --- helpers ---

async function run(
  fn: (preview: ReturnType<typeof createCoursevaultPreview>) => Promise<void>,
) {
  const opts = program.opts<{ dir: string }>();
  const preview = createCoursevaultPreview({ baseDir: resolve(opts.dir) });

  try {
    await fn(preview);
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

// Serialize Date objects to ISO strings in JSON output
function jsonReplacer(_key: string, value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return value;
}

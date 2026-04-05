# coursevault-preview

A small utility for previewing course material files from a configured directory. Useful for internal tooling in a university setting where you need to inspect `.txt`, `.md`, and `.json` files from a consistent base path.

## Installation

```bash
npm install coursevault-preview
```

## Library API

```ts
import { createCoursevaultPreview } from "coursevault-preview";

const vault = createCoursevaultPreview({
  baseDir: "/path/to/course-materials",
});

// List all files recursively
const files = await vault.listFiles();
// → ["course-config.json", "notes.txt", "syllabus.md", "week1/lecture.txt"]

// Get file metadata
const meta = await vault.getFileMetadata("syllabus.md");
// → { relativePath: "syllabus.md", filename: "syllabus.md", extension: ".md",
//     sizeBytes: 842, modifiedAt: Date }

// Read raw file content
const raw = await vault.readFile("course-config.json");

// Preview a file (plain text, stripped markdown, or pretty-printed JSON)
const preview = await vault.previewFile("syllabus.md");
// → { relativePath: "syllabus.md", format: "md", content: "CS 401 ..." }
```

### `createCoursevaultPreview(options)`

| Option    | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `baseDir` | `string` | Absolute path to the course materials directory |

Returns a `CoursevaultPreview` object with four async methods.

### `listFiles()`

Returns a sorted array of relative file paths under `baseDir`, searched recursively.

### `getFileMetadata(relativePath)`

Returns a `FileMetadata` object:

```ts
interface FileMetadata {
  relativePath: string;
  filename: string;
  extension: string;   // e.g. ".md"
  sizeBytes: number;
  modifiedAt: Date;
}
```

### `readFile(relativePath)`

Returns the raw UTF-8 content of the file as a string.

### `previewFile(relativePath)`

Returns a `PreviewResult` for supported file types (`.txt`, `.md`, `.json`):

```ts
interface PreviewResult {
  relativePath: string;
  format: "txt" | "md" | "json";
  content: string;
}
```

- **`.txt`** — returned as-is.
- **`.md`** — Markdown syntax is stripped; the result is a readable plain-text summary. No browser renderer.
- **`.json`** — pretty-printed with 2-space indentation.

## CLI

```bash
# List files (uses cwd as base, or pass --dir)
coursevault-preview --dir ./fixtures list

# Show file metadata
coursevault-preview --dir ./fixtures meta syllabus.md

# Print raw file content
coursevault-preview --dir ./fixtures read notes.txt

# Print a processed preview
coursevault-preview --dir ./fixtures preview course-config.json
```

All commands accept `-d / --dir <path>` to set the base directory. Defaults to the current working directory.

## Development

```bash
npm install
npm run build      # compile TypeScript → dist/
npm test           # run unit tests with vitest
npm run typecheck  # tsc type-check without emitting
npm run lint       # eslint
```

The `fixtures/` directory contains sample course files you can use for manual testing:

```
fixtures/
  notes.txt
  syllabus.md
  course-config.json
  week1/
    lecture.txt
```

## License

MIT

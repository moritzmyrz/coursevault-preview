import type { CoursevaultPreview, PreviewOptions } from "./types/index.js";
import { listFiles } from "./core/lister.js";
import { getFileMetadata } from "./core/metadata.js";
import { readFile } from "./core/reader.js";
import { previewFile } from "./core/preview.js";

export function createCoursevaultPreview(options: PreviewOptions): CoursevaultPreview {
  const { baseDir } = options;

  return {
    listFiles: () => listFiles(baseDir),
    getFileMetadata: (relativePath) => getFileMetadata(baseDir, relativePath),
    readFile: (relativePath) => readFile(baseDir, relativePath),
    previewFile: (relativePath) => previewFile(baseDir, relativePath),
  };
}

export type { CoursevaultPreview, PreviewOptions, FileMetadata, PreviewResult, SupportedFormat } from "./types/index.js";

export interface PreviewOptions {
  /** Absolute path to the directory containing course materials. */
  baseDir: string;
}

export interface FileMetadata {
  relativePath: string;
  filename: string;
  /** Includes the dot, e.g. ".md" */
  extension: string;
  sizeBytes: number;
  modifiedAt: Date;
}

export type SupportedFormat = "txt" | "md" | "json";

export interface PreviewResult {
  relativePath: string;
  format: SupportedFormat;
  /** Processed content ready for display. */
  content: string;
}

export interface CoursevaultPreview {
  listFiles(): Promise<string[]>;
  getFileMetadata(relativePath: string): Promise<FileMetadata>;
  readFile(relativePath: string): Promise<string>;
  previewFile(relativePath: string): Promise<PreviewResult>;
}

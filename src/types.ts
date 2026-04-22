/**
 * Result of classifying an error message.
 */
export interface Classification {
  /** Whether the message looks like technical/internal content */
  technical: boolean;
  /** What kind of technical content was detected */
  category: Category | null;
  /** How confident we are (0 = definitely human-friendly, 1 = definitely technical) */
  confidence: number;
  /** Which pattern matched, if any (useful for debugging) */
  matchedPattern: string | null;
}

export type Category =
  | "stack-trace"
  | "database-error"
  | "network-error"
  | "cloud-error"
  | "orm-error"
  | "exception-class"
  | "file-path"
  | "serialized-data";

/**
 * A pattern definition for detecting technical content.
 */
export interface Pattern {
  /** Human-readable name for this pattern */
  name: string;
  /** Category this pattern belongs to */
  category: Category;
  /** Regex to test against the message */
  regex: RegExp;
  /** Confidence score when this pattern matches (0-1) */
  confidence: number;
}

/**
 * Options for the sanitize function.
 */
export interface SanitizeOptions {
  /** Message to return when the input is detected as technical. Default: "Something went wrong." */
  fallback?: string;
  /** Minimum confidence threshold to consider a message technical. Default: 0.5 */
  threshold?: number;
  /** Additional patterns to check (merged with built-in patterns) */
  extraPatterns?: Pattern[];
}

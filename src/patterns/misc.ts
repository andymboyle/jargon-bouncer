import type { Pattern } from "../types";

/**
 * Patterns for detecting other technical content: exception class names,
 * file paths, serialized data, cloud provider errors, ORM errors.
 */
export const miscPatterns: Pattern[] = [
  // Exception class names (ClassName: message)
  {
    name: "exception-class-colon",
    category: "exception-class",
    regex: /^[\w.]*(?:Error|Exception|Fault|Failure):\s/,
    confidence: 0.85,
  },
  {
    name: "python-exception-class",
    category: "exception-class",
    regex: /\b(?:TypeError|ValueError|KeyError|AttributeError|ImportError|RuntimeError|IndexError|NameError|FileNotFoundError|PermissionError|OSError|IOError)\b/,
    confidence: 0.8,
  },
  {
    name: "java-exception-class",
    category: "exception-class",
    regex: /\b(?:NullPointerException|ClassCastException|IllegalArgumentException|IllegalStateException|ArrayIndexOutOfBoundsException|ClassNotFoundException|NoSuchMethodException|UnsupportedOperationException)\b/,
    confidence: 0.9,
  },

  // File paths that look like source code
  {
    name: "unix-source-path",
    category: "file-path",
    regex: /\/(?:usr|app|src|var|home|opt)\/[\w/.-]+\.\w{1,4}(?::\d+)?/,
    confidence: 0.8,
  },
  {
    name: "windows-source-path",
    category: "file-path",
    regex: /[A-Z]:\\[\w\\.-]+\.\w{1,4}(?::\d+)?/,
    confidence: 0.8,
  },
  {
    name: "node-modules-path",
    category: "file-path",
    regex: /node_modules\/[\w@/.-]+/,
    confidence: 0.9,
  },

  // Serialized data / object dumps
  {
    name: "json-object-dump",
    category: "serialized-data",
    // Low confidence because structured JSON error responses *might* be
    // intentionally user-facing (e.g. {"error": "Not found"}). Only triggers
    // when no higher-confidence pattern matches AND threshold is below 0.7.
    regex: /^\s*\{[\s\S]*"(?:error|message|code|status|detail)":\s/m,
    confidence: 0.7,
  },
  {
    name: "python-repr",
    category: "serialized-data",
    regex: /<[\w.]+\s+object\s+at\s+0x[0-9a-f]+>/i,
    confidence: 0.95,
  },

  // Cloud provider errors
  {
    name: "aws-error",
    category: "cloud-error",
    regex: /\b(?:AccessDeniedException|ResourceNotFoundException|ServiceUnavailableException|ThrottlingException)\b/,
    confidence: 0.85,
  },
  {
    name: "gcp-error",
    category: "cloud-error",
    regex: /\bgoogle\.api_core\.exceptions\.\w+/,
    confidence: 0.95,
  },
  {
    name: "azure-error",
    category: "cloud-error",
    regex: /\bAzure\.\w+\.(?:Models\.)?[\w]+Error\b/,
    confidence: 0.85,
  },

  // ORM errors
  {
    name: "prisma-error",
    category: "orm-error",
    regex: /\bPrisma(?:Client)?(?:Known|Unknown)?RequestError\b/,
    confidence: 0.95,
  },
  {
    name: "prisma-error-code",
    category: "orm-error",
    // Requires Prisma-style context: "P2002" alone is too generic (could be
    // "P2025 budget forecast"). Match when preceded by common Prisma error
    // phrasing or when the code appears with "prisma" nearby.
    regex: /(?:error\s+code|prisma|unique\s+constraint|foreign\s+key)[\s\S]{0,30}\bP\d{4}\b/i,
    confidence: 0.85,
  },
  {
    name: "sqlalchemy-error",
    category: "orm-error",
    regex: /\bsqlalchemy\.exc\.\w+/,
    confidence: 0.95,
  },
  {
    name: "activerecord-error",
    category: "orm-error",
    regex: /\bActiveRecord::[\w:]+Error\b/,
    confidence: 0.9,
  },
  {
    name: "hibernate-error",
    category: "orm-error",
    regex: /\borg\.hibernate\.\w+Exception\b/,
    confidence: 0.9,
  },
];

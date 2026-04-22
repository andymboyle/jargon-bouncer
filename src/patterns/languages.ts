import type { Pattern } from "../types";

/**
 * Patterns for detecting error messages from additional languages
 * beyond the core JS/Python/Java/Go/Ruby/.NET set.
 */
export const languagePatterns: Pattern[] = [
  // Rust
  {
    name: "rust-panic",
    category: "stack-trace",
    regex: /thread '[\w-]+' panicked at/,
    confidence: 0.99,
  },
  {
    name: "rust-unwrap",
    category: "exception-class",
    regex: /called `(?:Result|Option)::unwrap\(\)` on (?:an `Err`|a `None`) value/,
    confidence: 0.95,
  },
  {
    name: "rust-backtrace",
    category: "stack-trace",
    regex: /stack backtrace:\n\s+\d+:/,
    confidence: 0.95,
  },

  // PHP
  {
    name: "php-fatal-error",
    category: "stack-trace",
    regex: /Fatal error:\s+Uncaught/i,
    confidence: 0.95,
  },
  {
    name: "php-stack-trace",
    category: "stack-trace",
    regex: /Stack trace:\s*\n\s*#\d+\s/,
    confidence: 0.95,
  },
  {
    name: "php-pdo-exception",
    category: "database-error",
    regex: /\bPDOException\b/,
    confidence: 0.9,
  },
  {
    name: "php-error-in-file",
    category: "stack-trace",
    regex: /in [\w/\\]+\.php(?:\(\d+\)| on line \d+)/,
    confidence: 0.9,
  },

  // GraphQL
  {
    name: "graphql-error",
    category: "exception-class",
    regex: /\bGraphQLError\b/,
    confidence: 0.9,
  },
  {
    name: "graphql-cannot-query",
    category: "exception-class",
    regex: /Cannot query field ['"]?\w+['"]? on type ['"]?\w+['"]?/,
    confidence: 0.95,
  },
  {
    name: "graphql-syntax",
    category: "exception-class",
    regex: /Syntax Error: (?:Expected|Unexpected) .+ in GraphQL/i,
    confidence: 0.9,
  },
  {
    name: "graphql-validation",
    category: "exception-class",
    regex: /Variable ['"]?\$\w+['"]? (?:of type|is not|expected)/,
    confidence: 0.85,
  },
];

import type { Pattern } from "../types";

/**
 * Patterns for detecting browser and frontend-specific error messages.
 */
export const browserPatterns: Pattern[] = [
  // CORS
  {
    name: "cors-blocked",
    category: "network-error",
    regex: /has been blocked by CORS policy/i,
    confidence: 0.95,
  },
  {
    name: "cors-no-access-control",
    category: "network-error",
    regex: /No 'Access-Control-Allow-Origin' header/i,
    confidence: 0.95,
  },
  {
    name: "cors-preflight",
    category: "network-error",
    regex: /Response to preflight request doesn't pass/i,
    confidence: 0.9,
  },

  // JSON parse errors (usually API returning HTML instead of JSON)
  {
    name: "json-unexpected-token",
    category: "serialized-data",
    regex: /SyntaxError: Unexpected token .{0,5} in JSON at position \d+/,
    confidence: 0.95,
  },
  {
    name: "json-parse-error",
    category: "serialized-data",
    regex: /SyntaxError: (?:Expected|Unexpected).* (?:in|while parsing) JSON/,
    confidence: 0.9,
  },
  {
    name: "json-not-valid",
    category: "serialized-data",
    regex: /\bis not valid JSON\b/i,
    confidence: 0.85,
  },

  // Memory errors
  {
    name: "js-heap-oom",
    category: "exception-class",
    regex: /JavaScript heap out of memory/i,
    confidence: 0.99,
  },
  {
    name: "js-stack-overflow",
    category: "exception-class",
    regex: /Maximum call stack size exceeded/,
    confidence: 0.95,
  },
  {
    name: "enomem",
    category: "network-error",
    regex: /\bENOMEM\b/,
    confidence: 0.95,
  },

  // Permission errors
  {
    name: "eacces",
    category: "network-error",
    regex: /\bEACCES\b/,
    confidence: 0.9,
  },
  {
    name: "eperm",
    category: "network-error",
    regex: /\bEPERM\b/,
    confidence: 0.9,
  },
];

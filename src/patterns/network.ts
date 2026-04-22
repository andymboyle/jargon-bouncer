import type { Pattern } from "../types";

/**
 * Patterns for detecting network and connection error messages.
 */
export const networkPatterns: Pattern[] = [
  // Node.js system errors
  {
    name: "econnrefused",
    category: "network-error",
    regex: /\bECONNREFUSED\b/,
    confidence: 0.95,
  },
  {
    name: "econnreset",
    category: "network-error",
    regex: /\bECONNRESET\b/,
    confidence: 0.95,
  },
  {
    name: "etimedout",
    category: "network-error",
    regex: /\bETIMEDOUT\b/,
    confidence: 0.95,
  },
  {
    name: "enotfound",
    category: "network-error",
    regex: /\bENOTFOUND\b/,
    confidence: 0.95,
  },
  {
    name: "epipe",
    category: "network-error",
    regex: /\bEPIPE\b/,
    confidence: 0.9,
  },
  {
    name: "eaddrinuse",
    category: "network-error",
    regex: /\bEADDRINUSE\b/,
    confidence: 0.95,
  },

  // Connection strings / URLs with ports
  {
    name: "connection-refused-with-address",
    category: "network-error",
    regex: /connect(?:ion)?\s+(?:refused|failed|timed?\s*out)\s+(?:to\s+)?[\d.]+:\d+/i,
    confidence: 0.9,
  },

  // DNS
  {
    name: "dns-resolution-failed",
    category: "network-error",
    regex: /\bgetaddrinfo\b|\bDNS\s+(?:resolution|lookup)\s+failed/i,
    confidence: 0.9,
  },

  // TLS / SSL
  {
    name: "tls-error",
    category: "network-error",
    regex: /\b(?:SSL|TLS)(?:Error|_ERROR)\b|\bcertificate\s+(?:verify|validation)\s+failed/i,
    confidence: 0.85,
  },

  // HTTP client internals
  {
    name: "axios-error",
    category: "network-error",
    regex: /\bAxiosError\b/,
    confidence: 0.9,
  },
  {
    name: "fetch-failed",
    category: "network-error",
    regex: /\bTypeError:\s+fetch\s+failed\b/,
    confidence: 0.9,
  },

  // Python network errors
  {
    name: "python-connection-error",
    category: "network-error",
    regex: /\b(?:ConnectionRefusedError|ConnectionResetError|ConnectionAbortedError|TimeoutError)\b/,
    confidence: 0.9,
  },
  {
    name: "python-requests-error",
    category: "network-error",
    regex: /\brequests\.exceptions\.\w+/,
    confidence: 0.95,
  },
  {
    name: "python-httpx-error",
    category: "network-error",
    regex: /\bhttpx\.\w*Error\b/,
    confidence: 0.9,
  },
];

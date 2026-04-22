import type { Pattern } from "../types";

/**
 * Patterns for detecting stack traces from various languages and runtimes.
 */
export const stackTracePatterns: Pattern[] = [
  // JavaScript / Node.js / V8
  {
    name: "js-stack-trace",
    category: "stack-trace",
    regex: /\bat\s+[\w$.]+\s+\([\w/\\.:]+:\d+:\d+\)/,
    confidence: 0.95,
  },
  {
    name: "js-stack-anonymous",
    category: "stack-trace",
    regex: /\bat\s+(?:async\s+)?(?:Object|Module|Function)\.\w+\s+\(/,
    confidence: 0.9,
  },
  {
    name: "node-internal-path",
    category: "stack-trace",
    regex: /\bat\s+.*node:internal\//,
    confidence: 0.95,
  },

  // Python
  {
    name: "python-traceback",
    category: "stack-trace",
    regex: /Traceback \(most recent call last\)/,
    confidence: 0.99,
  },
  {
    name: "python-file-line",
    category: "stack-trace",
    regex: /File "[\w/\\.:]+", line \d+, in \w+/,
    confidence: 0.95,
  },

  // Java / JVM
  {
    name: "java-stack-trace",
    category: "stack-trace",
    regex: /\bat\s+[\w$.]+\([\w]+\.java:\d+\)/,
    confidence: 0.95,
  },
  {
    name: "java-caused-by",
    category: "stack-trace",
    regex: /Caused by:\s+[\w.]+Exception/,
    confidence: 0.95,
  },

  // Go
  {
    name: "go-goroutine",
    category: "stack-trace",
    // Space inside [\w ] is intentional — Go goroutine states include spaces
    // like [running], [IO wait], [select], [chan receive]
    regex: /goroutine \d+ \[[\w ]+\]:/,
    confidence: 0.95,
  },
  {
    name: "go-stack-frame",
    category: "stack-trace",
    regex: /[\w/]+\.go:\d+ \+0x[0-9a-f]+/,
    confidence: 0.9,
  },

  // Ruby
  {
    name: "ruby-stack-trace",
    category: "stack-trace",
    regex: /[\w/]+\.rb:\d+:in `\w+'/,
    confidence: 0.95,
  },

  // .NET / C#
  {
    name: "dotnet-stack-trace",
    category: "stack-trace",
    regex: /\bat\s+[\w.]+\(.*\)\s+in\s+[\w/\\.:]+:line\s+\d+/,
    confidence: 0.95,
  },

  // Generic: the "Error:" + "at " combo
  {
    name: "generic-error-at",
    category: "stack-trace",
    regex: /^(?:[\w.]*Error|[\w.]*Exception):\s+.+\n\s+at\s+/m,
    confidence: 0.9,
  },
];

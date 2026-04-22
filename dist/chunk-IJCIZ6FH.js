// src/patterns/stacktraces.ts
var stackTracePatterns = [
  // JavaScript / Node.js / V8
  {
    name: "js-stack-trace",
    category: "stack-trace",
    regex: /\bat\s+[\w$.]+\s+\([\w/\\.:]+:\d+:\d+\)/,
    confidence: 0.95
  },
  {
    name: "js-stack-anonymous",
    category: "stack-trace",
    regex: /\bat\s+(?:async\s+)?(?:Object|Module|Function)\.\w+\s+\(/,
    confidence: 0.9
  },
  {
    name: "node-internal-path",
    category: "stack-trace",
    regex: /\bat\s+.*node:internal\//,
    confidence: 0.95
  },
  // Python
  {
    name: "python-traceback",
    category: "stack-trace",
    regex: /Traceback \(most recent call last\)/,
    confidence: 0.99
  },
  {
    name: "python-file-line",
    category: "stack-trace",
    regex: /File "[\w/\\.:]+", line \d+, in \w+/,
    confidence: 0.95
  },
  // Java / JVM
  {
    name: "java-stack-trace",
    category: "stack-trace",
    regex: /\bat\s+[\w$.]+\([\w]+\.java:\d+\)/,
    confidence: 0.95
  },
  {
    name: "java-caused-by",
    category: "stack-trace",
    regex: /Caused by:\s+[\w.]+Exception/,
    confidence: 0.95
  },
  // Go
  {
    name: "go-goroutine",
    category: "stack-trace",
    regex: /goroutine \d+ \[[\w ]+\]:/,
    confidence: 0.95
  },
  {
    name: "go-stack-frame",
    category: "stack-trace",
    regex: /[\w/]+\.go:\d+ \+0x[0-9a-f]+/,
    confidence: 0.9
  },
  // Ruby
  {
    name: "ruby-stack-trace",
    category: "stack-trace",
    regex: /[\w/]+\.rb:\d+:in `\w+'/,
    confidence: 0.95
  },
  // .NET / C#
  {
    name: "dotnet-stack-trace",
    category: "stack-trace",
    regex: /\bat\s+[\w.]+\(.*\)\s+in\s+[\w/\\.:]+:line\s+\d+/,
    confidence: 0.95
  },
  // Generic: the "Error:" + "at " combo
  {
    name: "generic-error-at",
    category: "stack-trace",
    regex: /^(?:[\w.]*Error|[\w.]*Exception):\s+.+\n\s+at\s+/m,
    confidence: 0.9
  }
];

// src/patterns/database.ts
var databasePatterns = [
  // SQL statements (multi-keyword to avoid false positives with common English)
  {
    name: "sql-select-from",
    category: "database-error",
    // Case-sensitive: real SQL errors have uppercase keywords.
    // Avoids matching "Select a template from the list".
    regex: /\bSELECT\b[\s\S]*\bFROM\b/,
    confidence: 0.85
  },
  {
    name: "sql-insert-into",
    category: "database-error",
    regex: /\bINSERT\s+INTO\b/i,
    confidence: 0.9
  },
  {
    name: "sql-update-set",
    category: "database-error",
    // Case-sensitive to avoid matching "update your settings"
    regex: /\bUPDATE\b[\s\S]*\bSET\b/,
    confidence: 0.85
  },
  {
    name: "sql-delete-from",
    category: "database-error",
    regex: /\bDELETE\s+FROM\b/i,
    confidence: 0.9
  },
  {
    name: "sql-alter-table",
    category: "database-error",
    regex: /\bALTER\s+TABLE\b/i,
    confidence: 0.95
  },
  {
    name: "sql-drop-table",
    category: "database-error",
    regex: /\bDROP\s+TABLE\b/i,
    confidence: 0.95
  },
  {
    name: "sql-create-table",
    category: "database-error",
    regex: /\bCREATE\s+TABLE\b/i,
    confidence: 0.95
  },
  // PostgreSQL
  {
    name: "postgres-error-code",
    category: "database-error",
    regex: /\bpsycopg[23]?\.errors\.\w+/,
    confidence: 0.99
  },
  {
    name: "postgres-relation",
    category: "database-error",
    regex: /relation ['"][\w.]+['"] does not exist/,
    confidence: 0.95
  },
  {
    name: "postgres-column",
    category: "database-error",
    regex: /column "[\w.]+" (?:does not exist|of relation)/,
    confidence: 0.95
  },
  {
    name: "postgres-constraint",
    category: "database-error",
    regex: /violates (?:unique|foreign key|check|not-null) constraint/,
    confidence: 0.9
  },
  // MySQL
  {
    name: "mysql-error",
    category: "database-error",
    regex: /\bER_\w+:\s/,
    confidence: 0.9
  },
  {
    name: "mysql-errno",
    category: "database-error",
    regex: /errno:\s*\d+/i,
    confidence: 0.7
  },
  // SQLite
  {
    name: "sqlite-error",
    category: "database-error",
    regex: /\bSQLITE_\w+/,
    confidence: 0.9
  },
  // MongoDB
  {
    name: "mongo-error",
    category: "database-error",
    regex: /\bMongoError\b|\bMongoServerError\b/,
    confidence: 0.95
  },
  // Redis
  {
    name: "redis-error",
    category: "database-error",
    regex: /\bReplyError\b|\bRedisError\b/,
    confidence: 0.9
  },
  {
    name: "redis-command-error",
    category: "database-error",
    regex: /\bERR\s+(?:wrong number of arguments|unknown command|syntax error)/i,
    confidence: 0.85
  }
];

// src/patterns/network.ts
var networkPatterns = [
  // Node.js system errors
  {
    name: "econnrefused",
    category: "network-error",
    regex: /\bECONNREFUSED\b/,
    confidence: 0.95
  },
  {
    name: "econnreset",
    category: "network-error",
    regex: /\bECONNRESET\b/,
    confidence: 0.95
  },
  {
    name: "etimedout",
    category: "network-error",
    regex: /\bETIMEDOUT\b/,
    confidence: 0.95
  },
  {
    name: "enotfound",
    category: "network-error",
    regex: /\bENOTFOUND\b/,
    confidence: 0.95
  },
  {
    name: "epipe",
    category: "network-error",
    regex: /\bEPIPE\b/,
    confidence: 0.9
  },
  {
    name: "eaddrinuse",
    category: "network-error",
    regex: /\bEADDRINUSE\b/,
    confidence: 0.95
  },
  // Connection strings / URLs with ports
  {
    name: "connection-refused-with-address",
    category: "network-error",
    regex: /connect(?:ion)?\s+(?:refused|failed|timed?\s*out)\s+(?:to\s+)?[\d.]+:\d+/i,
    confidence: 0.9
  },
  // DNS
  {
    name: "dns-resolution-failed",
    category: "network-error",
    regex: /\bgetaddrinfo\b|\bDNS\s+(?:resolution|lookup)\s+failed/i,
    confidence: 0.9
  },
  // TLS / SSL
  {
    name: "tls-error",
    category: "network-error",
    regex: /\b(?:SSL|TLS)(?:Error|_ERROR)\b|\bcertificate\s+(?:verify|validation)\s+failed/i,
    confidence: 0.85
  },
  // HTTP client internals
  {
    name: "axios-error",
    category: "network-error",
    regex: /\bAxiosError\b/,
    confidence: 0.9
  },
  {
    name: "fetch-failed",
    category: "network-error",
    regex: /\bTypeError:\s+fetch\s+failed\b/,
    confidence: 0.9
  },
  // Python network errors
  {
    name: "python-connection-error",
    category: "network-error",
    regex: /\b(?:ConnectionRefusedError|ConnectionResetError|ConnectionAbortedError|TimeoutError)\b/,
    confidence: 0.9
  },
  {
    name: "python-requests-error",
    category: "network-error",
    regex: /\brequests\.exceptions\.\w+/,
    confidence: 0.95
  },
  {
    name: "python-httpx-error",
    category: "network-error",
    regex: /\bhttpx\.\w*Error\b/,
    confidence: 0.9
  }
];

// src/patterns/misc.ts
var miscPatterns = [
  // Exception class names (ClassName: message)
  {
    name: "exception-class-colon",
    category: "exception-class",
    regex: /^[\w.]*(?:Error|Exception|Fault|Failure):\s/,
    confidence: 0.85
  },
  {
    name: "python-exception-class",
    category: "exception-class",
    regex: /\b(?:TypeError|ValueError|KeyError|AttributeError|ImportError|RuntimeError|IndexError|NameError|FileNotFoundError|PermissionError|OSError|IOError)\b/,
    confidence: 0.8
  },
  {
    name: "java-exception-class",
    category: "exception-class",
    regex: /\b(?:NullPointerException|ClassCastException|IllegalArgumentException|IllegalStateException|ArrayIndexOutOfBoundsException|ClassNotFoundException|NoSuchMethodException|UnsupportedOperationException)\b/,
    confidence: 0.9
  },
  // File paths that look like source code
  {
    name: "unix-source-path",
    category: "file-path",
    regex: /\/(?:usr|app|src|var|home|opt)\/[\w/.-]+\.\w{1,4}(?::\d+)?/,
    confidence: 0.8
  },
  {
    name: "windows-source-path",
    category: "file-path",
    regex: /[A-Z]:\\[\w\\.-]+\.\w{1,4}(?::\d+)?/,
    confidence: 0.8
  },
  {
    name: "node-modules-path",
    category: "file-path",
    regex: /node_modules\/[\w@/.-]+/,
    confidence: 0.9
  },
  // Serialized data / object dumps
  {
    name: "json-object-dump",
    category: "serialized-data",
    regex: /^\s*\{[\s\S]*"(?:error|message|code|status|detail)":\s/m,
    confidence: 0.6
  },
  {
    name: "python-repr",
    category: "serialized-data",
    regex: /<[\w.]+\s+object\s+at\s+0x[0-9a-f]+>/i,
    confidence: 0.95
  },
  // Cloud provider errors
  {
    name: "aws-error",
    category: "cloud-error",
    regex: /\b(?:AccessDeniedException|ResourceNotFoundException|ServiceUnavailableException|ThrottlingException)\b/,
    confidence: 0.85
  },
  {
    name: "gcp-error",
    category: "cloud-error",
    regex: /\bgoogle\.api_core\.exceptions\.\w+/,
    confidence: 0.95
  },
  {
    name: "azure-error",
    category: "cloud-error",
    regex: /\bAzure\.\w+\.(?:Models\.)?[\w]+Error\b/,
    confidence: 0.85
  },
  // ORM errors
  {
    name: "prisma-error",
    category: "orm-error",
    regex: /\bPrisma(?:Client)?(?:Known|Unknown)?RequestError\b/,
    confidence: 0.95
  },
  {
    name: "prisma-error-code",
    category: "orm-error",
    regex: /\bP\d{4}\b/,
    confidence: 0.7
  },
  {
    name: "sqlalchemy-error",
    category: "orm-error",
    regex: /\bsqlalchemy\.exc\.\w+/,
    confidence: 0.95
  },
  {
    name: "activerecord-error",
    category: "orm-error",
    regex: /\bActiveRecord::[\w:]+Error\b/,
    confidence: 0.9
  },
  {
    name: "hibernate-error",
    category: "orm-error",
    regex: /\borg\.hibernate\.\w+Exception\b/,
    confidence: 0.9
  }
];

// src/patterns/index.ts
var allPatterns = [
  ...stackTracePatterns,
  ...databasePatterns,
  ...networkPatterns,
  ...miscPatterns
];

// src/detect.ts
function classify(message, extraPatterns) {
  if (!message || typeof message !== "string") {
    return {
      technical: false,
      category: null,
      confidence: 0,
      matchedPattern: null
    };
  }
  const patterns = extraPatterns ? [...allPatterns, ...extraPatterns] : allPatterns;
  let bestMatch = {
    technical: false,
    category: null,
    confidence: 0,
    matchedPattern: null
  };
  for (const pattern of patterns) {
    if (pattern.regex.test(message)) {
      if (pattern.confidence > bestMatch.confidence) {
        bestMatch = {
          technical: true,
          category: pattern.category,
          confidence: pattern.confidence,
          matchedPattern: pattern.name
        };
      }
    }
  }
  return bestMatch;
}
function isTechnical(message, threshold = 0.5, extraPatterns) {
  const result = classify(message, extraPatterns);
  return result.confidence >= threshold;
}
function isHumanFriendly(message, threshold = 0.5, extraPatterns) {
  return !isTechnical(message, threshold, extraPatterns);
}

// src/sanitize.ts
var DEFAULT_FALLBACK = "Something went wrong. Please try again.";
function extractMessage(error) {
  if (error === null || error === void 0) return null;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return null;
}
function sanitize(error, options) {
  const opts = typeof options === "string" ? { fallback: options } : options ?? {};
  const fallback = opts.fallback ?? DEFAULT_FALLBACK;
  const threshold = opts.threshold ?? 0.5;
  const message = extractMessage(error);
  if (!message) return fallback;
  if (message.trim() === "") return fallback;
  const result = classify(message, opts.extraPatterns);
  if (result.confidence >= threshold) return fallback;
  return message;
}

export {
  stackTracePatterns,
  databasePatterns,
  networkPatterns,
  miscPatterns,
  allPatterns,
  classify,
  isTechnical,
  isHumanFriendly,
  sanitize
};
//# sourceMappingURL=chunk-IJCIZ6FH.js.map
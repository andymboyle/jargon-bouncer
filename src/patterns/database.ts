import type { Pattern } from "../types";

/**
 * Patterns for detecting database error messages.
 */
export const databasePatterns: Pattern[] = [
  // SQL statements (multi-keyword to avoid false positives with common English)
  {
    name: "sql-select-from",
    category: "database-error",
    // Case-sensitive: real SQL errors have uppercase keywords.
    // Avoids matching "Select a template from the list".
    regex: /\bSELECT\b[\s\S]*\bFROM\b/,
    confidence: 0.85,
  },
  {
    name: "sql-insert-into",
    category: "database-error",
    regex: /\bINSERT\s+INTO\b/i,
    confidence: 0.9,
  },
  {
    name: "sql-update-set",
    category: "database-error",
    // Case-sensitive to avoid matching "update your settings"
    regex: /\bUPDATE\b[\s\S]*\bSET\b/,
    confidence: 0.85,
  },
  {
    name: "sql-delete-from",
    category: "database-error",
    regex: /\bDELETE\s+FROM\b/i,
    confidence: 0.9,
  },
  {
    name: "sql-alter-table",
    category: "database-error",
    regex: /\bALTER\s+TABLE\b/i,
    confidence: 0.95,
  },
  {
    name: "sql-drop-table",
    category: "database-error",
    regex: /\bDROP\s+TABLE\b/i,
    confidence: 0.95,
  },
  {
    name: "sql-create-table",
    category: "database-error",
    regex: /\bCREATE\s+TABLE\b/i,
    confidence: 0.95,
  },

  // PostgreSQL
  {
    name: "postgres-error-code",
    category: "database-error",
    regex: /\bpsycopg[23]?\.errors\.\w+/,
    confidence: 0.99,
  },
  {
    name: "postgres-relation",
    category: "database-error",
    regex: /relation ['"][\w.]+['"] does not exist/,
    confidence: 0.95,
  },
  {
    name: "postgres-column",
    category: "database-error",
    regex: /column "[\w.]+" (?:does not exist|of relation)/,
    confidence: 0.95,
  },
  {
    name: "postgres-constraint",
    category: "database-error",
    regex: /violates (?:unique|foreign key|check|not-null) constraint/,
    confidence: 0.9,
  },

  // MySQL
  {
    name: "mysql-error",
    category: "database-error",
    regex: /\bER_\w+:\s/,
    confidence: 0.9,
  },
  {
    name: "mysql-errno",
    category: "database-error",
    regex: /errno:\s*\d+/i,
    confidence: 0.7,
  },

  // SQLite
  {
    name: "sqlite-error",
    category: "database-error",
    regex: /\bSQLITE_\w+/,
    confidence: 0.9,
  },

  // MongoDB
  {
    name: "mongo-error",
    category: "database-error",
    regex: /\bMongoError\b|\bMongoServerError\b/,
    confidence: 0.95,
  },

  // Redis
  {
    name: "redis-error",
    category: "database-error",
    regex: /\bReplyError\b|\bRedisError\b/,
    confidence: 0.9,
  },
  {
    name: "redis-command-error",
    category: "database-error",
    regex: /\bERR\s+(?:wrong number of arguments|unknown command|syntax error)/i,
    confidence: 0.85,
  },
];

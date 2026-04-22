# Changelog

## 0.1.0 (2026-04-22)

### Features

- **81 detection patterns** across 8 languages and 15+ frameworks
  - Stack traces: JavaScript/V8, Python, Java, Go, Ruby, .NET, Rust, PHP
  - Database errors: PostgreSQL, MySQL, SQLite, MongoDB, Redis, raw SQL
  - Network errors: ECONNREFUSED, ETIMEDOUT, DNS, TLS/SSL, CORS, AxiosError
  - Browser errors: CORS blocked, JSON parse failures, heap OOM, stack overflow
  - ORM errors: Prisma, SQLAlchemy, ActiveRecord, Hibernate, PDO
  - Cloud errors: AWS, GCP, Azure SDK exceptions
  - Exception class names: Python, Java, and generic patterns
  - File paths, serialized data, Python repr objects

- **Core API**: `classify()`, `isTechnical()`, `isHumanFriendly()`, `sanitize()`
- **tRPC preset**: `sanitizeTRPC()` with error code mapping
- **Custom patterns**: extend with your own via `extraPatterns`
- **Confidence scoring**: 0-1 scale with configurable threshold
- **Zero dependencies**

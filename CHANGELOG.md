# Changelog

## 0.1.0 (2026-04-23)

### Features

- **122 detection patterns** across 8 languages and 20+ frameworks
  - Stack traces: JavaScript/V8, Python, Java, Go, Ruby, .NET, Rust, PHP
  - Database errors: PostgreSQL, MySQL, SQLite, MongoDB, Redis, raw SQL
  - Network errors: ECONNREFUSED, ETIMEDOUT, DNS, TLS/SSL, CORS, AxiosError, gRPC
  - Browser errors: CORS blocked, JSON parse failures, heap OOM, stack overflow
  - ORM errors: Prisma, SQLAlchemy, ActiveRecord, Hibernate, TypeORM, Sequelize, Drizzle, PDO
  - Framework errors: Django, Laravel/Eloquent, Spring
  - Cloud/infra errors: AWS, GCP, Azure, Kubernetes, Docker
  - Exception class names: Python, Java, GraphQL, and generic patterns
  - File paths, serialized data, Python repr objects
  - Message length heuristic (>500 chars)

- **Core API**: `classify()`, `isTechnical()`, `isHumanFriendly()`, `sanitize()`
- **tRPC preset**: `sanitizeTRPC()` with error code mapping
- **Custom patterns**: extend with your own via `extraPatterns`
- **Confidence scoring**: 0-1 scale with configurable threshold
- **Zero dependencies**
- **211 tests** including real-world stress testing with production error messages

import type { Pattern } from "../types";

/**
 * Patterns for detecting error messages from popular web frameworks
 * and ORMs beyond the core set (Prisma, SQLAlchemy, ActiveRecord, Hibernate).
 */
export const frameworkPatterns: Pattern[] = [
  // Django (Python)
  {
    name: "django-db-error",
    category: "orm-error",
    regex: /\bdjango\.db\.utils\.\w+Error\b/,
    confidence: 0.95,
  },
  {
    name: "django-core-error",
    category: "exception-class",
    regex: /\bdjango\.core\.exceptions\.\w+/,
    confidence: 0.9,
  },
  {
    name: "django-validation-error",
    category: "orm-error",
    regex: /\bdjango\.forms\.\w*ValidationError\b/,
    confidence: 0.85,
  },
  {
    name: "django-import-error",
    category: "exception-class",
    regex: /\bdjango\.core\.management\.base\.CommandError\b/,
    confidence: 0.9,
  },

  // Laravel / Eloquent (PHP)
  {
    name: "laravel-query-exception",
    category: "orm-error",
    regex: /\bIlluminate\\Database\\QueryException\b/,
    confidence: 0.95,
  },
  {
    name: "laravel-model-not-found",
    category: "orm-error",
    regex: /\bIlluminate\\Database\\Eloquent\\ModelNotFoundException\b/,
    confidence: 0.95,
  },
  {
    name: "laravel-validation",
    category: "exception-class",
    regex: /\bIlluminate\\Validation\\ValidationException\b/,
    confidence: 0.9,
  },
  {
    name: "laravel-auth-exception",
    category: "exception-class",
    regex: /\bIlluminate\\Auth\\AuthenticationException\b/,
    confidence: 0.9,
  },
  {
    name: "laravel-namespace",
    category: "exception-class",
    // Catches any Illuminate\* exception class
    regex: /\bIlluminate\\[\w\\]+Exception\b/,
    confidence: 0.85,
  },

  // TypeORM (Node.js)
  {
    name: "typeorm-query-failed",
    category: "orm-error",
    regex: /\bQueryFailedError\b/,
    confidence: 0.9,
  },
  {
    name: "typeorm-entity-not-found",
    category: "orm-error",
    regex: /\bEntityNotFoundError\b/,
    confidence: 0.9,
  },
  {
    name: "typeorm-connection-error",
    category: "orm-error",
    regex: /\bTypeORMError\b/,
    confidence: 0.9,
  },
  {
    name: "typeorm-migration",
    category: "orm-error",
    regex: /\bMigrationExecutor\b|\bmigration.*already.*applied\b/i,
    confidence: 0.85,
  },

  // Spring (Java)
  {
    name: "spring-data-integrity",
    category: "orm-error",
    regex: /\bDataIntegrityViolationException\b/,
    confidence: 0.95,
  },
  {
    name: "spring-dao-exception",
    category: "orm-error",
    regex: /\borg\.springframework\.dao\.\w+Exception\b/,
    confidence: 0.95,
  },
  {
    name: "spring-web-exception",
    category: "exception-class",
    regex: /\borg\.springframework\.web\.\w+\.\w+Exception\b/,
    confidence: 0.9,
  },
  {
    name: "spring-security-exception",
    category: "exception-class",
    regex: /\borg\.springframework\.security\.\w+Exception\b/,
    confidence: 0.9,
  },
  {
    name: "spring-bean-exception",
    category: "exception-class",
    regex: /\bBeanCreationException\b|\bNoSuchBeanDefinitionException\b/,
    confidence: 0.95,
  },
  {
    name: "hibernate-lazy-init",
    category: "orm-error",
    regex: /\bLazyInitializationException\b/,
    confidence: 0.95,
  },

  // Drizzle ORM (Node.js)
  {
    name: "drizzle-error",
    category: "orm-error",
    regex: /\bDrizzleError\b/,
    confidence: 0.9,
  },

  // Sequelize (Node.js)
  {
    name: "sequelize-error",
    category: "orm-error",
    regex: /\bSequelize\w*Error\b/,
    confidence: 0.9,
  },
  {
    name: "sequelize-validation",
    category: "orm-error",
    regex: /\bSequelizeValidationError\b|\bSequelizeUniqueConstraintError\b/,
    confidence: 0.9,
  },
];

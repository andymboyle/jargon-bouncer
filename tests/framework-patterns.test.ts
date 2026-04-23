import { describe, expect, test } from "vitest";
import { classify, isTechnical, isHumanFriendly } from "../src";

describe("Django errors", () => {
  test("detects django.db.utils error", () => {
    const result = classify(
      "django.db.utils.IntegrityError: duplicate key value violates unique constraint",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("orm-error");
  });

  test("detects django.db.utils.OperationalError", () => {
    expect(
      isTechnical("django.db.utils.OperationalError: could not connect to server"),
    ).toBe(true);
  });

  test("detects django.core.exceptions", () => {
    expect(
      isTechnical("django.core.exceptions.ImproperlyConfigured: SECRET_KEY must not be empty"),
    ).toBe(true);
  });
});

describe("Laravel / Eloquent errors", () => {
  test("detects QueryException", () => {
    const result = classify(
      "Illuminate\\Database\\QueryException: SQLSTATE[42S02]: Base table or view not found",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("orm-error");
  });

  test("detects ModelNotFoundException", () => {
    expect(
      isTechnical("Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\User]"),
    ).toBe(true);
  });

  test("detects ValidationException", () => {
    expect(
      isTechnical("Illuminate\\Validation\\ValidationException: The given data was invalid."),
    ).toBe(true);
  });

  test("detects AuthenticationException", () => {
    expect(
      isTechnical("Illuminate\\Auth\\AuthenticationException: Unauthenticated."),
    ).toBe(true);
  });

  test("detects generic Illuminate exception", () => {
    expect(
      isTechnical("Illuminate\\Http\\Exceptions\\ThrottleRequestsException: Too Many Attempts."),
    ).toBe(true);
  });
});

describe("TypeORM errors", () => {
  test("detects QueryFailedError", () => {
    const result = classify(
      'QueryFailedError: relation "users" does not exist',
    );
    expect(result.technical).toBe(true);
  });

  test("detects EntityNotFoundError", () => {
    expect(
      isTechnical('EntityNotFoundError: Could not find any entity of type "User" matching'),
    ).toBe(true);
  });

  test("detects TypeORMError", () => {
    expect(isTechnical("TypeORMError: Connection is not established")).toBe(true);
  });
});

describe("Spring / Java framework errors", () => {
  test("detects DataIntegrityViolationException", () => {
    const result = classify(
      "org.springframework.dao.DataIntegrityViolationException: could not execute statement",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("orm-error");
  });

  test("detects Spring DAO exception", () => {
    expect(
      isTechnical("org.springframework.dao.EmptyResultDataAccessException: Incorrect result size"),
    ).toBe(true);
  });

  test("detects Spring Security exception", () => {
    expect(
      isTechnical("org.springframework.security.AccessDeniedException: Access is denied"),
    ).toBe(true);
  });

  test("detects BeanCreationException", () => {
    expect(
      isTechnical("BeanCreationException: Error creating bean with name 'userService'"),
    ).toBe(true);
  });

  test("detects LazyInitializationException", () => {
    expect(
      isTechnical("LazyInitializationException: could not initialize proxy - no Session"),
    ).toBe(true);
  });
});

describe("Sequelize errors", () => {
  test("detects SequelizeDatabaseError", () => {
    expect(isTechnical("SequelizeDatabaseError: column 'foo' does not exist")).toBe(true);
  });

  test("detects SequelizeUniqueConstraintError", () => {
    expect(isTechnical("SequelizeUniqueConstraintError: Validation error")).toBe(true);
  });
});

describe("framework false positive checks", () => {
  test("normal messages with framework-adjacent words pass through", () => {
    expect(isHumanFriendly("Your database has been updated")).toBe(true);
    expect(isHumanFriendly("The migration completed successfully")).toBe(true);
    expect(isHumanFriendly("Authentication required")).toBe(true);
    expect(isHumanFriendly("Query returned no results")).toBe(true);
    expect(isHumanFriendly("Please illuminate the issue by providing more details")).toBe(true);
    expect(isHumanFriendly("Spring cleaning sale — 50% off")).toBe(true);
    expect(isHumanFriendly("Hibernate your device to save battery")).toBe(true);
    expect(isHumanFriendly("This bean counter is very efficient")).toBe(true);
  });
});

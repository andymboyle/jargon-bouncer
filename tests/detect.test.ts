import { describe, expect, test } from "vitest";
import { classify, isTechnical, isHumanFriendly } from "../src";

describe("classify", () => {
  describe("stack traces", () => {
    test("detects JavaScript stack trace", () => {
      const result = classify(
        "TypeError: Cannot read property 'id' of undefined\n    at UserService.getUser (/app/src/services/user.ts:42:15)",
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("stack-trace");
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test("detects Python traceback", () => {
      const result = classify(
        'Traceback (most recent call last):\n  File "/app/main.py", line 42, in handle_request',
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("stack-trace");
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test("detects Java stack trace", () => {
      const result = classify(
        "java.lang.NullPointerException\n\tat com.example.UserService.getUser(UserService.java:42)",
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("stack-trace");
    });

    test("detects Go goroutine trace", () => {
      const result = classify("goroutine 1 [running]:\nmain.go:42 +0x1a4");
      expect(result.technical).toBe(true);
      expect(result.category).toBe("stack-trace");
    });

    test("detects Ruby stack trace", () => {
      const result = classify(
        "app/models/user.rb:42:in `find_by_email'",
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("stack-trace");
    });
  });

  describe("database errors", () => {
    test("detects PostgreSQL relation error", () => {
      const result = classify(
        'relation "users" does not exist',
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("database-error");
    });

    test("detects psycopg error", () => {
      const result = classify(
        "psycopg2.errors.UndefinedTable: relation 'accounts' does not exist",
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("database-error");
    });

    test("detects SQL statement (SELECT...FROM)", () => {
      const result = classify(
        'ERROR: column "name" does not exist in SELECT id, name FROM users',
      );
      expect(result.technical).toBe(true);
    });

    test("does NOT flag 'from' in normal English", () => {
      const result = classify("Choose a template from the list");
      expect(result.technical).toBe(false);
    });

    test("detects MongoDB error", () => {
      const result = classify("MongoServerError: E11000 duplicate key error");
      expect(result.technical).toBe(true);
      expect(result.category).toBe("database-error");
    });
  });

  describe("network errors", () => {
    test("detects ECONNREFUSED", () => {
      const result = classify("Error: connect ECONNREFUSED 127.0.0.1:5432");
      expect(result.technical).toBe(true);
      expect(result.category).toBe("network-error");
    });

    test("detects AxiosError", () => {
      const result = classify("AxiosError: Request failed with status code 500");
      expect(result.technical).toBe(true);
    });

    test("detects Python requests error", () => {
      const result = classify(
        "requests.exceptions.ConnectionError: HTTPConnectionPool",
      );
      expect(result.technical).toBe(true);
    });
  });

  describe("exception class names", () => {
    test("detects Python TypeError", () => {
      const result = classify("TypeError: 'NoneType' object has no attribute 'get'");
      expect(result.technical).toBe(true);
      expect(result.category).toBe("exception-class");
    });

    test("detects Java NullPointerException", () => {
      const result = classify("NullPointerException: Cannot invoke method on null");
      expect(result.technical).toBe(true);
    });
  });

  describe("file paths", () => {
    test("detects Unix source path", () => {
      const result = classify("Error in /usr/src/app/server.js:42");
      expect(result.technical).toBe(true);
      expect(result.category).toBe("file-path");
    });

    test("detects node_modules path", () => {
      const result = classify(
        "Error in node_modules/@prisma/client/runtime/index.js",
      );
      expect(result.technical).toBe(true);
    });
  });

  describe("ORM errors", () => {
    test("detects Prisma error", () => {
      const result = classify(
        "PrismaClientKnownRequestError: Invalid `prisma.user.findUnique()` invocation",
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("orm-error");
    });

    test("detects SQLAlchemy error", () => {
      const result = classify("sqlalchemy.exc.OperationalError: connection refused");
      expect(result.technical).toBe(true);
    });
  });

  describe("serialized data", () => {
    test("detects Python repr object", () => {
      const result = classify(
        "<myapp.models.User object at 0x7f8b8c0b4a90>",
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("serialized-data");
    });

    test("detects JSON error dump", () => {
      const result = classify(
        '{"error": "something broke", "status": 500, "detail": "internal failure"}',
      );
      expect(result.technical).toBe(true);
      expect(result.category).toBe("serialized-data");
    });

    test("does NOT flag normal JSON-like text", () => {
      expect(classify("Please check your settings").technical).toBe(false);
    });
  });

  describe("human-friendly messages", () => {
    test("allows simple user messages", () => {
      const result = classify("Something went wrong. Please try again.");
      expect(result.technical).toBe(false);
      expect(result.confidence).toBe(0);
    });

    test("allows validation messages", () => {
      const result = classify("Email address is required");
      expect(result.technical).toBe(false);
    });

    test("allows business logic messages", () => {
      const result = classify(
        "No seats available. Revoke a seat from another user first.",
      );
      expect(result.technical).toBe(false);
    });

    test("allows messages with common words like 'from' and 'update'", () => {
      expect(classify("Select a template from the list").technical).toBe(false);
      expect(classify("To update or delete a task, use the actions menu").technical).toBe(false);
      expect(classify("Your changes have been saved").technical).toBe(false);
    });

    test("handles empty/null input gracefully", () => {
      expect(classify("").technical).toBe(false);
      expect(classify(null as unknown as string).technical).toBe(false);
      expect(classify(undefined as unknown as string).technical).toBe(false);
    });
  });
});

describe("isTechnical", () => {
  test("returns true for technical messages", () => {
    expect(isTechnical("ECONNREFUSED 127.0.0.1:5432")).toBe(true);
  });

  test("returns false for human-friendly messages", () => {
    expect(isTechnical("Please try again later")).toBe(false);
  });

  test("respects custom threshold", () => {
    // Prisma error code P2002 with context has confidence 0.85
    const msg = "Unique constraint failed on P2002";
    expect(isTechnical(msg, 0.5)).toBe(true);
    expect(isTechnical(msg, 0.9)).toBe(false);
  });
});

describe("isHumanFriendly", () => {
  test("inverse of isTechnical", () => {
    expect(isHumanFriendly("Please try again")).toBe(true);
    expect(isHumanFriendly("ECONNREFUSED 127.0.0.1:5432")).toBe(false);
  });
});

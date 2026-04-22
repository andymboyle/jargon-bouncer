import { describe, expect, test } from "vitest";
import { classify, isTechnical, isHumanFriendly } from "../src";

describe("Rust errors", () => {
  test("detects panic", () => {
    const result = classify(
      "thread 'main' panicked at 'called `Option::unwrap()` on a `None` value', src/main.rs:42:5",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("stack-trace");
    expect(result.confidence).toBeGreaterThan(0.95);
  });

  test("detects Result unwrap error", () => {
    expect(
      isTechnical(
        "called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound }",
      ),
    ).toBe(true);
  });

  test("detects Option unwrap error", () => {
    expect(
      isTechnical("called `Option::unwrap()` on a `None` value"),
    ).toBe(true);
  });

  test("detects Rust backtrace", () => {
    const result = classify(
      "stack backtrace:\n   0: std::panicking::begin_panic\n   1: myapp::handler",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("stack-trace");
  });

  test("does NOT flag normal use of 'thread' or 'panic'", () => {
    expect(isHumanFriendly("Don't panic! Your data is safe.")).toBe(true);
    expect(isHumanFriendly("This thread has been archived")).toBe(true);
  });
});

describe("PHP errors", () => {
  test("detects fatal error with uncaught exception", () => {
    const result = classify(
      "Fatal error: Uncaught TypeError: Argument 1 passed to App\\Service::process() must be of type string",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("stack-trace");
  });

  test("detects PHP stack trace", () => {
    const result = classify(
      "Stack trace:\n#0 /var/www/html/app/Http/Controllers/UserController.php(42): App\\Service->process()",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("stack-trace");
  });

  test("detects PDOException", () => {
    const result = classify(
      "PDOException: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'mydb.users' doesn't exist",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("database-error");
  });

  test("detects error in PHP file with line number", () => {
    expect(
      isTechnical(
        "ErrorException in app/Models/User.php(42): Undefined variable $name",
      ),
    ).toBe(true);
  });

  test("detects error in PHP file with 'on line' format", () => {
    expect(
      isTechnical(
        "Warning: Division by zero in /var/www/html/calculate.php on line 15",
      ),
    ).toBe(true);
  });

  test("does NOT flag normal use of 'fatal' or 'error'", () => {
    expect(isHumanFriendly("This action cannot be undone")).toBe(true);
    expect(isHumanFriendly("A fatal flaw in your reasoning")).toBe(true);
  });
});

describe("GraphQL errors", () => {
  test("detects GraphQLError", () => {
    const result = classify(
      'GraphQLError: Cannot return null for non-nullable field User.email',
    );
    expect(result.technical).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.85);
  });

  test("detects 'cannot query field' error", () => {
    expect(
      isTechnical("Cannot query field 'fullName' on type 'User'"),
    ).toBe(true);
  });

  test("detects variable type error", () => {
    expect(
      isTechnical(
        'Variable "$userId" of type "String!" is not compatible with expected type "ID!"',
      ),
    ).toBe(true);
  });

  test("does NOT flag normal use of 'query' or 'field'", () => {
    expect(isHumanFriendly("Please fill in all required fields")).toBe(true);
    expect(isHumanFriendly("Your search query returned no results")).toBe(true);
  });
});

describe("cross-language false positive checks", () => {
  test("common user-facing messages pass through all new patterns", () => {
    const safeMessages = [
      "Your account has been created successfully",
      "Please check your email for a confirmation link",
      "The file you uploaded is too large",
      "Your session has expired, please log in again",
      "This feature is not available on your current plan",
      "Unable to process your request at this time",
      "Please enter a valid phone number",
      "Your password must be at least 8 characters",
      "The invitation has been sent",
      "Thread updated successfully",
      "No results found for your search",
      "Your changes have been saved",
      "This item has been deleted",
      "Please try again in a few minutes",
      "Maximum number of retries exceeded",
    ];

    for (const msg of safeMessages) {
      expect(isHumanFriendly(msg)).toBe(true);
    }
  });

  test("technical messages from all new languages get caught", () => {
    const technicalMessages = [
      // CORS
      "Access to fetch at 'https://api.example.com' has been blocked by CORS policy",
      // JSON
      "SyntaxError: Unexpected token < in JSON at position 0",
      // Memory
      "JavaScript heap out of memory",
      "Maximum call stack size exceeded",
      // Permissions
      "Error: EACCES: permission denied, open '/etc/passwd'",
      // Rust
      "thread 'tokio-runtime-worker' panicked at 'index out of bounds'",
      // PHP
      "Fatal error: Uncaught Error: Call to undefined function mysql_connect()",
      "PDOException: SQLSTATE[HY000] [2002] Connection refused",
      // GraphQL
      "GraphQLError: Cannot return null for non-nullable field Query.user",
      "Cannot query field 'email' on type 'Post'",
    ];

    for (const msg of technicalMessages) {
      expect(isTechnical(msg)).toBe(true);
    }
  });
});

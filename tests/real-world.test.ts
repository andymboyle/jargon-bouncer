import { describe, expect, test } from "vitest";
import { isTechnical, isHumanFriendly, sanitize, classify } from "../src";

/**
 * Real-world error messages collected from production logs, Sentry reports,
 * GitHub issues, and Stack Overflow. These are the actual strings that end
 * up in toast notifications when someone does `error.message` in a catch block.
 *
 * Every message here is something a real user has seen. If any of these
 * pass through as "human-friendly", we have a gap.
 */
describe("real-world technical errors that MUST be caught", () => {
  const technicalMessages = [
    // Actual Sentry errors from production apps
    `TypeError: Cannot read properties of null (reading 'map')`,
    `TypeError: Cannot destructure property 'data' of 'undefined' as it is undefined.`,
    `TypeError: Failed to fetch`,
    `TypeError: NetworkError when attempting to fetch resource.`,
    `TypeError: Load failed`,

    // Prisma errors that leak through tRPC
    `Invalid \`prisma.user.findUnique()\` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to update not found.`,
    `PrismaClientKnownRequestError: \nInvalid \`prisma.organization.update()\` invocation:\n\n\nUnique constraint failed on the fields: (\`slug\`)`,

    // Python errors that leak through FastAPI
    `Internal Server Error: 'NoneType' object has no attribute 'get'`,
    `KeyError: 'user_id'`,
    `AttributeError: 'dict' object has no attribute 'items'`,
    `ValueError: invalid literal for int() with base 10: 'abc'`,

    // Database errors
    `operator does not exist: text = integer`,
    `null value in column "email" of relation "users" violates not-null constraint`,
    `duplicate key value violates unique constraint "users_email_key"`,

    // Node/Express errors
    `Error: connect ECONNREFUSED 10.0.0.5:5432`,
    `Error: getaddrinfo ENOTFOUND some-service.internal`,
    `Error: read ECONNRESET`,
    `Error: socket hang up`,

    // AWS errors
    `AccessDeniedException: User: arn:aws:iam::123456789:role/my-role is not authorized to perform: s3:GetObject`,
    `ResourceNotFoundException: Requested resource not found`,

    // Docker/infra that sometimes leaks
    `Error response from daemon: conflict: unable to remove repository reference`,

    // Webpack/build errors that sometimes show in dev
    `Module not found: Can't resolve '@/components/Button' in '/app/src/pages'`,

    // Redis
    `ReplyError: WRONGTYPE Operation against a key holding the wrong kind of value`,

    // Multi-line stack traces
    `Error: Request failed with status code 502\n    at createError (node_modules/axios/lib/core/createError.js:16:15)\n    at settle (node_modules/axios/lib/core/settle.js:17:12)`,

    // Temporal/workflow errors
    `WorkflowFailedError: workflow execution already completed`,

    // gRPC-style
    `StatusCode.UNAVAILABLE: failed to connect to all addresses`,

    // Malformed response errors
    `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`,
    `SyntaxError: Unexpected end of JSON input`,
  ];

  test.each(technicalMessages)("catches: %s", (msg) => {
    expect(isTechnical(msg)).toBe(true);
  });

  test("all technical messages get sanitized to fallback", () => {
    for (const msg of technicalMessages) {
      const result = sanitize(msg);
      expect(result).toBe("Something went wrong. Please try again.");
    }
  });
});

/**
 * Real user-facing messages that apps actually show. These come from
 * well-designed error handlers, validation messages, and business logic.
 *
 * If any of these get flagged as technical, we have a false positive.
 */
describe("real-world user messages that MUST pass through", () => {
  const humanMessages = [
    // Validation messages
    "Please enter a valid email address",
    "Password must be at least 8 characters",
    "This field is required",
    "Username is already taken",
    "File size exceeds the maximum limit of 10MB",
    "Please select at least one option",
    "Invalid phone number format",
    "The email address you entered doesn't match our records",

    // Auth/session messages
    "Your session has expired. Please log in again.",
    "Invalid username or password",
    "Your account has been locked. Please contact support.",
    "You need to verify your email before continuing",
    "Two-factor authentication code is incorrect",

    // Business logic messages
    "No seats available. Please contact your administrator.",
    "Your trial has ended. Upgrade to continue.",
    "This feature is not available on your current plan",
    "You've reached the maximum number of projects",
    "This organization has been deactivated",
    "The invitation link has expired",
    "You don't have permission to access this resource",

    // Action confirmations/failures
    "Changes saved successfully",
    "Unable to save changes. Please try again.",
    "The item was deleted successfully",
    "Failed to send the invitation. Please try again later.",
    "Your payment method was declined",
    "The file was uploaded successfully",

    // Search/filter messages
    "No results found for your search",
    "No accounts match the selected filters",
    "Try broadening your search criteria",

    // Network-related but user-friendly
    "Unable to connect. Please check your internet connection.",
    "The server is temporarily unavailable. Please try again later.",
    "Request timed out. Please try again.",

    // Messages containing words that could be SQL/technical
    "Select a plan from the options below",
    "Update your profile information",
    "Delete this item permanently?",
    "Create a new project to get started",
    "Drop us a line at support@example.com",
    "Join the table discussion",
    "Set your preferences in Settings",
    "Insert your card details below",
    "Alter your notification settings here",

    // Messages with technical-sounding but legitimate words
    "Your connection to Salesforce is active",
    "The API key has been revoked",
    "Webhook delivery failed — check your endpoint URL",
    "The integration is currently disconnected",
    "Database backup completed successfully",
    "Your export is ready for download",
  ];

  test.each(humanMessages)("passes through: %s", (msg) => {
    expect(isHumanFriendly(msg)).toBe(true);
  });

  test("all human messages survive sanitize unchanged", () => {
    for (const msg of humanMessages) {
      const result = sanitize(msg);
      expect(result).toBe(msg);
    }
  });
});

/**
 * Edge cases and tricky messages that live on the boundary.
 */
describe("edge cases", () => {
  test("very short messages pass through", () => {
    expect(isHumanFriendly("Error")).toBe(true);
    expect(isHumanFriendly("Failed")).toBe(true);
    expect(isHumanFriendly("OK")).toBe(true);
    expect(isHumanFriendly("Done")).toBe(true);
  });

  test("messages with numbers pass through", () => {
    expect(isHumanFriendly("You have 3 unread notifications")).toBe(true);
    expect(isHumanFriendly("Limit: 100 requests per minute")).toBe(true);
    expect(isHumanFriendly("Step 2 of 5")).toBe(true);
  });

  test("messages with URLs pass through", () => {
    expect(
      isHumanFriendly("Visit https://example.com/help for more information"),
    ).toBe(true);
  });

  test("messages with code-like formatting pass through if short", () => {
    expect(isHumanFriendly("Use the `--force` flag to override")).toBe(true);
  });

  test("sanitize with Error objects works end-to-end", () => {
    const technicalError = new Error(
      "TypeError: Cannot read properties of null (reading 'map')",
    );
    expect(sanitize(technicalError)).toBe(
      "Something went wrong. Please try again.",
    );

    const userError = new Error("Please enter a valid email address");
    expect(sanitize(userError)).toBe("Please enter a valid email address");
  });

  test("sanitize with custom fallback works end-to-end", () => {
    const error = new Error("ECONNREFUSED 127.0.0.1:5432");
    expect(sanitize(error, "Unable to connect to the database.")).toBe(
      "Unable to connect to the database.",
    );
  });

  test("classify gives useful debugging info", () => {
    const result = classify(
      "psycopg2.errors.UndefinedTable: relation 'users' does not exist",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("database-error");
    expect(result.matchedPattern).toBe("postgres-error-code");
    expect(result.confidence).toBe(0.99);
  });
});

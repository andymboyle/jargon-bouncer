import { describe, expect, test } from "vitest";
import { sanitize } from "../src";

describe("sanitize", () => {
  test("returns the message when it looks safe", () => {
    expect(sanitize("Please check your email")).toBe("Please check your email");
  });

  test("returns fallback for technical messages", () => {
    expect(sanitize("ECONNREFUSED 127.0.0.1:5432")).toBe(
      "Something went wrong. Please try again.",
    );
  });

  test("returns fallback for stack traces", () => {
    expect(
      sanitize(
        "TypeError: Cannot read property 'id' of undefined\n    at UserService.getUser (/app/src/services/user.ts:42:15)",
      ),
    ).toBe("Something went wrong. Please try again.");
  });

  test("accepts custom fallback as string", () => {
    expect(sanitize("ECONNREFUSED 127.0.0.1:5432", "Failed to connect.")).toBe(
      "Failed to connect.",
    );
  });

  test("accepts custom fallback in options", () => {
    expect(
      sanitize("ECONNREFUSED", { fallback: "Service unavailable." }),
    ).toBe("Service unavailable.");
  });

  test("handles Error objects", () => {
    const err = new Error("relation 'users' does not exist");
    expect(sanitize(err)).toBe("Something went wrong. Please try again.");
  });

  test("handles objects with message property", () => {
    const err = { message: "Traceback (most recent call last):", code: 500 };
    expect(sanitize(err)).toBe("Something went wrong. Please try again.");
  });

  test("handles null/undefined", () => {
    expect(sanitize(null)).toBe("Something went wrong. Please try again.");
    expect(sanitize(undefined)).toBe("Something went wrong. Please try again.");
  });

  test("handles empty string", () => {
    expect(sanitize("")).toBe("Something went wrong. Please try again.");
    expect(sanitize(new Error(""))).toBe(
      "Something went wrong. Please try again.",
    );
  });

  test("handles non-Error objects without message", () => {
    expect(sanitize(42)).toBe("Something went wrong. Please try again.");
    expect(sanitize({})).toBe("Something went wrong. Please try again.");
    expect(sanitize([])).toBe("Something went wrong. Please try again.");
  });

  test("respects custom threshold", () => {
    // Prisma error code P2002 with context has confidence 0.85 — adjusting threshold changes behavior
    const msg = "Unique constraint failed on P2002";
    expect(sanitize(msg, { threshold: 0.5 })).toBe(
      "Something went wrong. Please try again.",
    );
    expect(sanitize(msg, { threshold: 0.9 })).toBe(msg);
  });

  test("accepts extra patterns", () => {
    const customPattern = {
      name: "custom-internal",
      category: "database-error" as const,
      regex: /CUSTOM_INTERNAL_CODE/,
      confidence: 0.99,
    };
    expect(
      sanitize("CUSTOM_INTERNAL_CODE: something broke", {
        extraPatterns: [customPattern],
      }),
    ).toBe("Something went wrong. Please try again.");
  });
});

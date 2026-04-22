import { describe, expect, test } from "vitest";
import { sanitizeTRPC, TRPC_ERROR_MESSAGES } from "../src/presets/trpc";

describe("sanitizeTRPC", () => {
  describe("known tRPC error codes", () => {
    test("UNAUTHORIZED returns friendly message", () => {
      const error = { data: { code: "UNAUTHORIZED" }, message: "jwt expired" };
      expect(sanitizeTRPC(error)).toBe(
        "Your session has expired. Please sign in again.",
      );
    });

    test("FORBIDDEN returns friendly message", () => {
      const error = { data: { code: "FORBIDDEN" }, message: "not allowed" };
      expect(sanitizeTRPC(error)).toBe(
        "You don't have permission to perform this action.",
      );
    });

    test("NOT_FOUND returns friendly message", () => {
      const error = { data: { code: "NOT_FOUND" }, message: "record missing" };
      expect(sanitizeTRPC(error)).toBe(
        "The requested resource was not found.",
      );
    });

    test("TOO_MANY_REQUESTS returns friendly message", () => {
      const error = {
        data: { code: "TOO_MANY_REQUESTS" },
        message: "rate limited",
      };
      expect(sanitizeTRPC(error)).toBe(
        "Too many requests. Please wait a moment and try again.",
      );
    });

    test("TIMEOUT returns friendly message", () => {
      const error = { data: { code: "TIMEOUT" }, message: "deadline exceeded" };
      expect(sanitizeTRPC(error)).toBe(
        "The request timed out. Please try again.",
      );
    });

    test("all known codes have friendly messages", () => {
      for (const code of Object.keys(TRPC_ERROR_MESSAGES)) {
        const error = { data: { code }, message: "internal stuff" };
        const result = sanitizeTRPC(error);
        expect(result).toBe(TRPC_ERROR_MESSAGES[code]);
      }
    });
  });

  describe("INTERNAL_SERVER_ERROR always uses fallback", () => {
    test("never shows the message, even if it looks safe", () => {
      const error = {
        data: { code: "INTERNAL_SERVER_ERROR" },
        message: "This looks perfectly fine",
      };
      expect(sanitizeTRPC(error)).toBe(
        "Something went wrong. Please try again.",
      );
    });

    test("uses custom fallback when provided", () => {
      const error = {
        data: { code: "INTERNAL_SERVER_ERROR" },
        message: "kaboom",
      };
      expect(sanitizeTRPC(error, "Failed to save.")).toBe("Failed to save.");
    });
  });

  describe("BAD_REQUEST passes through safe messages", () => {
    test("safe validation message passes through", () => {
      const error = {
        data: { code: "BAD_REQUEST" },
        message: "Email address is required",
      };
      expect(sanitizeTRPC(error)).toBe("Email address is required");
    });

    test("technical message gets sanitized", () => {
      const error = {
        data: { code: "BAD_REQUEST" },
        message:
          "TypeError: Cannot read property 'email' of undefined\n    at validate (/app/src/validators.ts:42:15)",
      };
      expect(sanitizeTRPC(error)).toBe(
        "Something went wrong. Please try again.",
      );
    });
  });

  describe("tRPC error code extraction", () => {
    test("extracts from error.data.code", () => {
      const error = { data: { code: "NOT_FOUND" }, message: "gone" };
      expect(sanitizeTRPC(error)).toBe(
        "The requested resource was not found.",
      );
    });

    test("extracts from error.shape.data.code", () => {
      const error = {
        shape: { data: { code: "FORBIDDEN" } },
        message: "nope",
      };
      expect(sanitizeTRPC(error)).toBe(
        "You don't have permission to perform this action.",
      );
    });

    test("extracts from error.code directly", () => {
      const error = { code: "UNAUTHORIZED", message: "expired" };
      expect(sanitizeTRPC(error)).toBe(
        "Your session has expired. Please sign in again.",
      );
    });

    test("falls back to sanitize when no tRPC code found", () => {
      const error = new Error("ECONNREFUSED 127.0.0.1:5432");
      expect(sanitizeTRPC(error)).toBe(
        "Something went wrong. Please try again.",
      );
    });

    test("falls back to sanitize for plain safe messages", () => {
      const error = new Error("Please check your email");
      expect(sanitizeTRPC(error)).toBe("Please check your email");
    });
  });

  describe("options", () => {
    test("accepts string fallback", () => {
      const error = {
        data: { code: "INTERNAL_SERVER_ERROR" },
        message: "boom",
      };
      expect(sanitizeTRPC(error, "Oops!")).toBe("Oops!");
    });

    test("accepts options object", () => {
      const error = {
        data: { code: "INTERNAL_SERVER_ERROR" },
        message: "boom",
      };
      expect(sanitizeTRPC(error, { fallback: "Try again later." })).toBe(
        "Try again later.",
      );
    });

    test("handles null/undefined errors", () => {
      expect(sanitizeTRPC(null)).toBe(
        "Something went wrong. Please try again.",
      );
      expect(sanitizeTRPC(undefined)).toBe(
        "Something went wrong. Please try again.",
      );
    });
  });
});

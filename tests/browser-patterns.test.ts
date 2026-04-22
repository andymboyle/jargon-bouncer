import { describe, expect, test } from "vitest";
import { classify, isTechnical, isHumanFriendly } from "../src";

describe("CORS errors", () => {
  test("detects CORS policy blocked", () => {
    const result = classify(
      "Access to XMLHttpRequest at 'https://api.example.com/data' from origin 'https://app.example.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
    );
    expect(result.technical).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  test("detects missing Access-Control-Allow-Origin", () => {
    const result = classify(
      "No 'Access-Control-Allow-Origin' header is present on the requested resource.",
    );
    expect(result.technical).toBe(true);
  });

  test("detects preflight failure", () => {
    const result = classify(
      "Response to preflight request doesn't pass access control check",
    );
    expect(result.technical).toBe(true);
  });

  test("does NOT flag normal use of 'policy'", () => {
    expect(
      isHumanFriendly("Please review our privacy policy before continuing"),
    ).toBe(true);
  });
});

describe("JSON parse errors", () => {
  test("detects unexpected token in JSON", () => {
    const result = classify(
      "SyntaxError: Unexpected token < in JSON at position 0",
    );
    expect(result.technical).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  test("detects generic JSON parse failure", () => {
    expect(isTechnical("SyntaxError: Expected ',' in JSON at position 42")).toBe(
      true,
    );
  });

  test("detects 'not valid JSON'", () => {
    expect(isTechnical("The response body is not valid JSON")).toBe(true);
  });

  test("does NOT flag normal use of 'JSON'", () => {
    expect(isHumanFriendly("Please upload a valid JSON file")).toBe(true);
  });
});

describe("memory errors", () => {
  test("detects JavaScript heap out of memory", () => {
    const result = classify(
      "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory",
    );
    expect(result.technical).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.95);
  });

  test("detects maximum call stack size exceeded", () => {
    expect(
      isTechnical("RangeError: Maximum call stack size exceeded"),
    ).toBe(true);
  });

  test("detects ENOMEM", () => {
    expect(isTechnical("Error: ENOMEM: not enough memory, read")).toBe(true);
  });
});

describe("permission errors", () => {
  test("detects EACCES", () => {
    expect(
      isTechnical("Error: EACCES: permission denied, open '/var/log/app.log'"),
    ).toBe(true);
  });

  test("detects EPERM", () => {
    expect(
      isTechnical("Error: EPERM: operation not permitted, unlink '/app/data'"),
    ).toBe(true);
  });

  test("does NOT flag normal permission messages", () => {
    expect(
      isHumanFriendly("You don't have permission to access this page"),
    ).toBe(true);
  });
});

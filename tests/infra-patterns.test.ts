import { describe, expect, test } from "vitest";
import { classify, isTechnical, isHumanFriendly } from "../src";

describe("Kubernetes errors", () => {
  test("detects CrashLoopBackOff", () => {
    const result = classify(
      "Pod myapp-7f8b9c6d4-x2k9z is in CrashLoopBackOff",
    );
    expect(result.technical).toBe(true);
    expect(result.category).toBe("cloud-error");
  });

  test("detects OOMKilled", () => {
    expect(isTechnical("Container was OOMKilled: memory limit exceeded")).toBe(
      true,
    );
  });

  test("detects ImagePullBackOff", () => {
    expect(isTechnical("ImagePullBackOff: unable to pull image")).toBe(true);
  });

  test("detects ErrImagePull", () => {
    expect(isTechnical("ErrImagePull: rpc error: code = Unknown")).toBe(true);
  });

  test("detects CreateContainerConfigError", () => {
    expect(
      isTechnical("CreateContainerConfigError: secret 'db-creds' not found"),
    ).toBe(true);
  });
});

describe("Docker errors", () => {
  test("detects container exit code", () => {
    expect(
      isTechnical('container "web" exited with code 137'),
    ).toBe(true);
  });

  test("detects bind address in use", () => {
    expect(
      isTechnical("bind: address already in use"),
    ).toBe(true);
  });

  test("detects no such container", () => {
    expect(isTechnical("No such container: myapp-web-1")).toBe(true);
  });
});

describe("gRPC errors (expanded)", () => {
  test("detects DEADLINE_EXCEEDED", () => {
    expect(isTechnical("DEADLINE_EXCEEDED: Deadline exceeded")).toBe(true);
  });

  test("detects UNAVAILABLE with connection failure", () => {
    expect(
      isTechnical("UNAVAILABLE: failed to connect to all addresses"),
    ).toBe(true);
  });
});

describe("message length heuristic", () => {
  test("flags messages over 500 characters", () => {
    const longMessage = "Error: " + "x".repeat(500);
    const result = classify(longMessage);
    expect(result.technical).toBe(true);
    expect(result.matchedPattern).toBe("message-too-long");
    expect(result.confidence).toBe(0.7);
  });

  test("does NOT flag messages under 500 characters", () => {
    const normalMessage = "Something went wrong. Please try again.";
    expect(isHumanFriendly(normalMessage)).toBe(true);
  });

  test("does NOT flag a 499-char user message", () => {
    const msg = "A".repeat(499);
    const result = classify(msg);
    expect(result.matchedPattern).not.toBe("message-too-long");
  });

  test("flags a realistic long stack trace", () => {
    const stackTrace =
      "Error: Connection failed\n" +
      Array.from(
        { length: 20 },
        (_, i) => `    at Module${i}.handler (/app/src/module${i}.ts:${i + 10}:${i + 5})`,
      ).join("\n");
    expect(isTechnical(stackTrace)).toBe(true);
  });
});

describe("infra false positive checks", () => {
  test("normal messages with infra-adjacent words pass through", () => {
    expect(isHumanFriendly("Your container is ready")).toBe(true);
    expect(isHumanFriendly("Image uploaded successfully")).toBe(true);
    expect(isHumanFriendly("Pod has been scheduled")).toBe(true);
    expect(isHumanFriendly("The deadline for submission is Friday")).toBe(true);
    expect(isHumanFriendly("Please bind your account to continue")).toBe(true);
    expect(isHumanFriendly("Docker integration is enabled")).toBe(true);
  });
});

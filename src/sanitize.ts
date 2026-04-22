import type { Pattern, SanitizeOptions } from "./types";
import { classify } from "./detect";

const DEFAULT_FALLBACK = "Something went wrong. Please try again.";

/**
 * Extract a message string from various error shapes.
 */
function extractMessage(error: unknown): string | null {
  if (error === null || error === undefined) return null;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return null;
}

/**
 * Sanitize an error for user display. Returns the error message if it looks
 * safe to show to a user, or the fallback message if it looks technical.
 *
 * Accepts Error objects, strings, or any object with a `message` property.
 *
 * @param error - The error to sanitize
 * @param options - Fallback message, confidence threshold, extra patterns
 * @returns A user-safe error message
 *
 * @example
 * ```ts
 * // In a catch block or error handler:
 * toast.error(sanitize(error));
 *
 * // With a context-specific fallback:
 * toast.error(sanitize(error, { fallback: "Failed to save. Please try again." }));
 * ```
 */
export function sanitize(
  error: unknown,
  options?: SanitizeOptions | string,
): string {
  // Allow passing just a string as the fallback for convenience
  const opts: SanitizeOptions =
    typeof options === "string" ? { fallback: options } : options ?? {};

  const fallback = opts.fallback ?? DEFAULT_FALLBACK;
  const threshold = opts.threshold ?? 0.5;

  const message = extractMessage(error);
  if (!message) return fallback;
  if (message.trim() === "") return fallback;

  const result = classify(message, opts.extraPatterns);
  if (result.confidence >= threshold) return fallback;

  return message;
}

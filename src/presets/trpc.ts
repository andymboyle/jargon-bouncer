import { sanitize } from "../sanitize";
import type { SanitizeOptions } from "../types";

/**
 * Map of tRPC error codes to user-friendly messages.
 * Extend this map to customize messages for your app.
 */
const TRPC_ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  TOO_MANY_REQUESTS: "Too many requests. Please wait a moment and try again.",
  TIMEOUT: "The request timed out. Please try again.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again.",
  BAD_GATEWAY: "The service is temporarily unavailable. Please try again.",
  SERVICE_UNAVAILABLE: "The service is temporarily unavailable. Please try again.",
  GATEWAY_TIMEOUT: "The request timed out. Please try again.",
  CONFLICT: "This action conflicts with another operation. Please refresh and try again.",
  PRECONDITION_FAILED: "The request could not be completed. Please refresh and try again.",
  PAYLOAD_TOO_LARGE: "The data you're trying to send is too large.",
  METHOD_NOT_SUPPORTED: "This action is not supported.",
  UNPROCESSABLE_CONTENT: "The request could not be processed. Please check your input.",
};

/**
 * A tRPC-aware error sanitizer. Checks for tRPC error codes first,
 * then falls back to the standard pattern-based sanitizer.
 *
 * Works with @trpc/client's TRPCClientError shape (has a `data.code` or
 * `shape.data.code` property) as well as plain Error objects.
 *
 * @example
 * ```ts
 * import { sanitizeTRPC } from 'jargon-bouncer/presets/trpc';
 *
 * // In an onError handler:
 * onError: (error) => {
 *   toast.error(sanitizeTRPC(error));
 * }
 *
 * // With a context-specific fallback:
 * toast.error(sanitizeTRPC(error, { fallback: "Failed to save settings." }));
 * ```
 */
export function sanitizeTRPC(
  error: unknown,
  options?: SanitizeOptions | string,
): string {
  const opts: SanitizeOptions =
    typeof options === "string" ? { fallback: options } : options ?? {};

  // Try to extract tRPC error code
  const code = extractTRPCCode(error);

  if (code) {
    // For INTERNAL_SERVER_ERROR, always use fallback — never show the message
    if (code === "INTERNAL_SERVER_ERROR") {
      return opts.fallback ?? TRPC_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    }

    // For BAD_REQUEST, try the message first (it's often a useful validation message)
    // but still run it through the sanitizer to catch internal leaks
    if (code === "BAD_REQUEST") {
      return sanitize(error, opts);
    }

    // For known codes, use the friendly message
    if (code in TRPC_ERROR_MESSAGES) {
      return TRPC_ERROR_MESSAGES[code];
    }
  }

  // Fall back to standard sanitizer
  return sanitize(error, opts);
}

function extractTRPCCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  // TRPCClientError shape: error.data.code
  const e = error as Record<string, unknown>;
  if (e.data && typeof e.data === "object") {
    const data = e.data as Record<string, unknown>;
    if (typeof data.code === "string") return data.code;
  }

  // Some tRPC versions use error.shape.data.code
  if (e.shape && typeof e.shape === "object") {
    const shape = e.shape as Record<string, unknown>;
    if (shape.data && typeof shape.data === "object") {
      const data = shape.data as Record<string, unknown>;
      if (typeof data.code === "string") return data.code;
    }
  }

  // Direct code property (some wrappers)
  if (typeof e.code === "string" && e.code in TRPC_ERROR_MESSAGES) {
    return e.code;
  }

  return null;
}

export { TRPC_ERROR_MESSAGES };

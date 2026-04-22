import { S as SanitizeOptions } from '../types-DteljXN3.js';

/**
 * Map of tRPC error codes to user-friendly messages.
 * Extend this map to customize messages for your app.
 */
declare const TRPC_ERROR_MESSAGES: Record<string, string>;
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
declare function sanitizeTRPC(error: unknown, options?: SanitizeOptions | string): string;

export { TRPC_ERROR_MESSAGES, sanitizeTRPC };

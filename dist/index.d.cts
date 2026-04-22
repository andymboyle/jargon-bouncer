import { P as Pattern, C as Classification, S as SanitizeOptions } from './types-DteljXN3.cjs';
export { a as Category } from './types-DteljXN3.cjs';

/**
 * Classify a message as technical or human-friendly.
 *
 * Tests the message against 50+ patterns covering stack traces, database
 * errors, network errors, cloud provider messages, ORM errors, and more.
 *
 * @param message - The error message to classify
 * @param extraPatterns - Additional patterns to check alongside built-in ones
 * @returns Classification result with confidence score and category
 */
declare function classify(message: string, extraPatterns?: Pattern[]): Classification;
/**
 * Check if a message looks like technical/internal content that shouldn't
 * be shown to end users.
 *
 * @param message - The error message to check
 * @param threshold - Minimum confidence to consider technical (default: 0.5)
 * @param extraPatterns - Additional patterns to check
 * @returns true if the message looks technical
 */
declare function isTechnical(message: string, threshold?: number, extraPatterns?: Pattern[]): boolean;
/**
 * Check if a message looks safe to show to end users.
 * Inverse of isTechnical.
 *
 * @param message - The error message to check
 * @param threshold - Minimum confidence to consider technical (default: 0.5)
 * @param extraPatterns - Additional patterns to check
 * @returns true if the message looks human-friendly
 */
declare function isHumanFriendly(message: string, threshold?: number, extraPatterns?: Pattern[]): boolean;

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
declare function sanitize(error: unknown, options?: SanitizeOptions | string): string;

/**
 * Patterns for detecting stack traces from various languages and runtimes.
 */
declare const stackTracePatterns: Pattern[];

/**
 * Patterns for detecting database error messages.
 */
declare const databasePatterns: Pattern[];

/**
 * Patterns for detecting network and connection error messages.
 */
declare const networkPatterns: Pattern[];

/**
 * Patterns for detecting other technical content: exception class names,
 * file paths, serialized data, cloud provider errors, ORM errors.
 */
declare const miscPatterns: Pattern[];

/**
 * All built-in patterns, ordered roughly by confidence (highest first).
 */
declare const allPatterns: Pattern[];

export { Classification, Pattern, SanitizeOptions, allPatterns, classify, databasePatterns, isHumanFriendly, isTechnical, miscPatterns, networkPatterns, sanitize, stackTracePatterns };

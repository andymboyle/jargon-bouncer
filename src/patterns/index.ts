import type { Pattern } from "../types";
import { stackTracePatterns } from "./stacktraces";
import { databasePatterns } from "./database";
import { networkPatterns } from "./network";
import { miscPatterns } from "./misc";

/**
 * All built-in patterns, ordered roughly by confidence (highest first).
 */
export const allPatterns: Pattern[] = [
  ...stackTracePatterns,
  ...databasePatterns,
  ...networkPatterns,
  ...miscPatterns,
];

export { stackTracePatterns, databasePatterns, networkPatterns, miscPatterns };

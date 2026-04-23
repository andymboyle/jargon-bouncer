import type { Pattern } from "../types";
import { stackTracePatterns } from "./stacktraces";
import { databasePatterns } from "./database";
import { networkPatterns } from "./network";
import { browserPatterns } from "./browser";
import { languagePatterns } from "./languages";
import { frameworkPatterns } from "./frameworks";
import { infraPatterns } from "./infra";
import { miscPatterns } from "./misc";

/**
 * All built-in patterns, ordered roughly by confidence (highest first).
 */
export const allPatterns: Pattern[] = [
  ...stackTracePatterns,
  ...databasePatterns,
  ...networkPatterns,
  ...browserPatterns,
  ...languagePatterns,
  ...frameworkPatterns,
  ...infraPatterns,
  ...miscPatterns,
];

export {
  stackTracePatterns,
  databasePatterns,
  networkPatterns,
  browserPatterns,
  languagePatterns,
  frameworkPatterns,
  infraPatterns,
  miscPatterns,
};

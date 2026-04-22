export { classify, isTechnical, isHumanFriendly } from "./detect";
export { sanitize } from "./sanitize";
export type {
  Classification,
  Category,
  Pattern,
  SanitizeOptions,
} from "./types";

// Re-export pattern collections for advanced usage
export {
  allPatterns,
  stackTracePatterns,
  databasePatterns,
  networkPatterns,
  browserPatterns,
  languagePatterns,
  miscPatterns,
} from "./patterns";

import type { Classification, Pattern } from "./types";
import { allPatterns } from "./patterns";

/**
 * Classify a message as technical or human-friendly.
 *
 * Tests the message against 120+ patterns covering stack traces, database
 * errors, network errors, cloud provider messages, ORM errors, and more.
 *
 * @param message - The error message to classify
 * @param extraPatterns - Additional patterns to check alongside built-in ones
 * @returns Classification result with confidence score and category
 */
export function classify(
  message: string,
  extraPatterns?: Pattern[],
): Classification {
  if (!message || typeof message !== "string") {
    return {
      technical: false,
      category: null,
      confidence: 0,
      matchedPattern: null,
    };
  }

  const patterns = extraPatterns
    ? [...allPatterns, ...extraPatterns]
    : allPatterns;

  let bestMatch: Classification = {
    technical: false,
    category: null,
    confidence: 0,
    matchedPattern: null,
  };

  for (const pattern of patterns) {
    if (pattern.regex.test(message)) {
      if (pattern.confidence > bestMatch.confidence) {
        bestMatch = {
          technical: true,
          category: pattern.category,
          confidence: pattern.confidence,
          matchedPattern: pattern.name,
        };
      }
    }
  }

  // Heuristic fallback: very long messages (>500 chars) are almost never
  // user-facing. Runs AFTER pattern matching so a specific high-confidence
  // pattern (e.g. python-traceback at 0.99) wins over the generic heuristic.
  if (bestMatch.confidence === 0 && message.length > 500) {
    return {
      technical: true,
      category: "serialized-data",
      confidence: 0.7,
      matchedPattern: "message-too-long",
    };
  }

  return bestMatch;
}

/**
 * Check if a message looks like technical/internal content that shouldn't
 * be shown to end users.
 *
 * @param message - The error message to check
 * @param threshold - Minimum confidence to consider technical (default: 0.5)
 * @param extraPatterns - Additional patterns to check
 * @returns true if the message looks technical
 */
export function isTechnical(
  message: string,
  threshold = 0.5,
  extraPatterns?: Pattern[],
): boolean {
  const result = classify(message, extraPatterns);
  return result.confidence >= threshold;
}

/**
 * Check if a message looks safe to show to end users.
 * Inverse of isTechnical.
 *
 * @param message - The error message to check
 * @param threshold - Minimum confidence to consider technical (default: 0.5)
 * @param extraPatterns - Additional patterns to check
 * @returns true if the message looks human-friendly
 */
export function isHumanFriendly(
  message: string,
  threshold = 0.5,
  extraPatterns?: Pattern[],
): boolean {
  return !isTechnical(message, threshold, extraPatterns);
}

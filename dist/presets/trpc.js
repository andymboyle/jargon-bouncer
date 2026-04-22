import {
  sanitize
} from "../chunk-IJCIZ6FH.js";

// src/presets/trpc.ts
var TRPC_ERROR_MESSAGES = {
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
  UNPROCESSABLE_CONTENT: "The request could not be processed. Please check your input."
};
function sanitizeTRPC(error, options) {
  const opts = typeof options === "string" ? { fallback: options } : options ?? {};
  const code = extractTRPCCode(error);
  if (code) {
    if (code === "INTERNAL_SERVER_ERROR") {
      return opts.fallback ?? TRPC_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    }
    if (code === "BAD_REQUEST") {
      return sanitize(error, opts);
    }
    if (code in TRPC_ERROR_MESSAGES) {
      return TRPC_ERROR_MESSAGES[code];
    }
  }
  return sanitize(error, opts);
}
function extractTRPCCode(error) {
  if (!error || typeof error !== "object") return null;
  const e = error;
  if (e.data && typeof e.data === "object") {
    const data = e.data;
    if (typeof data.code === "string") return data.code;
  }
  if (e.shape && typeof e.shape === "object") {
    const shape = e.shape;
    if (shape.data && typeof shape.data === "object") {
      const data = shape.data;
      if (typeof data.code === "string") return data.code;
    }
  }
  if (typeof e.code === "string" && e.code in TRPC_ERROR_MESSAGES) {
    return e.code;
  }
  return null;
}
export {
  TRPC_ERROR_MESSAGES,
  sanitizeTRPC
};
//# sourceMappingURL=trpc.js.map
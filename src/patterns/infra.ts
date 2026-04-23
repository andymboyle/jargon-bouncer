import type { Pattern } from "../types";

/**
 * Patterns for detecting infrastructure, container, and orchestration
 * error messages that sometimes leak through to user-facing surfaces
 * (status pages, admin panels, webhook responses).
 */
export const infraPatterns: Pattern[] = [
  // Kubernetes
  {
    name: "k8s-crashloop",
    category: "cloud-error",
    regex: /\bCrashLoopBackOff\b/,
    confidence: 0.95,
  },
  {
    name: "k8s-oom-killed",
    category: "cloud-error",
    regex: /\bOOMKilled\b/,
    confidence: 0.95,
  },
  {
    name: "k8s-image-pull",
    category: "cloud-error",
    regex: /\b(?:ImagePullBackOff|ErrImagePull|ErrImageNeverPull)\b/,
    confidence: 0.95,
  },
  {
    name: "k8s-pod-status",
    category: "cloud-error",
    regex: /\b(?:CreateContainerConfigError|RunContainerError|InvalidImageName)\b/,
    confidence: 0.9,
  },
  {
    name: "k8s-eviction",
    category: "cloud-error",
    regex: /\bEvicted\b.*\b(?:ephemeral-storage|memory|disk)\b/i,
    confidence: 0.85,
  },

  // Docker
  {
    name: "docker-container-exit",
    category: "cloud-error",
    regex: /container [\w"]+ exited with code \d+/i,
    confidence: 0.9,
  },
  {
    name: "docker-bind-error",
    category: "cloud-error",
    regex: /\bbind:\s+address already in use\b/i,
    confidence: 0.9,
  },
  {
    name: "docker-no-such-container",
    category: "cloud-error",
    regex: /No such container:\s/,
    confidence: 0.9,
  },

  // gRPC (expanded from the basic StatusCode pattern in misc.ts)
  {
    name: "grpc-unavailable",
    category: "network-error",
    regex: /\bUNAVAILABLE\b.*\bfailed to connect\b/i,
    confidence: 0.9,
  },
  {
    name: "grpc-deadline-exceeded",
    category: "network-error",
    regex: /\bDEADLINE_EXCEEDED\b/,
    confidence: 0.9,
  },
  {
    name: "grpc-unimplemented",
    category: "network-error",
    regex: /\bUNIMPLEMENTED\b.*\b(?:method|service)\b/i,
    confidence: 0.85,
  },
  {
    name: "grpc-permission-denied",
    category: "network-error",
    regex: /\bPERMISSION_DENIED\b.*\b(?:caller|token|credential)\b/i,
    confidence: 0.85,
  },
];

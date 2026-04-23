# jargon-bouncer

[![CI](https://github.com/andymboyle/jargon-bouncer/actions/workflows/ci.yml/badge.svg)](https://github.com/andymboyle/jargon-bouncer/actions)
[![npm](https://img.shields.io/npm/v/jargon-bouncer)](https://www.npmjs.com/package/jargon-bouncer)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jargon-bouncer)](https://bundlephobia.com/package/jargon-bouncer)
[![license](https://img.shields.io/github/license/andymboyle/jargon-bouncer)](LICENSE)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
[![downloads](https://img.shields.io/npm/dm/jargon-bouncer)](https://www.npmjs.com/package/jargon-bouncer)

```
    ┌─────────────────────────────────────┐
    │         YOUR APP'S UI               │
    │                                     │
    │  ┌───────────────────────────────┐  │
    │  │ "Something went wrong.       │  │
    │  │  Please try again."          │  │
    │  └───────────────────────────────┘  │
    │                                     │
    └──────────────┬──────────────────────┘
                   │ ✅
              ┌────┴────┐
              │ BOUNCER │
              │  ╭━━━╮  │
              │  ┃ 😎 ┃  │
              │  ╰━━━╯  │
              │💪████💪 │
              │  ████   │
              │  ╱  ╲   │
              └────┬────┘
           ✅ │         │ 🚫
    ┌─────────┴───┐ ┌───┴──────────────────────────┐
    │ "Email is   │ │ "psycopg2.errors.             │
    │  required"  │ │  UndefinedTable: relation     │
    │             │ │  'accounts' does not exist"   │
    └─────────────┘ └──────────────────────────────┘
        PASSED           BOUNCED
```

Okay let's say it's a Tuesday. And a user of your application comes across a part of your code that leads to an error. They see this:

```
psycopg2.errors.UndefinedTable: relation "accounts" does not exist
```

Your users just saw that. In a toast notification. On a Tuesday. The hell does that mean to them?

Nothing! It doesn't help them. It makes them think "oh shit I really broke this." Or worse. And then they freak out and message your support team and . . . yeah. 

Your error messages need a bouncer. A _jargon_ bouncer, if you will. 

**jargon-bouncer** detects when an error message is technical garbage and stops it from reaching your UI. No AI, no API calls, no dependencies — just 122 patterns matched against the collective mistakes of every backend framework ever built. (Well, not _every_ framework, but, like, a lot of them.)

```typescript
import { sanitize } from 'jargon-bouncer';

// Before: users see backend nightmares
toast.error(error.message);
// "psycopg2.errors.UndefinedTable: relation 'accounts' does not exist"

// After: users see something helpful
toast.error(sanitize(error));
// "Something went wrong. Please try again."
```

---

## Why This Exists

Every app has catch blocks. Every catch block has `error.message`. And every `error.message` is one bad deployment away from showing your users a Python traceback, a Postgres column error, or a raw `ECONNREFUSED`.

I looked for a deterministic, non-AI library that could tell me "this error message is not for humans" and couldn't find one. So I built one.

The thesis is simple: **error messages written for developers and error messages written for users look fundamentally different, and you can tell them apart with pattern matching.** And catching all of them can be a giant pain in the ass. So, this attempts to catch them for you.

This really is a great service to humanity. You're welcome.

---

## Install

```bash
npm install jargon-bouncer
# or
yarn add jargon-bouncer
# or
pnpm add jargon-bouncer
# or
bun add jargon-bouncer
```

---

## At a Glance

- **122 detection patterns** across 8 languages and 20+ frameworks
- **Zero dependencies** — just regex patterns and string analysis
- **~5KB gzipped** — smaller than most icons
- **211 tests** including real-world production error messages
- **Confidence scoring** — every match has a 0-1 confidence score, not just a boolean
- **Framework presets** — tRPC preset included, more coming
- **Extensible** — add your own patterns without forking

### Core Concepts

- **Pattern**: A named regex with a category and confidence score. Patterns detect technical content.
- **Category**: What kind of jargon was detected (`stack-trace`, `database-error`, `network-error`, `orm-error`, `cloud-error`, `exception-class`, `file-path`, `serialized-data`).
- **Confidence**: How sure we are that the message is technical (0 = definitely human-friendly, 1 = definitely technical). Default threshold is 0.5.
- **Preset**: Framework-specific wrapper that adds error code mapping on top of pattern detection (e.g., tRPC error codes → friendly messages).

---

## The Problem

You write a nice error handler:

```typescript
onError: (error) => {
  toast.error(error.message);
}
```

And your users see:

- `TypeError: Cannot read property 'id' of undefined`
- `ECONNREFUSED 127.0.0.1:5432`
- `Traceback (most recent call last): File "/app/main.py", line 42`
- `relation "users" does not exist`
- `NullPointerException: Cannot invoke method on null`
- `AxiosError: Request failed with status code 500`

Every one of these is a real error that shipped to production because someone did `error.message` in a catch block. Don't feel bad. We've all done it.

## The Fix

```typescript
import { sanitize } from 'jargon-bouncer';

// Drop-in replacement for error.message in your UI:
toast.error(sanitize(error));

// With a context-specific fallback:
toast.error(sanitize(error, "Failed to save settings. Please try again."));
```

`sanitize` accepts anything — `Error` objects, strings, objects with a `message` property, `null`, `undefined`, a number if you're having that kind of day. It always returns a string that's safe to show a human.

---

## Usage Examples

### React error boundary

```typescript
import { sanitize } from 'jargon-bouncer';

function ErrorFallback({ error }) {
  return <p>{sanitize(error, "Something unexpected happened.")}</p>;
}
```

### Express error middleware

```typescript
import { sanitize } from 'jargon-bouncer';

app.use((err, req, res, next) => {
  console.error(err); // log the real error
  res.status(500).json({ error: sanitize(err, "Internal server error.") });
});
```

### tRPC mutation handler

```typescript
import { sanitizeTRPC } from 'jargon-bouncer/presets/trpc';

const mutation = trpc.useMutation({
  onError: (error) => {
    toast.error(sanitizeTRPC(error, "Failed to save changes."));
  },
});
```

### Logging + display split

```typescript
import { classify, sanitize } from 'jargon-bouncer';

function handleError(error: unknown) {
  const result = classify(error.message);

  // Always log the real error for debugging
  logger.error("Request failed", { error, classification: result });

  // Only show safe messages to users
  toast.error(sanitize(error));
}
```

---

## What Gets Bounced

122 patterns across 8 languages and 20+ frameworks. The bouncer has seen it all.

| Bounced | Examples |
|---------|---------|
| **Stack traces** | JavaScript/V8, Python, Java, Go, Ruby, .NET, Rust, PHP |
| **Database errors** | PostgreSQL, MySQL, SQLite, MongoDB, Redis, raw SQL |
| **Network errors** | ECONNREFUSED, ETIMEDOUT, DNS, TLS/SSL, CORS, AxiosError, gRPC |
| **ORM errors** | Prisma, SQLAlchemy, ActiveRecord, Hibernate, TypeORM, Sequelize, Drizzle, PDO |
| **Framework errors** | Django, Laravel/Eloquent, Spring, GraphQL |
| **Cloud/infra errors** | AWS, GCP, Azure, Kubernetes, Docker |
| **Exception names** | TypeError, NullPointerException, KeyError, GraphQLError, etc. |
| **Browser errors** | CORS blocked, JSON parse failures, heap out of memory, stack overflow |
| **File paths** | `/usr/src/app/server.js:42`, `node_modules/...`, `C:\Users\...` |
| **Serialized data** | Python repr objects, JSON error dumps |
| **Long messages** | Anything over 500 characters (almost never user-facing) |

## What Gets Through

The bouncer knows the difference between jargon and a real message:

```typescript
sanitize("No seats available. Revoke a seat first.")     // ✅ passes through
sanitize("Email address is required")                      // ✅ passes through
sanitize("Select a template from the list")                // ✅ passes through
sanitize("To update or delete a task, use the menu")       // ✅ passes through
sanitize("Your trial has ended. Contact support.")         // ✅ passes through
sanitize("Drop us a line at support@example.com")          // ✅ passes through
sanitize("Insert your card details below")                 // ✅ passes through
sanitize("Please illuminate the issue with more details")  // ✅ passes through
sanitize("Hibernate your device to save battery")          // ✅ passes through
sanitize("Spring cleaning sale — 50% off")                 // ✅ passes through
```

Single English words like "from", "update", "delete", "spring", and "hibernate" don't trigger false positives. The patterns match multi-keyword technical signatures, not individual words.

---

## Does It Actually Work?

You bet your ass. Here's how we know.

### Real-world stress test

We tested against **75 real error messages** collected from production logs, Sentry reports, and Stack Overflow — the actual strings that end up in toast notifications:

| Test | Count | Result |
|------|-------|--------|
| Production errors that MUST be caught | 28 | **28/28 caught (100%)** |
| User-facing messages that MUST pass through | 47 | **47/47 passed (100%)** |

The production errors include actual Prisma invocations, Python tracebacks, CORS failures, Postgres operator mismatches, Docker daemon errors, gRPC status codes, and multi-line stack traces. Every one was correctly identified as technical.

The user-facing messages include validation messages, auth messages, business logic, action confirmations, and — critically — **9 messages containing SQL-adjacent English words** like "Select a plan from the options below" and "Insert your card details below." Zero false positives.

### False positive resistance

The SQL detection is case-sensitive for ambiguous patterns. `SELECT ... FROM` (uppercase, multi-keyword) matches SQL. "Select a template from the list" (mixed case, natural English) does not. This is tested explicitly.

### Full test suite

211 tests across 8 test files covering every pattern category, every API function, every edge case (null, undefined, empty string, numbers), and the full tRPC preset.

---

## API

### `sanitize(error, options?)`

The main event. Returns the error message if it looks human-friendly, or the fallback if it looks like jargon.

```typescript
sanitize(error: unknown, options?: SanitizeOptions | string): string
```

The second argument can be a string (used as the fallback) or an options object:

```typescript
sanitize(error, "Failed to save.")
// or
sanitize(error, { fallback: "Failed to save.", threshold: 0.7 })
```

Options:

| Option | Default | Description |
|--------|---------|-------------|
| `fallback` | `"Something went wrong. Please try again."` | What to show when the message is technical |
| `threshold` | `0.5` | Minimum confidence (0-1) to consider a message technical |
| `extraPatterns` | `[]` | Your own patterns to check alongside the built-in ones |

### `isTechnical(message)`

Boolean check. Is this message jargon?

```typescript
isTechnical("ECONNREFUSED 127.0.0.1:5432")  // true
isTechnical("Please check your email")       // false
```

### `isHumanFriendly(message)`

The opposite.

```typescript
isHumanFriendly("Please check your email")        // true
isHumanFriendly("ECONNREFUSED 127.0.0.1:5432")   // false
```

### `classify(message)`

The full picture. Returns what kind of jargon it is and how confident the bouncer is.

```typescript
classify("Traceback (most recent call last):")
// → {
//     technical: true,
//     category: "stack-trace",
//     confidence: 0.99,
//     matchedPattern: "python-traceback"
//   }

classify("Please try again later")
// → {
//     technical: false,
//     category: null,
//     confidence: 0,
//     matchedPattern: null
//   }
```

Categories: `"stack-trace"` | `"database-error"` | `"network-error"` | `"cloud-error"` | `"orm-error"` | `"exception-class"` | `"file-path"` | `"serialized-data"`

---

## Framework Presets

### tRPC

```typescript
import { sanitizeTRPC } from 'jargon-bouncer/presets/trpc';

// Knows about tRPC error codes:
// UNAUTHORIZED → "Your session has expired. Please sign in again."
// FORBIDDEN → "You don't have permission to perform this action."
// NOT_FOUND → "The requested resource was not found."
// INTERNAL_SERVER_ERROR → always uses fallback (never shows the message)
// BAD_REQUEST → passes through if the message looks safe

onError: (error) => {
  toast.error(sanitizeTRPC(error));
}
```

---

## Custom Patterns

Got internal error formats the bouncer doesn't know about? Teach it:

```typescript
import { sanitize } from 'jargon-bouncer';

const myPatterns = [
  {
    name: "internal-error-code",
    category: "cloud-error" as const,
    regex: /MYAPP_ERR_\d+/,
    confidence: 0.95,
  },
];

sanitize(error, { extraPatterns: myPatterns });
```

---

## How It Works

Just regex patterns and string analysis. This is the first time in the history of software engineering where using regex actually takes you from two problems to one. You're welcome.

So: Each pattern has a **confidence score** (0-1). When a message matches multiple patterns, the highest confidence wins. The default threshold is 0.5 — anything above that gets bounced.

The patterns are designed to catch real error messages from real frameworks with minimal false positives. "Select a template from the list" won't trigger the SQL detector because it matches `SELECT ... FROM` (case-sensitive, multi-keyword), not the word "from" by itself.

For messages over 500 characters, a length heuristic kicks in as a fallback — but only if no specific pattern matched. A 600-character Python traceback will still be classified as `python-traceback` (confidence 0.99), not `message-too-long` (confidence 0.7).

### Repository Layout

```
jargon-bouncer/
  src/
    detect.ts              # classify, isTechnical, isHumanFriendly
    sanitize.ts            # sanitize wrapper (accepts Error, string, anything)
    types.ts               # Classification, Pattern, SanitizeOptions
    index.ts               # public exports
    patterns/
      stacktraces.ts       # JS, Python, Java, Go, Ruby, .NET (12 patterns)
      database.ts          # Postgres, MySQL, SQLite, MongoDB, Redis, SQL (17 patterns)
      network.ts           # ECONNREFUSED, DNS, TLS, axios, fetch, httpx (14 patterns)
      browser.ts           # CORS, JSON parse, memory, permissions (11 patterns)
      languages.ts         # Rust, PHP, GraphQL (11 patterns)
      frameworks.ts        # Django, Laravel, TypeORM, Spring, Sequelize (22 patterns)
      infra.ts             # Kubernetes, Docker, gRPC (12 patterns)
      misc.ts              # Exception classes, file paths, cloud, ORM (22 patterns)
    presets/
      trpc.ts              # tRPC-aware sanitizer with error code mapping
  tests/
    detect.test.ts         # Core detection tests
    sanitize.test.ts       # Sanitize wrapper tests
    browser-patterns.test.ts
    language-patterns.test.ts
    framework-patterns.test.ts
    infra-patterns.test.ts
    real-world.test.ts     # 77 production error messages
    trpc-preset.test.ts
```

---

## Roadmap

Patterns we're planning to add. PRs welcome for any of these:

- [ ] **Elixir/Erlang** — `** (RuntimeError)`, BEAM process exit messages
- [ ] **Swift** — `NSException`, `fatalError`
- [ ] **DynamoDB** — `ConditionalCheckFailedException`, `ProvisionedThroughputExceededException`
- [ ] **Elasticsearch** — `search_phase_execution_exception`, `index_not_found_exception`
- [ ] **Terraform** — `Error: Reference to undeclared resource`
- [ ] **Special character density** — high ratio of `:()/{}\` usually means technical content
- [ ] **More framework presets** — Express, FastAPI, Next.js, SvelteKit

---

## Contributing

### Report a gap

Found an error message that gets through when it shouldn't? Or a legitimate message that gets bounced? [Open an issue](https://github.com/andymboyle/jargon-bouncer/issues) with the exact message string and we'll tune the patterns.

### Add a pattern

1. Add the pattern to the appropriate file in `src/patterns/`
2. Every pattern must have:
   - A descriptive `name` (e.g., `"django-db-error"`)
   - A `category` from the supported set
   - A `regex` that matches the technical content
   - A `confidence` score (0-1) reflecting how certain the match is
3. Add a positive test (message that SHOULD be caught)
4. Add a false-positive test (similar-looking message that should NOT be caught)
5. Run `bun run test` — all tests must pass

### Add a preset

1. Create a new file in `src/presets/` (e.g., `express.ts`)
2. Follow the pattern in `src/presets/trpc.ts`
3. Add tests in `tests/`
4. The preset will be auto-included in the build (tsup uses a glob)

---

## Security

jargon-bouncer is a pure detection library. It does not:
- Make network requests
- Access the filesystem
- Execute dynamic code
- Store or transmit error messages
- Have any dependencies that could be compromised

It receives a string, tests it against regex patterns, and returns a string. That's it.

---

## License

MIT

# jargon-bouncer

[![CI](https://github.com/andymboyle/jargon-bouncer/actions/workflows/ci.yml/badge.svg)](https://github.com/andymboyle/jargon-bouncer/actions)
[![license](https://img.shields.io/github/license/andymboyle/jargon-bouncer)](LICENSE)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
<!-- [![npm](https://img.shields.io/npm/v/jargon-bouncer)](https://www.npmjs.com/package/jargon-bouncer) -->
<!-- [![bundle size](https://img.shields.io/bundlephobia/minzip/jargon-bouncer)](https://bundlephobia.com/package/jargon-bouncer) -->
<!-- [![downloads](https://img.shields.io/npm/dm/jargon-bouncer)](https://www.npmjs.com/package/jargon-bouncer) -->

Okay let's say it's a Tuesday. And a user of your application comes across a part of your code that leads to an error. They see this:

```
psycopg2.errors.UndefinedTable: relation "accounts" does not exist
```

Your users just saw that. In a toast notification. On a Tuesday. The hell does that mean to them?

Nothing! It doesn't help them. It makes them think "oh shit I really broke this." Or worse. And then they freak out and message your support team and . . . yeah. 

Your error messages need a bouncer. A _jargon_ bouncer, if you will. 

**jargon-bouncer** detects when an error message is technical garbage and stops it from reaching your UI. No AI, no API calls, no dependencies — just 81 patterns matched against the collective mistakes of every backend framework ever built.

```typescript
import { sanitize } from 'jargon-bouncer';

// Before: users see backend nightmares
toast.error(error.message);
// "psycopg2.errors.UndefinedTable: relation 'accounts' does not exist"

// After: users see something helpful
toast.error(sanitize(error));
// "Something went wrong. Please try again."
```

## Install

Here's the basics (once I get the package actually uploaded to npm lol):

```bash
npm install jargon-bouncer
# or
yarn add jargon-bouncer
# or
pnpm add jargon-bouncer
# or
bun add jargon-bouncer
```

## The Problem More In-Depth

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

## What Gets Bounced

81 patterns across 8 languages and 15+ frameworks. The bouncer has seen it all.

| Bounced | Examples |
|---------|---------|
| **Stack traces** | JavaScript/V8, Python, Java, Go, Ruby, .NET, Rust, PHP |
| **Database errors** | PostgreSQL, MySQL, SQLite, MongoDB, Redis, raw SQL |
| **Network errors** | ECONNREFUSED, ETIMEDOUT, DNS, TLS/SSL, CORS, AxiosError |
| **ORM errors** | Prisma, SQLAlchemy, ActiveRecord, Hibernate, PDO |
| **Cloud errors** | AWS, GCP, Azure SDK exceptions |
| **Exception names** | TypeError, NullPointerException, KeyError, GraphQLError, etc. |
| **Browser errors** | CORS blocked, JSON parse failures, heap out of memory, stack overflow |
| **File paths** | `/usr/src/app/server.js:42`, `node_modules/...`, `C:\Users\...` |
| **Serialized data** | Python repr objects, JSON error dumps |

## What Gets Through

The bouncer knows the difference between jargon and a real message:

```typescript
sanitize("No seats available. Revoke a seat first.")     // ✅ passes through
sanitize("Email address is required")                      // ✅ passes through
sanitize("Select a template from the list")                // ✅ passes through
sanitize("To update or delete a task, use the menu")       // ✅ passes through
sanitize("Your trial has ended. Contact support.")         // ✅ passes through
```

Single English words like "from", "update", and "delete" don't trigger false positives. The patterns match multi-keyword SQL statements (`SELECT ... FROM`, `DELETE FROM`), not individual words.

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

## How It Works

No AI, no API calls. Just regex patterns and string analysis.

Each pattern has a **confidence score** (0-1). When a message matches multiple patterns, the highest confidence wins. The default threshold is 0.5 — anything above that gets bounced.

The patterns are designed to catch real error messages from real frameworks with minimal false positives. "Select a template from the list" won't trigger the SQL detector because it matches `SELECT ... FROM` (case-sensitive, multi-keyword), not the word "from" by itself.

## Why This Exists

An app I worked on kept showing our users Python tracebacks in production toast notifications. We looked for a library that could tell us "hey, this error message is not for humans" and couldn't find one. So we built one.

## Roadmap

Patterns we're planning to add. PRs welcome for any of these:

- [ ] **Django ORM** — `django.db.utils.IntegrityError`, `OperationalError`
- [ ] **Laravel/Eloquent** — `Illuminate\Database\QueryException`
- [ ] **TypeORM** — `QueryFailedError`, `EntityNotFoundError`
- [ ] **Spring/Hibernate** — `DataIntegrityViolationException`, `LazyInitializationException`
- [ ] **gRPC** — `StatusCode.UNAVAILABLE`, `StatusCode.DEADLINE_EXCEEDED`
- [ ] **Kubernetes** — `CrashLoopBackOff`, `OOMKilled`, `ImagePullBackOff`
- [ ] **Docker** — `container exited with code`, `bind: address already in use`
- [ ] **Elixir/Erlang** — `** (RuntimeError)`, BEAM process exit messages
- [ ] **Swift** — `NSException`, `fatalError`
- [ ] **DynamoDB** — `ConditionalCheckFailedException`, `ProvisionedThroughputExceededException`
- [ ] **Elasticsearch** — `search_phase_execution_exception`, `index_not_found_exception`
- [ ] **Terraform** — `Error: Reference to undeclared resource`
- [ ] **Message length heuristic** — messages over ~500 chars are almost never user-facing
- [ ] **Special character density** — high ratio of `:()/{}\` usually means technical content
- [ ] **More framework presets** — Express, FastAPI, Next.js, SvelteKit

## Contributing

Found an error message that gets through when it shouldn't? Or a legitimate message that gets bounced? [Open an issue](https://github.com/andymboyle/jargon-bouncer/issues) with the message and we'll tune the patterns.

## License

MIT

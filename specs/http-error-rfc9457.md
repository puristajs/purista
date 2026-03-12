# RFC 9457 HTTP Error Responses

## Status
Proposed

## Related
- GitHub issue: [#258](https://github.com/puristajs/purista/issues/258)
- RFC 9457: [Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- Reference inspiration: [Cloudflare RFC 9457 agent error pages](https://blog.cloudflare.com/rfc-9457-agent-error-pages/)

## Summary
PURISTA should expose HTTP errors as RFC 9457 Problem Details at the HTTP boundary.

This proposal intentionally separates the external HTTP contract from PURISTA's internal event-bridge error envelope. Phase 1 updates HTTP-facing adapters, especially `@purista/hono-http-server`, to return `application/problem+json` with the standard problem members and PURISTA-specific extension members. Internal command error responses remain unchanged in phase 1.

## Why
Today PURISTA returns structured JSON errors, but they are framework-specific:

```json
{
  "status": 400,
  "message": "Bad Request",
  "data": [...],
  "traceId": "..."
}
```

That is workable for PURISTA-aware clients, but it is not the standard problem-details shape expected by generic HTTP clients, SDKs, gateways, and tooling. RFC 9457 defines a common error format specifically to avoid each framework inventing its own error schema.

Cloudflare's recent work is a useful reference point: agent- and machine-friendly structured errors reduce ambiguity, reduce wasted retries, and make runtime decisions easier. The important lesson is not the exact Cloudflare payload, but the contract choice: stable HTTP problem details first, provider-specific metadata second.

## Goals
- Return RFC 9457 compliant JSON problem details for HTTP error responses.
- Use `application/problem+json` for HTTP error payloads.
- Keep PURISTA traceability and diagnostics available through extension members.
- Keep OpenAPI output aligned with actual runtime error responses.
- Keep internal PURISTA command error envelopes stable in phase 1.
- Make the rollout low-risk and testable.

## Non-Goals
- Do not change internal event-bridge `CommandErrorResponse` in phase 1.
- Do not redesign `HandledError` / `UnhandledError` semantics in phase 1.
- Do not add HTML or Markdown error representations in phase 1.
- Do not couple JSON problem normalization to representation-specific rendering concerns in phase 1.
- Do not expose raw stack traces or unsafe internals in production HTTP responses.

## Current State
### Internal core shape
Internal PURISTA command failures currently use a payload like:

```ts
{
  status: StatusCode
  message: string
  data?: unknown
  traceId?: TraceId
}
```

This shape is used by:
- `HandledError.getErrorResponse(...)`
- `UnhandledError.getErrorResponse(...)`
- `createErrorResponse(...)`
- event-bridge command error messages

### HTTP shape
`@purista/hono-http-server` currently serializes those errors directly as JSON via `c.json(...)`, so the HTTP response shape mirrors the internal PURISTA error payload instead of RFC 9457.

### OpenAPI shape
The generated OpenAPI schemas currently also describe the PURISTA-specific error format rather than problem details.

## Proposal
## 1. Standardize the HTTP error contract on RFC 9457
HTTP adapters must expose error responses as Problem Details JSON objects.

Base members:
- `type`
- `title`
- `status`
- `detail`
- `instance` when available

PURISTA extension members:
- `traceId`
- `errors` for validation details
- `details` for safe structured framework-specific metadata when needed
- optionally `errorCode` later if PURISTA introduces stable public problem identifiers

### Proposed HTTP response shape
Validation example:

```json
{
  "type": "https://purista.dev/problems/validation-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "Input validation failed",
  "traceId": "d5dbb17eec16e3c9fce9cf8adc766999",
  "errors": [
    {
      "code": "too_small",
      "message": "String must contain at least 3 character(s)",
      "path": ["username"]
    }
  ]
}
```

Unhandled example:

```json
{
  "type": "about:blank",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "Internal Server Error",
  "traceId": "d5dbb17eec16e3c9fce9cf8adc766999"
}
```

## 2. Introduce an explicit HTTP mapping layer
Add a dedicated mapper in the HTTP package, for example:

- `toProblemDetails(error, requestContext)`
- `getProblemTypeUri(status, error)`

This mapper is responsible for converting:
- `HandledError`
- `UnhandledError`
- validation failures
- unknown thrown values

into RFC 9457 responses.

This logic should live in the HTTP adapter layer, not in core event-bridge helpers.

Reason:
- HTTP has RFC 9457 semantics.
- internal event-bridge command responses do not need to be forced into that contract yet.
- this keeps the change small and isolates compatibility risk.

## 3. Define deterministic field mapping
### Base mapping
| Current PURISTA field | RFC 9457 field | Rule |
| --- | --- | --- |
| `status` | `status` | copy |
| `message` | `detail` | use as occurrence-specific detail |
| HTTP status text | `title` | derive from status code |
| n/a | `type` | stable URI or `about:blank` |
| request path or trace URL | `instance` | optional |
| `traceId` | `traceId` | extension member |
| `data` | `errors` or `details` | normalize by error kind |

### Validation mapping
If the current error `data` contains validation issues, map it to `errors`, not generic `details`.

That aligns with the RFC example pattern and gives clients a stable place for validation diagnostics.

### Unknown or unsafe internal errors
For `UnhandledError` and unknown exceptions:
- `title` should match the HTTP status reason phrase.
- `detail` should default to a safe generic message for 5xx errors.
- `traceId` should always be included when available.
- internal stack traces, causes, and arbitrary thrown values must not be serialized into the HTTP response body.

## 4. Use stable problem type URIs
Phase 1 should use a small, deterministic set of problem type URIs for common cases.

Recommended initial mapping:
- `about:blank` for generic/unclassified errors
- `https://purista.dev/problems/validation-error`
- `https://purista.dev/problems/unauthorized`
- `https://purista.dev/problems/forbidden`
- `https://purista.dev/problems/not-found`
- `https://purista.dev/problems/conflict`
- `https://purista.dev/problems/rate-limit`
- `https://purista.dev/problems/internal-server-error`

Notes:
- RFC 9457 allows `about:blank`, but absolute URIs are recommended when possible.
- If PURISTA owns a problem type URI namespace, those pages should later serve human-readable docs.
- phase 1 can ship with the stable URIs even if the documentation pages are added later.

## 5. Negotiate error content type deliberately
Phase 1 recommendation:
- for all HTTP error responses generated by PURISTA HTTP adapters, return `application/problem+json`
- do not continue returning plain `application/json` for framework-generated errors

Reason:
- predictable contract
- simpler client integration
- aligns runtime and OpenAPI behavior

Alternative content negotiation for HTML/Markdown can be added later, but it should not block the standard JSON problem-details rollout.

## 6. Update OpenAPI generation
OpenAPI for HTTP-exposed commands and streams must describe RFC 9457 responses.

That includes:
- `application/problem+json` instead of `application/json` for framework-generated error responses
- schema definitions for the base problem object
- problem-specific extensions for validation errors

Recommended schema strategy:
- define a reusable base `problemDetails` schema
- define `validationProblemDetails` extending it with `errors`
- use those schemas consistently for generated error response codes

## 7. Keep internal error envelopes unchanged in phase 1
Do not change these in phase 1:
- `ErrorResponsePayload`
- `CommandErrorResponse`
- `createErrorResponse(...)`
- event-bridge internal error handling contracts

Reason:
- these are not HTTP-only concerns
- changing them has wider blast radius
- the HTTP adapter can map from the current internal error model without weakening runtime correctness

## Rollout Plan
### Phase 1
- Add HTTP-level problem-details mapper in `@purista/hono-http-server`.
- Return `application/problem+json` for framework-generated errors.
- Update OpenAPI generation to use problem-details schemas.
- Add tests for runtime responses and OpenAPI output.
- Update error-handling documentation.

### Phase 2
- Evaluate whether core should expose a reusable `ProblemDetails` type for adapters.
- Consider aligning internal error helpers with a shared normalization layer, while still preserving event-bridge contracts.
- Add negotiated alternate renderers for the same normalized problem model.
- Optionally add HTML and Markdown error representations for browser and agent-facing scenarios.

## Phase 2: Negotiated Markdown Problem Rendering
After RFC 9457 JSON is stable, PURISTA can adopt the useful part of the Cloudflare approach: content-negotiated alternate error renderers driven by the same normalized problem-details object.

### Recommendation
Keep `application/problem+json` as the canonical machine contract and add optional renderers for:
- `text/markdown` for agent- and LLM-friendly error explanations
- later `text/html` for browser-facing error pages

The important design rule is that JSON remains the source contract. Markdown is a rendering of the same semantic error, not a separate error model.

### Why Markdown is useful
Markdown can be valuable for agent workflows because it can:
- reduce prompt-side reformatting work
- make remediation guidance more legible to humans and agents
- allow compact sections like summary, likely cause, next step, and trace identifier

Example shape:

```md
# Bad Request

Input validation failed.

## Validation errors
- `username`: String must contain at least 3 character(s)

## Trace
- `traceId`: d5dbb17eec16e3c9fce9cf8adc766999
```

### Negotiation model
Recommended response negotiation order:
- `Accept: application/problem+json` -> RFC 9457 JSON
- `Accept: text/markdown` -> Markdown rendering of the same problem
- later `Accept: text/html` -> browser-oriented rendering
- fallback -> `application/problem+json`

### Architectural rule
The implementation should normalize once and render many times:

```text
Thrown error
  -> normalize to ProblemDetails
  -> render as application/problem+json | text/markdown | later text/html
```

This keeps behavior coherent across representations and avoids duplicating mapping logic.

### Scope boundary
Phase 2 should live in the HTTP adapter layer, not in core event-bridge types. The adapter is the right place for:
- `Accept` negotiation
- renderer selection
- representation-specific headers

### Risks
- representation negotiation increases testing surface
- Markdown responses must remain deterministic and compact
- Markdown must not expose more internal data than JSON does

### Recommendation
Capture Markdown rendering as a follow-up after RFC 9457 JSON lands. The Cloudflare idea is worth adopting, but only after PURISTA has one stable normalized HTTP problem model in place.

## Implementation Notes
### Recommended package boundaries
#### `@purista/core`
Keep current internal error model in phase 1.

Optional additive improvement:
- add a helper that exposes safe error normalization primitives without changing the internal command error payload contract.

#### `@purista/hono-http-server`
Implement the HTTP-facing behavior here:
- RFC 9457 serialization
- content type setting
- OpenAPI schemas
- validation error normalization

### Streams
For aggregate-mode stream endpoints:
- final error responses should also use `application/problem+json` when the HTTP request itself fails
- the declared success schema remains unchanged for successful final payloads

For SSE stream mode:
- in-stream error frames remain transport/protocol specific
- RFC 9457 applies to the HTTP response body when the request fails at the HTTP boundary, not to every SSE event frame

## Test Plan
### Runtime tests
- 400 validation error returns `application/problem+json`
- 400 validation error includes `type`, `title`, `status`, `detail`, `traceId`, `errors`
- 401/403/404/409/429 handled errors map to stable problem types
- 500 unknown error returns safe generic detail without stack trace leakage
- trace header propagation still works

### OpenAPI tests
- generated error responses use `application/problem+json`
- error schemas match problem-details shape
- validation responses expose `errors`

### Regression tests
- internal `CommandErrorResponse` stays unchanged
- event-bridge command invocation error flows remain compatible
- stream aggregate behavior keeps declared success payloads unchanged

## Risks
- Some existing HTTP clients may currently parse `message` directly and will need to switch to `detail`.
- Some downstream tests may assert `application/json` and will need updates.
- OpenAPI-generated SDKs may regenerate different error types after this change.

These are acceptable changes because the issue explicitly targets standards compliance at the HTTP boundary.

## Recommendation
Implement phase 1 now in `@purista/hono-http-server` and document it as an HTTP contract improvement.

Do not couple that work to a core event-bridge payload redesign. That redesign may be worthwhile later, but it is not required to solve issue #258 cleanly.

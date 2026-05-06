# Testing, Observability, And Deployment

Use this reference when validating or operating a PURISTA app.

## Testing
Test declared boundaries and runtime wiring:
- command tests should use command context helpers or service instances
- subscription tests should assert consumed event behavior
- stream tests should verify chunks and final payloads
- queue worker tests should cover retry/ack/dead-letter behavior when relevant
- agent tests should use `@purista/ai/testing`

Avoid tests that only validate raw helper functions while skipping builder metadata and runtime wiring.

## Observability
PURISTA core wraps service, command, stream, subscription, queue, and HTTP execution with logger and OpenTelemetry context. Package code should preserve those context surfaces.

For AI:
- `@purista/ai` bridges PURISTA logger into harness logger
- `ai.telemetry` passes harness telemetry options into `@purista/harness`
- harness model/tool calls can emit spans and metrics through its OpenTelemetry shim
- stream chunks preserve run identity and provider-style event names

## Logging
Use context logger surfaces instead of ad hoc loggers:
- `context.logger`
- service-level logger
- AI `context.logger`
- harness logger bridge where model/tool runtime is involved

## Deployment
Choose topology after architecture:
- event bridge selection follows delivery semantics
- queue bridge selection follows durability semantics
- HTTP server selection follows exposed contracts
- AI provider selection stays optional app runtime wiring

## Verification
Name the commands used:
- package build
- package tests
- package lint
- dependency-cycle checks for shared packages
- stale-reference scans when removing protocols or optional dependencies

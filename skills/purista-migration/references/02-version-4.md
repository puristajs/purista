# Version 4 Migration

PURISTA 4 adds static architecture diagnostics, a standalone event-only
Scheduler Runtime, explicit observability ownership, RFC 9457 HTTP Problem
Details, typed metrics, and explicit state retention. Apply only the sections
that affect the application; features that are not adopted do not require a
synthetic migration.

## Public Core imports

Application builders and runtime APIs belong at `@purista/core`. Move test
harness imports to `@purista/core/testing`, outbound client APIs to
`@purista/core/client`, and adapter-author base classes or protocol internals
to `@purista/core/adapter` only when the project implements an adapter. Do not
blindly move ordinary application imports to `/adapter` or retain deep imports.

## Schedules

A service declares a schedule, but a separate Scheduler Runtime process reads
the exported JSON manifest and emits one regular event. It does not boot
business services or execute handler logic.

For recurring work, migrate command or queue schedule targets to this boundary:

```text
schedule declaration -> trigger event -> subscription or event-to-queue binding -> queue worker or agent
```

Make downstream business effects idempotent with
`message.schedule.occurrenceId`. In replicated production hosts use a shared
EventBridge and a scheduler provider with distributed occurrence claims, such
as `@purista/redis-scheduler-provider`; enable strict mode and require those
claims. `DefaultSchedulerProvider` is local/test-only.

## Architecture diagnostics

Export the existing service-definition inventory, then use the installed CLI to
inspect it, enforce strict validation, and diagnose the project. Repair missing
references, invalid topology, and generated-project gaps in source; do not
waive diagnostics without a documented, bounded reason.

## Observability

Keep the established flat `getInstance(...)` configuration. Configure logging,
tracing, and metrics on each adapter at construction and separately on each
service instance. Adapters may be shared by several services, so a service
must never mutate or inherit configuration into them. Reuse one application
configuration object explicitly where the same settings are intentional.

Applications still own OpenTelemetry SDK setup, exporters, collectors, and
Prometheus exposure. Do not add secrets, tenant identifiers, prompts,
completions, raw payloads, headers, or attachments to traces, logs, or metrics.

## HTTP errors

Generated Hono endpoints now expose RFC 9457 Problem Details as
`application/problem+json`. Update HTTP consumers that deserialize the prior
error body; test validation errors, authorization failures, safe trace IDs,
and unhandled server errors. EventBridge transport error envelopes do not
change merely because the HTTP boundary does.

## State and attached agents

Choose a StateStore retention policy deliberately. Finite retention needs an
atomic-expiry backend. Attached-agent conversation history is service-store
backed by default; configure a dedicated store only for a real isolation or
retention boundary. Review `history.maxTurns`, `history.maxBytes`, idle expiry,
tenant and principal namespaces, workflow delegation allowlists, and stream
visibility as one data-lifecycle change.

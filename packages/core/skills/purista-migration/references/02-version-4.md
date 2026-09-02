# Version 4 Migration

PURISTA 4 is a clean breaking release. Do not add compatibility shims, dual
registration, legacy overloads, or fallback runtime paths. Upgrade framework,
CLI, adapters, generated code, documentation, and tests as one version set.

## Core package boundaries

Application builders and runtime APIs belong at `@purista/core`. Test helpers
belong at `@purista/core/testing`, outbound clients at
`@purista/core/client`, and adapter-author APIs at `@purista/core/adapter`.
Remove deep imports.

## Native Harness service mounting

V4 removes the generated attached-agent model. Delete `AgentQueueBuilder`,
`getAgentQueueBuilder`, `addAgentDefinition`, `setHarnessAgent`,
`setHarnessWorkflow`, `setRunFunction`, and the generated agent
command/stream/queue/worker assumptions.
Remove the obsolete `agentPath` option from `purista.json`. Native Harness
modules use `src/harness/<service>`, independent of Framework service paths.

Migrate in this order:

1. Define agents, workflows, tools, skills, MCP servers, guardrails, model
   requirements, schemas, and update modes with native `@purista/harness`.
   Compose focused native modules into one Harness definition per service.
2. Mount the immutable definition with
   one `ServiceBuilder.mountHarness(definition, policy)` call. Delete additional
   per-agent mounts and runtimes.
3. Publish only selected agent/workflow targets.
4. Bind PURISTA commands or typed host-tool handlers through the mount policy.
5. Declare consumer dependencies with address-first
   `canInvokeAgent(service, version, target, contract)` or
   `canInvokeWorkflow(...)`.
6. Call `.run(input)` or `.stream(input)`; every call crosses EventBridge.
7. Create ordinary commands, streams, queues, and workers only for the
   application contracts that need them.

`.run` returns a `RunOutcome`. Approval and external waits are
`interrupted` outcomes, not exceptions. A browser stream uses the separate
`@purista/harness-ai-sdk-ui/v1` adapter and AI SDK UI Message Stream v1.

Concrete models, admission, storage, memory, sandbox, sandbox binding,
workspace, artifacts, logger, and telemetry are supplied under the service
`ai` instance config. PURISTA StateStore is not Harness checkpoint storage,
and transactional records remain behind database resources.

Testing is split by boundary: native Harness with `FakeModelProvider`,
PURISTA consumers with context mocks and address-first stubs, and transport
adapters with protocol fixtures.

## Schedules

A service declares a schedule, while a separate Scheduler Runtime reads the
exported manifest and emits a regular event. It does not boot business services
or execute handler logic. Make downstream effects idempotent with
`message.schedule.occurrenceId`; use a distributed claim provider in
replicated production.

## Architecture diagnostics

Export the service-definition inventory and use the installed CLI to validate
and diagnose it. Repair missing references and invalid topology in source.

## Observability

Applications own OpenTelemetry SDK setup, exporters, collectors, and
Prometheus exposure. Adapters may inherit service-owned telemetry before they
start. Never capture secrets, tenant identifiers, prompts, completions, raw
payloads, headers, or attachments without an explicit data policy.

## HTTP errors and security

Generated Hono endpoints expose RFC 9457 Problem Details. They are protected by
default; mark only intentional anonymous endpoints public. Protection
middleware establishes trusted principal and tenant identity, while command or
mount guards authorize the requested business action.

## State retention

Choose StateStore retention explicitly and require an atomic-expiry backend for
finite retention. Keep database truth, application/session key-value state,
Harness conversations/checkpoints, and sandbox/workspace files in their
respective ownership boundaries.

# Agent Specifications

Status: active routing document.

Use
[88-harness-first-service-integration.md](./88-harness-first-service-integration.md)
as the active implementation contract for PURISTA Harness work. Current
implementation and public handbook/API docs remain the source material for
skills and user-facing documentation.

## Active Decision

PURISTA mounts one native `@purista/harness` definition on a service. Native
Harness modules compose agents, workflows, tools, Skills, and guardrails before
that single deployment boundary. Core owns addresses, EventBridge delivery,
trusted identity, business guards, resources, queue bindings, lifecycle, and
testing adapters. Harness owns its definitions and runtime behavior.

The unreleased `@purista/ai` and `AgentQueueBuilder` designs are removed without
compatibility wrappers. Provider, persistent storage, MCP transport, sandbox,
artifact, and browser protocol adapters remain application dependencies.

## Superseded Guidance

All older guidance in `specs/20-agents` is superseded where it conflicts with
the active plan. In particular, future agents must not follow guidance that:

- keeps PURISTA agent integration in `@purista/ai`
- preserves `@purista/ai` as an optional integration package
- adds a PURISTA-owned agent or workflow builder
- mounts more than one Harness definition on a service
- wraps every target in a generated command, stream, queue, or worker
- defines `@purista/ai/protocol` or `AgentProtocolEnvelope` as an active runtime
  boundary
- treats `context.ai` as the canonical handler surface
- emits or depends on `purista-ai:*` run-state artifacts
- makes AI SDK UI Message Stream v1 part of the portable Harness execution
  contract instead of a separate browser adapter

The older `77-ai-harness-integration-strategy.md`,
`78-clean-ai-package-architecture.md`, and `80-core-ai-migration-plan.md`
documents are retained only as superseded history.

## Routing

- Framework implementation, architecture, CLI, docs, and examples should use
  [88-harness-first-service-integration.md](./88-harness-first-service-integration.md).
- User-facing skill updates must not reference internal specs. They should use
  current implementation and public handbook/API docs, then run
  `npm run audit:skills` and `npm run audit:knowledge`.
- The `purista-skill-maintainer` workflow is the exception: it may use active
  specs to keep implementation, public docs, examples, and user-facing skills
  aligned.
- Historical documents may be read for rationale only. Treat their public API
  designs as superseded unless the active contract explicitly retains them.

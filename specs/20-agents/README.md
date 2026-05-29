# Agent Specifications

Status: active routing document.

Use [80-core-ai-migration-plan.md](./80-core-ai-migration-plan.md) as the
active migration record for PURISTA agent work. Current implementation and
public handbook/API docs remain the source material for skills and user-facing
documentation.

## Active Decision

PURISTA agent integration moves into `@purista/core`. The unreleased
`@purista/ai` package is removed rather than wrapped for compatibility.
`@purista/harness` becomes a direct, provider-neutral dependency of
`@purista/core`, and provider packages such as `@purista/harness-*` remain
application-level dependencies only.

Core owns the service builder integration, agent builder/types, queue-backed
execution wiring, harness runtime integration, and core testing helpers listed
in the migration plan. Provider-specific packages, Vercel AI SDK adapters,
OpenAI, Anthropic, Bedrock, MCP SDK, and sandbox driver packages must not become
core dependencies.

## Superseded Guidance

All older guidance in `specs/20-agents` is superseded where it conflicts with
the active plan. In particular, future agents must not follow guidance that:

- keeps PURISTA agent integration in `@purista/ai`
- preserves `@purista/ai` as an optional integration package
- keeps agent builders, handler context, manifests, or runtime wiring outside
  `@purista/core`
- defines `@purista/ai/protocol` or `AgentProtocolEnvelope` as an active runtime
  boundary
- treats `context.ai` as the canonical handler surface
- emits or depends on `purista-ai:*` run-state artifacts
- uses `AiSdkProvider`, Vercel AI SDK UI-message streams, or
  `streamProtocolAdapter` as PURISTA runtime design

The older `77-ai-harness-integration-strategy.md` and
`78-clean-ai-package-architecture.md` documents are retained only as superseded
history. Their old package-boundary recommendations have been replaced by
`80-core-ai-migration-plan.md`.

## Routing

- Framework implementation, architecture, CLI, docs, and examples should use
  [80-core-ai-migration-plan.md](./80-core-ai-migration-plan.md) for migration
  history and current ownership decisions.
- Skill updates must not reference internal specs. They should use current
  implementation and public handbook/API docs, then run `npm run audit:skills`
  and `npm run audit:knowledge`.
- Historical documents may be read for rationale only. If they mention
  `@purista/ai`, `context.ai`, `purista-ai:*`, `AiSdkProvider`, or
  `streamProtocolAdapter`, treat those references as superseded unless the
  migration plan explicitly lists the term as removed or forbidden.

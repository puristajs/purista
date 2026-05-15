# `@purista/ai` and `@purista/harness` Integration Strategy

Status: superseded by [80-core-ai-migration-plan.md](./80-core-ai-migration-plan.md).

This historical strategy previously recommended using `@purista/harness` as the
generic runtime kernel while keeping PURISTA agent integration in `@purista/ai`.
That package-boundary decision is no longer active.

The final decision is:

- PURISTA agent integration moves into `@purista/core`.
- `@purista/ai` is removed with no compatibility wrapper.
- `@purista/harness` is a direct provider-neutral dependency of
  `@purista/core`.
- Provider packages remain application-level dependencies.

Any references from the superseded strategy to `@purista/ai`,
`@purista/ai/protocol`, `context.ai`, `purista-ai:*`, `AiSdkProvider`, Vercel AI
SDK stream protocols, `ui-message`, `AgentProtocolEnvelope`, or
`streamProtocolAdapter` are historical context only and must not be used as
active implementation guidance.

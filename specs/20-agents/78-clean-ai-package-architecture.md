# Clean `@purista/ai` Package Architecture

Status: superseded by [80-core-ai-migration-plan.md](./80-core-ai-migration-plan.md).

This historical architecture previously described a clean harness-backed
`@purista/ai` package and explicitly kept AI-specific builders and runtime
integration outside `@purista/core`. That decision is no longer active.

The final decision is:

- PURISTA agent integration moves into `@purista/core`.
- `@purista/ai` is removed with no compatibility wrapper.
- `@purista/harness` is a direct provider-neutral dependency of
  `@purista/core`.
- Provider packages remain application-level dependencies.

Do not implement the old `@purista/ai` public API inventory, optional dependency
boundary, `@purista/ai/testing` helpers, `@purista/ai/protocol` removal plan, or
CLI generation rules from this document. Use the API and ticket scopes in the
active migration plan instead.

Any references from the superseded architecture to `@purista/ai`, `context.ai`,
`purista-ai:*`, `AiSdkProvider`, Vercel AI SDK stream protocols, `ui-message`,
`AgentProtocolEnvelope`, or `streamProtocolAdapter` are historical context only
and must not be used as active implementation guidance.

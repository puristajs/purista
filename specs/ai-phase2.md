# PURISTA AI Phase 2 Notes

Status: superseded.

This file previously mirrored an unreleased `@purista/ai` runtime contract. That
contract is obsolete and must not be used for implementation, documentation, or
skill guidance.

The implemented direction is:

- PURISTA agent integration lives in `@purista/core`.
- `@purista/ai` has been removed and has no compatibility wrapper.
- `@purista/harness` is the provider-neutral runtime dependency used by core
  agent support.
- Provider packages remain application-level dependencies.
- Old protocol concepts such as `AgentProtocolEnvelope`, `purista-ai:*`,
  `AiSdkProvider`, `streamProtocolAdapter`, `ui-message`, `context.ai`,
  `invokeAgent`, and `context.invoke.agents.*` are removed historical terms.

Use `specs/20-agents/80-core-ai-migration-plan.md` for migration history and
current agent ownership details.

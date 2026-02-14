# Provider Abstraction and Tooling

## Provider adapter contract

Minimal required capabilities:

- `generate()` for one-shot completion.
- `stream()` for token/chunk streaming.
- `embed()` optional.
- Structured output mode with schema validation.

## Tool calling contract

- Tools are typed functions with schema-defined input/output.
- Runtime validates model-emitted tool arguments.
- Tool result becomes typed context for next step.

## MCP integration

- MCP resources/tools exposed as ToolRegistry providers.
- MCP errors mapped to typed Purista agent errors.
- Optional allowlist policy per service.

## Error taxonomy (draft)

- `ProviderAuthError`
- `ProviderRateLimitError`
- `ProviderTransientError`
- `ToolValidationError`
- `ToolExecutionError`
- `MemoryAccessError`
- `PolicyViolationError`
- `AgentTimeoutError`

## Compatibility notes

- Not all providers support native tool-calling equally.
- Adapter must expose capability flags.
- Planner/orchestrator behavior must branch by capabilities.

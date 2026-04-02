# PURISTA AI Realignment Wave (Status Mirror)

This file mirrors the current AI runtime contract after the stream-first realignment in `@purista/ai`.
Canonical long-form architecture remains in `/Users/sebastianwessel/projekte/@purista/specs/20-agents/`.

## Scope of this wave

- keep agents as PURISTA-context-native runtimes (no standalone executor DX)
- unify invocation behavior across `invokeAgent`, `AgentInstance.invoke`, and `context.invoke.agents.*`
- keep canonical target fixed to `run`
- keep stream-first defaults while allowing final-result usage on top of the same contract
- clean top-level exports so internal runtime/platform internals are no longer public API

## Implemented runtime contract

1. Canonical invocation path
- shared internal transport module now drives:
  - `runtime/invokeAgent.ts`
  - `runtime/AgentInstance.ts`
  - `runtime/context.ts` (`context.invoke.agents.*`)
- default delivery mode: `prefer-stream`
- strict streaming mode: `require-stream`

2. Delivery semantics
- stream session opens first by default
- fallback to command invoke is allowed only in `prefer-stream`
- forwarding/live relay helpers use `require-stream` and fail fast if stream support is missing

3. Canonical target
- agent receiver target is centrally defined and fixed to `run`
- scattered hardcoded `'run'` literals were replaced in builder/runtime internals

4. `runObject` hardening
- `context.invoke.agents.runObject(...)` now:
  - parses final assistant text as JSON
  - validates against declared `outputSchema` from `.canInvokeAgent(...)` when available
  - allows per-call override schema via invocation options
  - throws `HandledError` with actionable diagnostics on parse/validation failure

5. Public API cleanup
- removed top-level exports from `@purista/ai` root:
  - `runtime/AgentExecutor`
  - `platform/index`
- implementation remains package-internal where still needed

## Validation coverage

- invocation transport tests:
  - stream-first success
  - fallback behavior
  - `require-stream` fail-fast behavior
- context invocation tests:
  - forwarding requires stream support
  - `runObject` schema validation (success + failure)
- agent instance tests:
  - parity with shared invocation transport behavior
- export surface test:
  - confirms internal runtime/platform exports are not exposed from package root

## Remaining intentional backlog

- no additional queue/provider expansion in this wave
- no CLI command surface for AI runtime operator controls in this wave
- no standalone execution architecture will be introduced unless a new canonical spec approves it

# Core AI Migration Plan

Status: active implementation plan for autonomous agents.

Date: 2026-05-15

Baseline commit: `4768cebb4` (`chore: baseline before core ai migration`)

## 1. Final Decision

Move PURISTA agent integration into `@purista/core`, remove `@purista/ai`,
and use `@purista/harness` as a direct provider-neutral dependency of core.

```text
@purista/core
  ServiceBuilder, AgentQueueBuilder, queues, workers, commands, streams,
  PURISTA agent integration, and harness runtime wiring

@purista/harness
  standalone generic model/tool/agent/workflow/session runtime
  no PURISTA imports

@purista/harness-* providers
  application-level dependencies only
```

There is no backward compatibility requirement for the unreleased `@purista/ai`
package. Delete obsolete code instead of preserving wrappers.

This file supersedes all previous `specs/20-agents` guidance that placed
PURISTA agent integration in `@purista/ai`, kept AI-specific behavior outside
core, treated `@purista/ai/protocol` as an active package boundary, used
`context.ai` as the canonical handler grouping, or made the Vercel AI SDK stream
protocol part of the PURISTA runtime design.

Historical terms such as `purista-ai:*`, `AiSdkProvider`,
`AgentProtocolEnvelope`, `streamProtocolAdapter`, `ui-message`, and
`context.ai` may appear in migration notes only as removed or forbidden
concepts. They are not active implementation guidance.

## 2. Rules For Every Agent

1. Start from the baseline commit above.
2. Read this file before making changes.
3. Stay inside the ticket write scope.
4. Do not touch `voyage`.
5. Do not reintroduce `@purista/ai`.
6. Do not create a compatibility wrapper package for `@purista/ai`.
7. Do not add provider packages to `@purista/core`.
8. Do not add Vercel AI SDK, OpenAI, Anthropic, Bedrock, MCP SDK, Docker,
   Podman, or sandbox driver dependencies to `@purista/core`.
9. Do not introduce `AiSdkProvider`, `AgentProtocolEnvelope`, `purista-ai:*`,
   `ui-message`, `streamProtocolAdapter`, or `context.ai`.
10. Do not invent public API names outside this plan and the updated specs.
11. Exported TypeScript APIs need concise IDE-friendly TSDoc/JSDoc.
12. Do not edit generated `dist`, coverage, or `node_modules`.

## 3. Target Public API

`@purista/core` owns the native developer surface. This list is authoritative:
public agent API names must appear here (rule 10). It reflects the implemented
and exported surface.

ServiceBuilder integration:

- `ServiceBuilder.getAgentQueueBuilder(agentName, description)`
- `ServiceBuilder.addAgentDefinition(...definitions)` — also registers any
  agent-local `defineMetric` definitions on the owning service

`AgentQueueBuilder` methods:

- schema: `addPayloadSchema`, `addParameterSchema`, `addOutputSchema`
- models and tools: `addModel`, `canInvoke`, `canInvokeAgent`, `useSkills`,
  `useBuiltInTools`
- metrics: `defineMetric` (agent-local; registered on the service)
- execution (exactly one): `setRunFunction`, `setHarnessAgent`,
  `setHarnessWorkflow`
- policies: `setExecutionPolicy`, `setExecutionProfile`, `setSessionPolicy`,
  `setSandboxPolicy`, `setWorkspacePolicy`, `setResponseMode`
- HTTP/stream exposure: `exposeAsHttpEndpoint`, `makeEndpointPublic`,
  `setStreamingMode`, `setSuccessEventName`
- output: `getManifest`, `getDefinition`

Exported types: `AgentDefinition`, `AttachedAgentDefinition`,
`AttachedCoreDefinition`, `AgentHandler`, `AgentHandlerContext`,
`AgentHandlerModelBindings`, `AgentManifest`, `AgentRunEvent`,
`AgentRunIdentity`, `AgentRunResult`, `AgentModelBinding`, `AgentModelCapability`,
`AgentRuntimeModelBinding(s)`, `AgentRuntimeOptions`, `AgentRuntimeRef`,
`AgentRuntimeInvocationInput`, `AgentRuntimeStreamInvocationInput`,
`AgentExecutionDefinition`, `AgentExecutionKind`, `AgentExecutionPolicy`,
`AgentSessionPolicy`, `AgentConversationScope`, `AgentSandboxPolicy`, `AgentWorkspacePolicy`,
`AgentWorkspaceCapabilityRequirement`, `AgentDurableWorkspaceStore(Policy)`,
`AgentHttpExposure`, `AgentResponseMode`, `AgentResponseModeOptions`,
`AgentQueueResultPolicy`, `AgentQueueResultPolicyMode`, `AgentQueueBuilderTypes`,
`AnyAgentQueueBuilderTypes`, `AllowedCommandToolDefinition`,
`AllowedAgentDefinition`, `CommandToolInvokeMap`, `AgentInvokeMap`,
`InferOptionalInput`, `InferOptionalOutput`, the `AgentSkill*` types, and the
`AgentRunError` class.

Testing helpers: `createAgentContextMock`, `createAgentTestHarness`,
`createScriptedHarnessModel`, `ScriptedHarnessModelProvider`,
`createAgentSkillTestRuntime`.

Selected harness re-exports required for DX: `ContentPart`, `ModelProvider`,
`ModelCapability`, `RunEvent`, `Session`.

Contract notes:

- Long-running response modes are `accepted`, `status`, `stream`, and `event`.
  There is no `callback` mode: callback delivery is not implemented, so the mode
  and a `callbackResourceName` option must not be reintroduced without a spec
  that defines callback transport, retries, and security.
- Sandboxing is opt-in per agent. `setSandboxPolicy({ enabled: false })` disables
  the sandbox for that agent even when a shared `ai.sandbox` is configured; a
  policy `adapter` takes precedence over the shared `ai.sandbox`; agents with no
  sandbox policy fall back to the shared `ai.sandbox`.
- AI telemetry is secure by default: core forces `contentCaptureMode:
  'NO_CONTENT'` unless the caller explicitly widens it. The harness telemetry
  option is `contentCaptureMode` (`'NO_CONTENT' | 'SPAN_ONLY' | 'EVENT_ONLY' |
  'SPAN_AND_EVENT'`); there is no `captureContent` flag.

Runtime configuration is supplied through core service instantiation:

```ts
await serviceBuilder.getInstance(eventBridge, {
  ai: {
    models,
    logger,
    stateStore,
    sandbox,
    runtime,
    workspaceStore,
    skills,
    telemetry: { contentCaptureMode: 'NO_CONTENT' },
  },
})
```

`ai.models` is required only when the service has attached agents.
`ai.runtime` and `ai.workspaceStore` are required only for agents that declare a
durable workspace policy.

## 4. Parallel Tickets

### TICKET-001 - Specs And Architecture Docs

Owner: spec agent.

Write scope:

- `specs/20-agents/**`

Required changes:

- Update active specs so `@purista/core` owns PURISTA agent integration.
- Mark `@purista/ai` as removed.
- State that `@purista/harness` is a direct core dependency.
- State that provider packages are app dependencies only.
- Supersede older specs that describe PURISTA AI protocol, Vercel AI SDK
  stream protocol, `context.ai`, or `@purista/ai` as the integration package.
- Update the AI specs README to route future agents to this plan.

Acceptance:

- Specs leave no ambiguity about package ownership.
- Specs contain no active instruction to keep AI outside core.
- Historical references must be labeled as superseded.

### TICKET-002 - Core Agent Builder And Types

Owner: core builder agent.

Write scope:

- `packages/core/src/ServiceBuilder/**`
- `packages/core/src/core/types/**`
- `packages/core/src/AgentQueueBuilder/**`
- `packages/core/src/index.ts`
- core tests that cover builder typing

Required changes:

- Move agent builder/types from `packages/ai/src/builder` into core.
- Add native `ServiceBuilder.getAgentQueueBuilder(...)`.
- Add native `ServiceBuilder.addAgentDefinition(...)`.
- Remove module augmentation and prototype patching from the design.
- Preserve cascading types for resources, payload, parameter, output, models,
  command tools, and child agents.
- Export the public agent API from `@purista/core`.

Acceptance:

- Agent builder methods autocomplete from `ServiceBuilder` imported from
  `@purista/core`.
- No side-effect import is needed.
- `AgentHandlerContext` has typed `resources`, `harness.models`,
  `invoke.tools`, and `invoke.agents`.

Verification:

```bash
npm run test -w @purista/core
npm run build -w @purista/core
```

### TICKET-003 - Core Agent Runtime Integration

Owner: core runtime agent.

Write scope:

- `packages/core/src/AgentQueueBuilder/**`
- `packages/core/src/core/Service/**`
- `packages/core/src/core/types/**`
- `packages/core/package.json`
- `package-lock.json`
- core runtime tests

Required changes:

- Move harness-backed executor, context, events, identity, logger, model
  binding, SSE, and state-store adapter logic into core.
- Add `@purista/harness` as a direct dependency of `@purista/core`.
- Initialize attached agent runtimes during `ServiceBuilder.getInstance`.
- Store runtime state per service instance; do not share mutable runtime refs
  between instances.
- Require `options.ai.models` only when attached agents exist.
- Keep agent execution queue-backed through normal core queue/worker/command/
  stream definitions.
- Expose allowed PURISTA commands as harness tools.
- Expose allowed child agents through normal PURISTA invocation.
- Support exactly one execution mode per agent:
  `setRunFunction`, `setHarnessAgent`, or `setHarnessWorkflow`.
- Support `setHarnessWorkflow(workflow, { agents })` by registering supplied
  harness-local agent definitions before the wrapped workflow so `ctx.agents`
  works inside that one harness session.
- Keep sandbox as an adapter hook only.

Acceptance:

- Two service instances created from one builder cannot overwrite each other's
  agent runtime.
- Core remains provider-neutral.
- No provider or sandbox driver dependency is added to core.

Verification:

```bash
npm run test -w @purista/core
npm run build -w @purista/core
```

### TICKET-004 - Remove `@purista/ai` Package

Owner: package cleanup agent.

Write scope:

- `packages/ai/**`
- root `package.json`
- root `package-lock.json`
- root `tsconfig.json`
- root `typedoc.json`
- package and website API docs that reference `@purista/ai`

Required changes:

- Delete `packages/ai`.
- Remove `@purista/ai` from workspaces, scripts, package references, and docs
  generation.
- Remove generated API docs for `@purista/ai`.
- Replace active docs links to `@purista/ai` with `@purista/core`.

Acceptance:

```bash
rg -n "@purista/ai|packages/ai" .
```

returns only intentional historical migration notes.

### TICKET-005 - CLI Agent Generation

Owner: CLI agent.

Write scope:

- `packages/cli/src/api/addPuristaAgent.ts`
- `packages/cli/src/api/content/agent/**`
- affected CLI tests and snapshots
- `packages/cli/README.md`

Required changes:

- Keep `add-agent`.
- Generate agent code that imports from `@purista/core`.
- Do not add `@purista/ai` to generated apps.
- Do not add `@purista/harness` directly to generated apps.
- Add provider packages only if a provider-specific scaffold is explicitly
  generated.
- Generated tests use core testing helpers.

Acceptance:

- Generated source contains no `@purista/ai`.
- Generated agent code uses native core cascading types.

Verification:

```bash
npm run test -w @purista/cli
npm run build -w @purista/cli
```

### TICKET-006 - Docs, Examples, And Website

Owner: docs/examples agent.

Write scope:

- `packages/core/README.md`
- `packages/cli/README.md`
- `web/src/content/**`
- `examples/**`
- generated TypeDoc output after API is stable

Required changes:

- Document agents as a core PURISTA primitive backed by harness.
- Explain that core is provider-neutral.
- Show provider installation through `@purista/harness-*` packages.
- Update examples to import `ServiceBuilder` and agent helpers from
  `@purista/core`.
- Remove active `@purista/ai` examples.
- Regenerate TypeDoc only after TICKET-002 and TICKET-003 pass.

Acceptance:

```bash
rg -n "@purista/ai|AiSdkProvider|AgentProtocolEnvelope|purista-ai|streamProtocolAdapter|context\\.ai" website examples packages
```

has no active usage.

### TICKET-007 - Skill Catalog Update

Owner: skill maintainer agent.

Write scope:

- `skills/purista/**`
- `skills/purista-skill-maintainer/**` only if maintenance guidance changes

Required changes:

- Update canonical skill guidance so agents are core builder/runtime
  primitives.
- Update `references/05-ai-harness-runtime.md`.
- Update package map, implementation workflow, and scaffolding references if
  they mention `@purista/ai`.
- Remove guidance that AI must remain outside core.
- Do not make the user-facing `purista` skill reference internal specs. It must
  be grounded in current implementation and public handbook/API docs.
- Keep the `purista-skill-maintainer` skill spec-aware so it can align active
  specs, implementation, public docs, examples, and user-facing skill guidance.
- Run `npm run audit:skills` and `npm run audit:knowledge`.

Acceptance:

- Future agents using `purista` skill generate core-based AI code.
- User-facing skill docs do not mention internal specs or `@purista/ai`.
- Agent/Claude guidance tells maintainers to keep skills, public docs, and
  specs aligned through the knowledge audits.

## 5. Final Integration Gate

Run after all tickets are merged:

```bash
npm run test -w @purista/core
npm run build -w @purista/core
npm run test -w @purista/cli
npm run build -w @purista/cli
npm run build
npm run test
npm run lint
```

Required searches:

```bash
rg -n "@purista/ai|packages/ai" .
rg -n "AiSdkProvider|AgentProtocolEnvelope|purista-ai|ui-message|streamProtocolAdapter|context\\.ai" packages examples website skills specs
rg -n "@purista/harness-openai|@purista/harness-anthropic|@purista/harness-bedrock|@ai-sdk|openai" packages/core
```

Expected result:

- no active `@purista/ai`
- no old AI protocol
- no Vercel AI SDK protocol
- no provider dependency in core
- `@purista/harness` appears in core as the provider-neutral runtime dependency

## 6. Implementation Status

The migration has been implemented in `@purista/core` and the standalone
`@purista/ai` package has been removed. The canonical lightweight example is
`examples/agent-example`; it demonstrates core-native agent definitions,
scripted harness model testing, generated queue/worker/command/stream
definitions, and provider-neutral application dependencies.

The canonical PURISTA skill catalog was updated in `skills/purista/**` and
`skills/purista-skill-maintainer/**`. Future skill maintenance must keep
`examples/agent-example`, the AI handbook pages, and this spec aligned whenever
the core agent builder or harness runtime contract changes.

## 7. Post-Migration Corrections

A correctness review of the implemented runtime produced the following fixes.
They are part of the active contract; the section 3 surface reflects them.

Runtime correctness:

- `context.metrics` is wired from the service metric context, and agent-local
  `defineMetric` definitions are registered on the owning service.
- Streaming runs propagate the abort signal to the harness model call, surface
  harness errors as `AgentRunError` instead of masking them as output-validation
  failures, and do not accumulate per-run events that are never consumed.
- Conversation session ids are namespaced by service/version/agent.
- `runtimeRevision` is a stable, change-sensitive digest.
- Service shutdown always releases core resources even if agent runtime
  shutdown fails, and reports all runtime shutdown failures.

Contract cleanups:

- Removed the half-implemented `callback` response mode and `callbackResourceName`.
- `AgentSandboxPolicy.enabled` is now honored as a per-agent opt-out.
- Telemetry uses `contentCaptureMode` and defaults to `'NO_CONTENT'`. The prior
  `captureContent` flag never existed in the harness and was removed from docs.
- Implemented previously-unused `AgentSkillDiscoveryOptions.includeAncestorProjectDirs`.
- Persistent conversation sessions require an explicit `'tenant'` or `'service'`
  scope. Core has no tenant fallback/runtime tenancy option: tenant scope uses
  authenticated `message.tenantId`, while service scope intentionally has no
  tenant partition.

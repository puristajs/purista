# AI Harness Runtime

Use this reference when implementing PURISTA agents.

## Contents
- [Current Model](#current-model)
- [Builder Pattern](#builder-pattern)
- [Runtime Wiring](#runtime-wiring)
- [Handler Context](#handler-context)
- [Optional Governance Policy](#optional-governance-policy)
- [Sandbox And Durable Workspaces](#sandbox-and-durable-workspaces)
- [AI Security And Privacy](#ai-security-and-privacy)
- [Streaming](#streaming)
- [Multimodal](#multimodal)
- [Testing](#testing)

## Current Model
`@purista/core` uses published `@purista/harness` to integrate agents into PURISTA services. Core does not expose the removed PURISTA AI protocol and does not adapt to Vercel AI SDK UI messages.

An attached agent is represented as normal PURISTA artifacts:
- queue for controlled concurrency/background execution
- queue worker for processing queued runs
- command for aggregate calls
- stream for live SSE events

## Builder Pattern
Use the CLI first for application code:

```bash
npm run add:agent -- triage --service support --service-version 1
```

Then refine the generated builder:

```ts
const triageAgent = supportService
  .getAgentQueueBuilder('triage', 'Classifies incoming support tickets')
  .addPayloadSchema(payloadSchema)
  .addOutputSchema(outputSchema)
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
  .setRunFunction(async context => {
    return await classify(context)
  })
```

Execution definitions are mutually exclusive:
- `setHarnessAgent(...)`
- `setHarnessWorkflow(...)`
- `setRunFunction(...)`

Use `setHarnessWorkflow(workflow, { agents })` when a wrapped
`@purista/harness` workflow calls harness-local agents through `ctx.agents`.
Core registers those harness-local agents before registering the workflow, so
they share the same attached-agent harness session, sandbox, state store,
telemetry setup, durable runtime, workspace store, and model bindings. Use
PURISTA `setRunFunction(...)` plus `canInvokeAgent(...)` instead when the child
agents need independent queues, retries, HTTP exposure, service ownership,
sandboxes, or model/runtime bindings.

## Runtime Wiring
Applications bind concrete models at service startup:

```ts
await service.addAgentDefinition(await triageAgent.getDefinition()).getInstance(eventBridge, {
  queueBridge,
  ai: {
    telemetry: { contentCaptureMode: 'NO_CONTENT' },
    models: {
      primary: { provider, model: 'gpt-4.1-mini', capabilities: ['object'], retry: true },
    },
    sandbox,
    runtime,
    workspaceStore,
    harness: {
      modules: [supportModule],
      tools: approvedTools,
    },
  },
})
```

Startup fails fast when aliases or capabilities are missing.

`ai.harness.modules` is for static TypeScript modules imported and versioned by
the application. `ai.harness.tools` is an explicit application-owned tool
registry; each attached Harness definition still allowlists the tool ids it can
use. If an application imports Agent Plugins, inspect and approve them outside
Core first, then pass only its selected tool bindings here. Core does not load
plugin packages, decide trust, inject credentials, or run plugin hooks.

Governance policy is optional. Do not add governance configuration to generated
apps or simple agents by default. Use it only when a service needs central
policy-as-code for tool calls, approval, audit, or reuse of external policy
packs.

Runtime wiring may pass the published harness governance config through
`ai.governance`:

```ts
await service.addAgentDefinition(await agent.getDefinition()).getInstance(eventBridge, {
  queueBridge,
  ai: {
    models,
    governance: {
      mode: 'enforce',
      policies: [
        {
          kind: 'native',
          id: 'tool-policy',
          rules: [
            {
              id: 'audit-skill-read',
              tools: ['read'],
              effect: 'audit',
            },
          ],
        },
      ],
    },
  },
})
```

Configure provider retry on model aliases. `retry: true` is the default short
active retry policy. Use `retry: false` for strict request/response paths and
tests, or pass a policy object with `maxAttempts`, `maxActiveElapsedMs`,
`maxActiveDelayMs`, and `retryOn` when a service needs tighter budgets.
Long provider `Retry-After` windows are surfaced as `ModelError` metadata with
`retryKind: 'deferred'` and `retryAfterMs`; route those through queue or
workflow retry policy instead of sleeping inside the handler.

Model responses expose a normalized `finishReason`; `outcome` preserves raw
provider finish/status metadata for diagnostics and tracing. Application logic
should branch on `finishReason` first and use `outcome` for operations or
provider-specific reporting.

Default AI telemetry should not capture prompt or completion content. Core defaults `ai.telemetry` to `contentCaptureMode: 'NO_CONTENT'`; only widen it (`'SPAN_ONLY'`, `'EVENT_ONLY'`, `'SPAN_AND_EVENT'`) after a product-specific retention, redaction, consent, and access-control policy has been approved.

Keep telemetry ownership explicit:
- PURISTA service metrics are configured through service runtime `metrics`
- existing PURISTA tracing continues to use `spanProcessor`
- harness telemetry options are passed through `ai.telemetry`

PURISTA records service and agent wrapper metrics. `@purista/harness` owns GenAI semantic-convention metrics, model metrics, token metrics, model call spans, and tool call spans/metrics. Do not re-record token usage or model/tool metrics in PURISTA handlers.

## Sandbox And Durable Workspaces
Use `setSandboxPolicy(...)` when an attached agent needs mounted skills,
filesystem built-ins, MCP stdio tools, or code execution. Sandbox capabilities
such as `sandbox.snapshot`, `sandbox.resume`, and `sandbox.hibernate` describe
low-level sandbox session behavior.

Use `setWorkspacePolicy(...)` only when an attached agent must resume from
committed workspace state after queue retry, process restart, pause, or
hibernate:

```ts
const agent = service
  .getAgentQueueBuilder('researchReport', 'Builds a research report')
  .setWorkspacePolicy({
    mode: 'durable',
    required: true,
    cleanup: 'on_terminal',
  })
```

Runtime wiring supplies the harness durable runtime and workspace stores:

```ts
await service.addAgentDefinition(await agent.getDefinition()).getInstance(eventBridge, {
  queueBridge,
  ai: {
    models,
    runtime,
    workspaceStore,
    sandbox,
  },
})
```

Required capabilities are validated at service startup. Common durable replay
requirements are `runtime.workspace_checkpoint`, `workspace_store.durable`,
`workspace_store.checkpoint`, `workspace_store.resume`, and `workspace_store.cleanup`. Add
`workspace_store.retention`, `workspace_store.encrypted_storage`, and `workspace_store.quota`
when production policy requires those guarantees.

Use `inMemoryDurableWorkspaceStore()` from `@purista/harness` for local
development and tests. Do not describe it as production persistence; production
services need a durable store that survives process restart and declares the
required `workspace_store.*` capabilities.

Keep ownership clear:
- `@purista/harness` owns workspace lifecycle, checkpoint references, workspace
  errors, and workspace operation telemetry
- `@purista/core` owns builder declaration, runtime binding, queue identity,
  startup validation, wrapper logs, and wrapper metrics
- product layers own retention durations, encryption key policy, tenant/project
  quotas, cleanup scheduling, UI, billing, and product records

Fresh ephemeral fallback must be explicit in the builder policy. Never treat a
sandbox snapshot as production durable workspace replay.

## Handler Context
Agent handlers use:
- `context.payload` and `context.parameter`
- `context.harness.models.<alias>` with capability-gated methods
- `context.invoke.tools[...]` for declared command tools
- `context.invoke.agents[...]` for declared child-agent aggregate calls
- `context.metrics` for service-level and agent-local custom metrics declared on builders
- `context.logger`

For a custom `setRunFunction(...)` handler, opt in to Harness-native model
completion events with `context.harness.models.<alias>.object(request,
context.signal, { emitRunEvents: true })` (and the equivalent text, embed, or
rerank calls).
Harness owns run identity, event ordering, redaction, and final status; custom
handlers cannot forge lifecycle events directly.

## Optional Governance Policy
`@purista/harness` owns the generic governance policy contract. PURISTA
attached agents pass it through as `ai.governance`, but normal PURISTA guards
and resources remain the authorization boundary. Omitted governance config
leaves harness behavior unchanged.

Use governance for controls that are specifically about agent/tool behavior:
- deny a model-requested tool call before the tool runs
- require approval before a sensitive tool call
- audit tool decisions in a central, content-redacted shape
- reuse policy packs from OPA/Rego, Microsoft AGT, Eve-policy, or other
  governance ecosystems through optional harness policy adapters

Do not use governance to replace:
- service `setBeforeGuardHooks(...)`
- tenant-scoped repositories/resources
- command authorization
- deterministic validation before canonical state mutation

PURISTA runtime wiring should pass tenant, principal, trace, correlation, and
conversation metadata to the harness explicitly and only as safe scalar
metadata. If an attached agent configures `require_approval` rules, provide a
harness `approval` adapter in `ai.governance`. Agents without governance must
not pay an approval, policy-engine, or audit-sink setup cost.

## AI Security And Privacy
Treat every agent as a service-owned data processor:
- attach the agent to the service that owns the capability and invariants
- allowlist command tools and child agents with `canInvoke(...)` and `canInvokeAgent(...)`
- pass only the minimum context needed for the model task
- redact or summarize PII, secrets, credentials, tokens, headers, raw payloads, transcripts, attachments, and proprietary data before model calls unless explicitly approved
- sandbox untrusted file access, code execution, or MCP-style tool access
- validate model output against schemas and apply canonical mutations through deterministic commands/resources
- preserve `tenantId`, `principalId`, `traceId`, `correlationId`, and agent `runId` across queued runs, tool calls, child agents, streams, and audit logs
- never use `correlationId`, message id, queue job id, or trace id as the logical AI conversation id
- keep prompt/completion content out of non-debug logs, metrics attributes, traces, queue metadata, and emitted events
- when governance is enabled, audit policy names, rule ids, effects, status,
  risk tags, and correlation metadata only; do not audit raw tool input/output
  unless an explicit product/legal retention policy owns encrypted storage,
  access control, and deletion

Agent-local metrics are declared with `AgentQueueBuilder.defineMetric(...)`:

```ts
const triageAgent = supportService
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
	.defineMetric('app.agent.escalations', {
		kind: 'counter',
		unit: '{escalation}',
		description: 'Tickets escalated by the triage agent',
		attributes: z.object({ priority: z.enum(['normal', 'high']) }),
	})
	.setRunFunction(async context => {
		context.metrics['app.agent.escalations'].add(1, { priority: 'high' })
		return await classify(context)
	})
```

## Streaming
AI stream endpoints emit SSE `event`/`data` chunks. The data payload follows provider-style event names:
- `response.created`
- `response.in_progress`
- `response.output_text.delta`
- `response.output_json.delta`
- `response.output_json.done`
- `response.tool_call.started`
- `response.tool_call.completed`
- `response.completed`
- `error`

Harness governance emits `policy.evaluated`, `policy.exposure`,
`approval.requested`, and `approval.finished` run events. PURISTA forwards
those as `response.output_json.delta` chunks with the original harness event in
`data.delta` so UIs and audit consumers can branch on the harness `type`.

Text and structured model deltas include `stream_id` when they originate from an
opted-in harness model stream. Use `stream_id` to aggregate chunks from one
model stream invocation. Use `agent_id`, `workflow_id`, and `model_alias` for
source attribution. UI labels, semantic buckets, and client-specific event names
belong in the application adapter, not in PURISTA core. OpenAPI chunk schema
comes from `agentSseEventSchema`.

## Multimodal
Use harness `ContentPart` and `agentContentPartSchema` for text, image, audio, and file content. Multimodal methods are capability-gated by model aliases such as `vision_input`, `audio_input`, and `file_input`.

## Testing
Use core testing helpers:
- `createAgentTestHarness(...)`
- `createScriptedHarnessModel()`
- `createAgentSkillTestRuntime(...)`
- `createAgentContextMock(...)`

Tests should verify output validation, model capability behavior, stream chunks, and declared invoke bridges.
For skill-backed agents, use `createAgentSkillTestRuntime(...)` to create temporary `SKILL.md` fixtures and pass `skillRuntime.skills` to `createAgentTestHarness(...)`; do not hand-roll ad hoc skill directories in generated examples. The helper is a deterministic test binding, not a production sandbox, workspace, or provider adapter.
Security-sensitive agent tests should also verify denied tools, missing tenant/principal metadata, redacted model input, sanitized errors, and no prompt/PII leakage in logs or telemetry fixtures.
Durable workspace tests should also verify missing capability startup failures,
resume after retry, cleanup behavior, explicit `required: false` fresh
ephemeral fallback, and
absence of workspace refs, file content, prompts, completions, tool inputs,
tool outputs, credentials, tokens, and raw headers from logs, metrics, traces,
queue metadata, and examples.

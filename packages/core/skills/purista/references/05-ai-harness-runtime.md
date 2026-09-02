# AI Harness Runtime

Use this reference when implementing PURISTA agents.

> **Redesign gate:** the attached-agent API below documents the shipped v3
> implementation. Do not use its aggregate queue/worker/command/stream model
> for new tutorials or v4 API design. A Harness-first, Core-owned
> `ServiceBuilder.mountHarness(...)` architecture is under review. Harness
> remains the only AI definition DSL. Verify the installed API for v3
> maintenance and do not present proposed v4 helpers as implemented.
> Proposed v4 invocations are address-first and always cross EventBridge; no
> service-builder reference or same-process direct-dispatch shortcut is valid.
> The owner-approved revision-9 proposal gives each agent/workflow one final
> output schema.
> Consumers choose `run` or a portable `stream`; the definition declares
> `none`, `text-delta`, or `object-snapshot` updates. Raw Harness diagnostic
> events are not the default cross-service or HTTP response contract. Browser
> streams use a named standard server-side projection. Vercel AI SDK UI Message
> Stream v1 is the only initial GA profile. Keep its encoder behind a narrow
> adapter boundary for future protocols, but do not implement other profiles in
> the first release or invent a PURISTA client protocol. Durable waits
> are interrupt outcomes and must never escape as errors or become HTTP 500.

## Contents
- [Current Model](#current-model)
- [Documentation Navigation](#documentation-navigation)
- [Builder Pattern](#builder-pattern)
- [Runtime Wiring](#runtime-wiring)
- [Handler Context](#handler-context)
- [Optional Governance Policy](#optional-governance-policy)
- [Guardrails And Sensitive Data](#guardrails-and-sensitive-data)
- [Sandbox And Durable Workspaces](#sandbox-and-durable-workspaces)
- [Enterprise Sandbox Boundary](#enterprise-sandbox-boundary)
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

## Documentation Navigation

Keep two user journeys distinct:

- The standalone runtime journey is the PURISTA Handbook **AI Harness** chapter:
  overview, quickstart, models/configuration, tools/skills, agents/workflows/state,
  guardrails/governance, testing/evaluations, observability/operations, then
  adapters/durability/reference.
- The PURISTA framework journey is Handbook **Core Building Blocks → AI Agent**:
  service attachment, builder/contract ownership, queue/stream delivery, and
  framework integration tests.

When answering an implementation question, link or route users to the first
journey for generic Harness behavior. Use the second only when a PURISTA
service, command, queue, stream, resource, or framework-owned identity/runtime
binding is involved. Do not duplicate standalone setup in framework guidance.

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
  .addModel('primary', { capabilities: ['object'] })
  .setRunFunction(async context => {
    return await classify(context)
  })
```

Execution definitions are mutually exclusive:
- `setHarnessAgent(...)`
- `setHarnessWorkflow(...)`
- `setRunFunction(...)`

When authoring the standalone Harness graph used by an attached agent, use the
same singular/plural vocabulary for every registry:
`.model/.models`, `.tool/.tools`, `.skill/.skills`, `.agent/.agents`, and
`.workflow/.workflows`. Singular calls are the normal inline path; in
particular, `.tool(id, definition)` derives the handler types from its schemas.
Plural calls accept cohesive pre-typed records. Calls accumulate and duplicate
ids fail instead of overwriting an earlier definition. Native tools are plain
definition objects; no identity helper or registration brand exists.

## Harness schema boundaries

In the standalone Harness definition, Zod is the default example library but
any Standard Schema validator is valid at agent, workflow, tool, and guardrail
validation boundaries. Preserve the schema object directly: do not add a
PURISTA wrapper or a provider-specific converter.

Only a TypeScript tool input and a default-loop Harness-agent output must also
implement Standard JSON Schema (`ModelSchema`). Harness projects those schema
inputs once during `.build()` to frozen Draft 2020-12 JSON Schema and passes the
owned JSON value unchanged to the model adapter. ArkType supports this directly;
Valibot needs `toStandardJsonSchema(...)` from `@valibot/to-json-schema` only
at those model-facing boundaries. Agent input, workflow input/output,
custom-handler output, tool output, and guardrail values need Standard Schema
validation only.

When a PURISTA service declares its own command/event schemas, continue to use
the Framework's Standard Schema guidance. The Harness requirement applies to
the embedded Harness runtime definition, not to unrelated service contracts.

Use `setHarnessWorkflow(workflow, { agents })` when a wrapped
`@purista/harness` workflow calls harness-local agents through `ctx.agents`.
Core registers those harness-local agents before registering the workflow, so
they share the same attached-agent harness session, sandbox, Harness storage,
telemetry setup, durable workspace, and model bindings. Use
PURISTA `setRunFunction(...)` plus `canInvokeAgent(...)` instead when the child
agents need independent queues, retries, HTTP exposure, service ownership,
sandboxes, or model/runtime bindings.

## Runtime Wiring
Applications bind concrete models at service startup:

```ts
await service.addAgentDefinition(triageAgent.getDefinition()).getInstance(eventBridge, {
  queueBridge,
  ai: {
    telemetry: { contentCaptureMode: 'NO_CONTENT' },
    models: {
      primary: { provider, model: 'gpt-4.1-mini', capabilities: ['object'], retry: true },
    },
    sandbox,
    // Harness-owned persistence; not PURISTA's general top-level StateStore.
    storage: harnessStorage,
    workspace,
  },
})
```

Startup fails fast when aliases or capabilities are missing.

Core constructs one shared Harness runtime per PURISTA service instance and
registers all attached Harness agents, workflows, and workflow-local agents in
it. The `ai` storage, workspace, sandbox, skills, governance, telemetry, and
model-provider instances are bound once and the Harness is shut down once when
the service is destroyed. Public model aliases remain definition-local: two
attached agents may both declare `primary` with different defaults, while Core
uses private service-runtime registry ids internally and preserves `primary`
inside callbacks and Framework events.

Treat the concrete adapter instances in `ai` as owned by that service instance.
Services may use the same remote backend, but should receive separate closable
client/adapter instances unless an adapter explicitly supports shared lifecycle
or reference counting.

For an application-owned durable human review, provide a Harness
`HarnessStorage` through `ai.storage` and declare `.setDurability(...)` on the
wrapped Harness workflow. It is one shared conversation/run/checkpoint/wait
adapter; the framework's generic key/value `StateStore` cannot substitute
for it. `ExternalWaitPendingError` is a normal queue suspension, not a failed
domain action. The application owns the guarded review task, reviewer identity,
outbox signal, digest comparison on resume, and final idempotent command; Core
does not provide review CRUD or a reviewer UI.

For attached workflows, use `ai.onSuspended` as the explicit queue
handoff: commit/publish the review task through the application outbox and
return a schema-valid `waiting` output. Without this callback Core propagates
the pending signal so delivery code cannot accidentally acknowledge the wait.

Governance policy is optional. Do not add governance configuration to generated
apps or simple agents by default. Use it only when a service needs central
policy-as-code for tool calls, approval, audit, or reuse of external policy
packs.

Runtime wiring may pass the published harness governance config through
`ai.governance`:

```ts
await service.addAgentDefinition(agent.getDefinition()).getInstance(eventBridge, {
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

There is one topology-transparent Harness `Sandbox` contract. Service
composition selects the adapter once through `ai.sandbox`; an agent policy only
selects `inherit`, `private`, or an already-configured named sharing group. It
must not branch on local versus multi-instance deployment, expose provider
references, or create a second business API. Use `ai.sandboxOptions` for the
closed group vocabulary, default policy, and explicit-owner authorization.
An optional policy `owner` resolver receives validated input and trusted run
identity, but authorization remains the Harness binding callback. No callback,
adapter, or resolved owner is serialized into an agent manifest.

For background child tasks, the default is a fresh task-run shared partition;
history remains private. Explicit sharing is selected in Harness workflow
policy, not by inspecting adapter topology. The service authenticates and
authorizes direct owner registration and `SandboxAdministration` cleanup.
Principal offboarding fences that principal but must not delete tenant-owned
state another authorized principal can still use.

Harness hashes tenant/principal-aware session and durable keys, so raw identity
does not appear in IDs. `attach` never creates missing state; `restore` is only
valid after a compatible committed durable workspace is bound. Missing state is
a `SandboxStateLostError`, never an empty replacement. Ephemeral terminal
results retain their receipt for idempotent run/stream replay but dispose
owned compute; retryable and suspended runs only release attachments. Borrowed
owners are detached, never deleted. `session.release()` detaches live Harness
resources while preserving stored state; `session.destroy()` explicitly
terminates owned compute and deletes the Harness session record. Do not confuse
these methods with `SandboxSession.close()`, which detaches one sandbox client
attachment.

## Enterprise Sandbox Boundary

`setSandboxPolicy(...)` cannot select or override the Harness adapter supplied
in `getInstance(..., { ai: { sandbox, sandboxOptions } })`; it does not create
a container, authorize a caller, or impose network and resource limits. Treat
the adapter as an explicit deployment boundary.

- Use the Harness `inMemorySandbox()` for files and bounded text search. It has
  no executor and is the safest zero-configuration default.
- Built-in `grep` requires `sandbox.text_search`, not command execution. Both
  default sandboxes provide it. A custom Docker, Kubernetes, microVM, or remote
  adapter executes `searchText(...)` where its files live, returns explicit
  completeness, and passes `sandboxTextSearchContract`; Harness does not use a
  core-side read, JavaScript regex, or shell fallback.
- Treat `bashSandbox()` as a trusted in-process helper, not a VM/container. It
  cannot host `mcp_stdio` because it has no long-lived-process `spawn` support.
- Treat local host-directory execution as a trusted-worker/durability option,
  not isolation for untrusted model-directed commands or tenant boundaries.
- `@purista/harness-sandbox-docker` is an optional local Docker/OrbStack
  adapter. Configure it only in the application composition root with a
  caller-prepared digest-pinned image and trusted local Docker access. It
  defaults to no network, executes bounded text search inside the guest, and
  does not yet provide durable-workspace recovery;
  a retained volume is not a workflow checkpoint.
- For self-hosted production execution, use
  `@purista/harness-sandbox-kubernetes` or another reviewed isolating adapter.
  The first-party runtime creates restricted non-root Pods, executes bounded
  search where files live, and optionally coordinates PVC generations with
  `VolumeSnapshot` checkpoints. The cluster still owns namespaced RBAC, Pod
  Security admission, egress, quotas/limits, CSI, image provenance, secrets,
  retention, and cleanup policy.
- A trusted Agent Plugin stdio server needs both spawn support and an immutable
  reviewed package mount. Neither the in-memory nor local host-directory
  sandbox provides this `mountReadOnly(...)` guarantee.

Keep domain authorization in PURISTA guards/resources and stage only
tenant-authorized files. A schema and a tenant-looking session ID validate a
shape or identify a run; neither grants access. For the implementation matrix,
MCP lifecycle, and negative-test baseline, use the public Handbook page
`/handbook/harness/secure-and-govern/sandbox-and-mcp/`.

Use `setWorkspacePolicy(...)` only when an attached agent must resume from
committed workspace state after queue retry, process restart, pause, or
hibernate:

```ts
const agent = service
  .getAgentQueueBuilder('researchReport', 'Builds a research report')
  .setDurability({ mode: 'required', runIdPath: ['requestId'] })
  .setWorkspacePolicy({
    mode: 'durable',
  })
```

Runtime wiring supplies Harness storage and the optional durable workspace:

```ts
await service.addAgentDefinition(agent.getDefinition()).getInstance(eventBridge, {
  queueBridge,
  ai: {
    models,
    storage: harnessStorage,
    workspace,
    sandbox,
  },
})
```

For replicated PURISTA services, use PostgreSQL for Harness control state and
the matched Kubernetes sandbox/workspace runtime for file-bearing recovery:

```ts
const storage = postgresHarnessStorage({
  connectionString: process.env.DATABASE_URL!,
})
const execution = kubernetesSandboxRuntime({
  namespace: process.env.PURISTA_SANDBOX_NAMESPACE!,
  image: process.env.PURISTA_SANDBOX_IMAGE!,
  runtimeId: 'research-v1',
  workspace: { snapshotClassName: process.env.PURISTA_VOLUME_SNAPSHOT_CLASS },
})

const serviceInstance = await service.getInstance(eventBridge, {
  ai: {
    models,
    storage,
    sandbox: execution.sandbox,
    workspace: execution.workspace,
  },
})
```

Each service instance receives its own adapter/client instances and constructs
one shared Harness internally for every attached agent and workflow on that
service. Replicas use the same stable Kubernetes `runtimeId` and PostgreSQL
backend so they coordinate the same logical scopes. Agent definitions never
branch on topology. Call `serviceInstance.destroy()` first, then close any
separately returned adapter runtime such as `execution.close()`. No S3 service
is required for the PVC/VolumeSnapshot path.

Required capabilities are validated at service startup. Common durable replay
requirements are `storage.workspace_checkpoint`, `workspace.durable`,
`workspace.checkpoint`, `workspace.resume`, and `workspace.cleanup`. Add
`workspace.retention`, `workspace.encrypted_storage`, and `workspace.quota`
when production policy requires those guarantees.

Use `localDurableExecution({ root, exec: false })` for low-effort, trusted
single-host development and recovery tests. Use `inMemoryDurableWorkspace()`
for unit tests. Do not describe either as distributed production persistence;
production services need adapters that survive process restart and declare the
required `storage.*` and `workspace.*` capabilities.

Keep ownership clear:
- `@purista/harness` owns workspace lifecycle, checkpoint references, workspace
  errors, and workspace operation telemetry
- `@purista/core` owns builder declaration, runtime binding, queue identity,
  startup validation, wrapper logs, and wrapper metrics
- product layers own retention durations, encryption key policy, tenant/project
  quotas, cleanup scheduling, UI, billing, and product records

Durability is fail-closed: omit `.setDurability(...)` for an intentionally
ephemeral workflow. Durable workspace files are the recovery guarantee; never
treat a sandbox snapshot, retained process, or Docker volume as durable
workspace replay.

## Handler Context
Agent handlers use:
- `context.payload` and `context.parameter`
- `context.harness.models.<alias>` with capability-gated methods
- `context.harness.events.emit(...)`
- `context.invoke.tools[...]` for declared command tools
- `context.invoke.agents[...]` for declared child-agent aggregate calls
- `context.metrics` for service-level and agent-local custom metrics declared on builders
- `context.logger`

## Optional Governance Policy
`@purista/harness` owns the generic governance policy contract. PURISTA
attached agents pass it through as `ai.governance`, but normal PURISTA guards
and resources remain the authorization boundary. Omitted governance config
leaves harness behavior unchanged.

Use governance for controls that are specifically about agent/tool behavior:
- deny a model-requested tool call before the tool runs
- require approval before a sensitive tool call
- audit tool decisions using the canonical content-free `DecisionEvidence`
- reuse OPA through `@purista/harness-policy-opa`, or another external engine
  through an application-owned `GovernancePolicyEvaluator`

Harness ships `@purista/harness-policy-opa` as a focused OPA Data API transport
and typed governance mapper. Use `createOpaClient(...)` plus
`opaPolicy(helpers, ...)`; explicitly minimize the correlated tool context,
validate the OPA result, and map it to a closed Harness decision. The package
owns safe URL/path handling, one request, cancellation/deadline forwarding,
bounded response parsing, undefined-document semantics, and content-free
errors. The builder's `adapter(...)` helper alone still preserves types only.
Embedded Cedar and AWS Verified Permissions remain different application-owned
evaluator topologies. In every case, the application owns authenticated
principal/resource resolution, credentials, policy distribution, rollout,
decision-log controls, and selected-engine integration tests.

Do not use governance to replace:
- service `setBeforeGuardHooks(...)`
- tenant-scoped repositories/resources
- command authorization
- deterministic validation before canonical state mutation

PURISTA runtime wiring should pass tenant, principal, trace, correlation, and
conversation metadata to the harness explicitly as validated, minimal JSON.
Metadata is application-supplied context, not proof of authentication. Keep it
separate from decision evidence; do not copy it
into evidence, reason codes, logs, or metrics. If an attached agent configures
`require_approval` permissions or policies, provide one Harness `approval`
provider in `ai.governance`. Agents without governance must
not pay an approval, policy-engine, or audit-sink setup cost.

| Boundary | Result | Owner |
| --- | --- | --- |
| Content | `allow`, `block`, phase-specific `transform` | Guardrails addon |
| Tool permission/policy | `allow`, `deny`, `require_approval`; policy also `audit` | Harness governance |
| Immediate approval | `approved`, `rejected` | Shared `GovernanceApprovalProvider` |
| Durable review | `ExternalWaitOutcome`, immutable execution claim/receipt | Harness wait; application review/execution |

For each tool call, static permission and policy approval demands are collected
into one request to the same provider. `require_approval` is a demand, not the
provider's return type. The provider returns `approved` or `rejected` with an
optional stable content-free `reasonCode`. Policy callbacks selecting multiple
tools narrow correlated parsed input by `toolId`; never cast one input shape
across tools. Policy, approval, audit, and rail callbacks have finite budgets;
propagate their effective `signal` and `deadline` to dependencies (approval and
audit receive execution context as their second argument). Cancellation,
timeouts, thrown callbacks, and malformed results fail closed. Late approval
does not run the handler.

Reason codes match `^[a-z][a-z0-9_]{0,63}$` and never derive from user content.
Configure the callback budget with Harness `defaults.decisionTimeoutMs`;
remaining invocation/tool deadlines and rail action caps may shorten it.

Application services own durable review records, reviewer identity, expiry,
guarded revision-CAS decisions, and restart-safe queue continuation. Do not
suspend a worker on an in-process Promise. Bind changed invocation data outside
replay-skipped steps. Before a new claim, reauthorize and verify approved
revision, action digest, target revision, definition version, and expiry;
atomically claim the immutable action under a stable execution ID. Execute that
claim and persist its receipt. Concurrent resumes and crashes reuse the same
claim/idempotency key/receipt. Never implement “read approved, then execute”,
mark consumed before success, or put review CRUD in Core. Admission is not
revocation after the side effect has been admitted.

## Guardrails And Sensitive Data

Use `@purista/harness-guardrails` only for a Harness **default-loop** agent.
Keep it in the application composition root; `@purista/core` deliberately has
no dependency on the optional addon. Set `guardrails` directly on the
default-loop Harness agent passed to `setHarnessAgent(...)` or
`setHarnessWorkflow(...)`; the normal PURISTA service boundary still owns
identity, guards, command/queue contracts, and the final mutation.

- Input, output, tool-input, and tool-output rails run automatically for the
  guarded default-loop agent. Retrieval is application-owned and requires an
  explicit `filterRetrievedChunks(...)` call before chunks enter agent input.
- Actions declare their exact `phase`; a narrower value requires a
  non-transforming `valueSchema`. Input rails see parsed agent input. Tool-input
  rails transform raw JSON arguments before the tool schema parses once;
  permission, governance, approval, and handler share that frozen parsed value.
  Tool-output rails see validated results and produce a model-facing JSON
  projection without reparsing. Output rails run only on final answer candidates;
  intermediate tool-call responses skip output rails. Final candidates run before
  the output schema parses once and before content events/persistence.
- A content block never requests approval or durable suspension. Direct model
  calls/custom handlers own their release boundary; automatic rails cannot
  inspect opaque provider reasoning or retract already released custom content.
- Author one typed inline `defineGuardrails({ config, actions })` declaration
  at the composition root. `config.rails` defaults to `{}` and binds ordered
  action IDs to their declared phases; `config.sensitiveData` carries only
  explicit `entities`, `maskToken`, and `scoreThreshold` policies. Register
  opaque action tokens, model aliases, and detector implementations in the
  same composition.
- Use exactly one injected `SensitiveDataDetector`: deterministic local native
  privacy for its documented subset, an authenticated private Presidio Analyzer
  sidecar for deployment-provided recognizers, local NER only with an explicitly
  installed and pre-provisioned model, or an application implementation. All
  detector failures fail closed. Do not claim Anonymizer, fake-value generation,
  image/PDF OCR, batch processing, hashing, or encryption from the detector
  contract.
- Use the Harness fake detector and Presidio/local-NER testing helpers in
  deterministic tests. Never copy detector requests, offsets, text, prompts,
  or findings into snapshots, logs, metrics, or spans.

Guardrail decisions are content-free Harness `GUARDRAIL` spans, metrics, and
structured logs. Blocks are expected enforcement decisions; action failures
are `DecisionEvaluationError`; expected blocks use `DecisionBlockedError`, both
from `@purista/harness`. Reuse safe evidence plus stable `reasonCode` or
`failureKind`, never exception text or input in an operational record.
A model-backed rail creates its normal nested model span, which is
the only source for provider/model and reported token/cost attribution. PURISTA
must not recreate those GenAI metrics.

For complete standalone setup, inline configuration/action patterns, detector
capability matrix, and production tests, route users to the public Handbook pages
`/handbook/harness/secure-and-govern/guardrails/` and
`/handbook/harness/secure-and-govern/privacy-detectors/`. The runnable Harness
`examples/guardrails`, `examples/bank-governance`, and
`examples/durable-human-review` are the composition, immediate approval, and
durable claim/receipt references; reuse them instead of inventing a second API.

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
- when governance is enabled, reuse `DecisionEvidence` exactly: `decisionId`,
  `source`, `phase`, optional `reasonCode`. Occurrence/source/phase/ordinal derive
  the ID; effect/enforcement/correlation belong to enclosing events/audit
  records and `failureKind` to the error. Never add tool values or metadata to
  the evidence shape

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
The same projection forwards content-free `model.completed` accounting and
external-wait events. Count completed model calls from `model.completed`, not
`model.object`; the latter releases a final validated, guarded value and must
not duplicate token totals. A blocked final candidate still has completion
accounting but no released object. Provider spans remain the metric owner.

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
For sandbox-backed agents, pass `sandbox` to `createAgentTestHarness(...)` to
exercise the same per-agent policy selection and public Harness lifecycle as
production. Assert scoped identity, attachment release, and state-loss behavior;
do not mock a second Framework-specific sandbox contract.
For skill-backed agents, use `createAgentSkillTestRuntime(...)` to create temporary `SKILL.md` fixtures and pass `skillRuntime.skills` to `createAgentTestHarness(...)`; do not hand-roll ad hoc skill directories in generated examples. The helper is a deterministic test binding, not a production sandbox, workspace, or provider adapter.
Security-sensitive agent tests should also verify denied tools, missing tenant/principal metadata, redacted model input, sanitized errors, and no prompt/PII leakage in logs or telemetry fixtures.
Durable workspace tests should also verify missing capability startup failures,
resume after retry, cleanup behavior, deliberately ephemeral definitions, and
absence of workspace refs, file content, prompts, completions, tool inputs,
tool outputs, credentials, tokens, and raw headers from logs, metrics, traces,
queue metadata, and examples.

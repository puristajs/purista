# Harness-first service integration

Status: approved implementation contract.

Approved by the repository owner on 2026-09-02. This is a clean v4 redesign.
There is no compatibility surface for `AgentQueueBuilder`, generated agent
commands or streams, raw Harness-definition merging, or the former attached
agent runtime.

This specification is normative. Specs 78 and 80 describe superseded
integration designs.

## 1. Goal

PURISTA orchestrates a native `@purista/harness` definition without copying its
agent, workflow, tool, Skill, guardrail, model, memory, sandbox, or output
contracts. A Harness definition runs standalone and can be mounted on a
PURISTA service unchanged.

The Framework adds only the responsibilities it already owns: versioned
addresses, EventBridge delivery, trusted identity, business guards, resources,
queues, events, HTTP/OpenAPI adapters, lifecycle, and testing helpers.

## 2. Public mental model

```ts
const supportAi = defineHarness({ name: 'support' })
  .requireModel('primary', {
    capabilities: ['text', 'text_stream', 'tool_use'],
  })
  .agent('answerQuestion', {
    model: 'primary',
    input: answerQuestionInputSchema,
    output: answerQuestionOutputSchema,
    updates: 'text-delta',
    instructions: 'Answer with the available tools and cite the source.',
  })
  .define()

const standalone = await supportAi.getInstance({
  models: {
    primary: {
      provider: openai({ apiKey: process.env.OPENAI_API_KEY! }),
      model: 'gpt-5.5',
      providerOptions: { reasoning: 'medium' },
    },
  },
})

const knowledgeV1ServiceBuilder = new ServiceBuilder(...).mountHarness(
  supportAi,
  {
    publish: { agents: ['answerQuestion'] },
  },
)

const knowledgeV1Service = await knowledgeV1ServiceBuilder.getInstance(
  eventBridge,
  {
    ai: {
      models: {
        primary: {
          provider: openai({ apiKey: process.env.OPENAI_API_KEY! }),
          model: 'gpt-5.5',
          providerOptions: { reasoning: 'medium' },
        },
      },
    },
  },
)
```

`define()` freezes a portable definition and contribution catalog.
`getInstance(...)` supplies concrete providers and infrastructure for standalone
use. `mountHarness(...)` supplies the same runtime through service instance
configuration. Definitions never contain credentials or deployment adapters.

## 3. Ownership and dependency rules

- `@purista/harness` owns the definition builder, final schemas, pure tools,
  host-tool contracts, agents, workflows, Skills, guardrails, model calls,
  memory, storage, sandbox/workspace semantics, interrupts, portable execution
  events, diagnostics, and standalone runtime.
- `@purista/core` depends on the provider-neutral Harness package and owns one
  mount adapter. It does not provide an agent, workflow, or AI-tool builder.
- Provider, persistent storage, MCP transport, sandbox, queue, and artifact
  adapters remain application dependencies.
- `@purista/harness` never imports PURISTA Framework packages.
- Hono and other HTTP servers remain AI-neutral. Native commands and streams
  explicitly project a published target to HTTP.
- A service without a Harness mount has no `ai` instance option and creates no
  Harness runtime.

## 4. Harness definition contract

The definition builder separates requirements from runtime bindings.

- `requireModel(alias, { capabilities })` declares a typed model requirement.
  The runtime binding supplies `provider`, `model`, provider options, defaults,
  retry, and admission settings.
- `tool(...)` declares a complete pure Harness tool with its handler.
- `hostTool(...)` declares an input/output contract without a handler. Every
  instance must bind it explicitly. The binding receives an opaque per-run host
  context and is never persisted, serialized, logged as content, or sent to a
  model.
- `agent(...)` and `workflow(...)` remain native Harness definitions.
- Every agent and workflow declares one final output schema.
- Every agent and workflow declares `updates: 'none' | 'text-delta' |
  'object-snapshot'`. The default is `none`.
- Custom-handler agents do not require unused `model` or `instructions`
  properties. They declare only the models and host capabilities they use.
- `define()` returns immutable metadata, schemas, requirements, and typed
  invokers. It does not initialize providers or infrastructure.

Definitions default to no tools, Skills, MCP servers, sandbox, workspace,
queue, HTTP exposure, persistent session, or durable execution.

## 5. Result, stream, diagnostics, and interrupts

Aggregate and streaming consumers use the same final contract.

```ts
type RunOutcome<Output, Interrupt = never> =
  | { status: 'completed'; runId: string; output: Output }
  | { status: 'interrupted'; runId: string; interrupt: Interrupt }
```

`run(input, options)` returns `RunOutcome`. Operational failures reject with a
typed Harness error. A wait for human input or approval is an `interrupted`
outcome and is never represented as an exception.

`stream(input, options)` yields a typed, ordered, lossless portable execution
stream. It contains lifecycle, declared output updates, model-visible tool
activity, and a terminal event carrying the same `RunOutcome` as `run`.
`observe(...)` exposes the broader diagnostic stream. Diagnostic events may be
bounded or dropped and are not a cross-service or browser contract.

The portable stream is provider-neutral. The initial browser projection is the
Vercel AI SDK UI Message Stream v1. Its encoder is a separate adapter with
conformance tests against the official parser/client. No PURISTA browser client
library or private JSON-over-SSE protocol is introduced. Future protocols use
separate adapters without changing Harness execution or EventBridge delivery.

Generated files use a provider-neutral artifact reference in Harness execution
and the standard AI SDK UI `file` part at the browser boundary. Provider URLs,
provider authentication headers, raw media bytes, and base64 payloads never
cross EventBridge. A configured artifact store owns the bytes and issues the
application URL. The URL may be signed or handled by an authenticated HTTP
route; Harness does not require it to be public.

Resume and approval decisions use authenticated, versioned addresses and carry
an interrupt id plus revision. Duplicate delivery is idempotent. A decision for
another tenant, principal, run, interrupt, or revision fails closed.

## 6. PURISTA mount contract

`ServiceBuilder.mountHarness(definition, policy)`:

- may be called once per service builder; compose several agents, workflows,
  tools, and Skills into that definition with native Harness modules before
  mounting;
- publishes only explicitly selected agents and workflows;
- derives schemas and types from the Harness contribution catalog;
- adds no generated command, stream, queue, worker, or HTTP definition;
- may attach before/after business guards and success events to each published
  target;
- may bind declared host tools through Core adapters;
- may enable a native queue binding for selected targets;
- accumulates exactly the required `ai` runtime configuration in
  `getInstance(...)`; and
- starts exactly one native Harness runtime per service instance and shuts it down with the
  service lifecycle.

Several independent mounted runtimes are deliberately unsupported. They make
model aliases, storage, admission, sandbox ownership, and shutdown ambiguous.
Harness modules are the composition mechanism; the Core mount is the single
deployment boundary.

Target calls always cross EventBridge, including same-service and same-process
calls. The receiver performs schema validation and mount business guards.
Identity, correlation, trace context, deadline, cancellation, handled errors,
and terminal outcomes cross the boundary once.

Address-first declarations follow existing Framework conventions:

```ts
const command = serviceBuilder
  .getCommandBuilder('ask')
  .canInvokeAgent(
    'Knowledge',
    '1',
    'answerQuestion',
    answerQuestionContract,
  )
  .setCommandFunction(async function ({ message, agent }) {
    return agent.Knowledge['1'].answerQuestion.run(
      { question: message.payload.question },
      { sessionId: message.principalId },
    )
  })
```

The caller imports a neutral contract, never another service builder.
`canInvokeWorkflow(...)` follows the same shape. `enqueue` is present in the
typed context only when the target contract declares a queue binding.

## 7. Tools and deterministic model access

Model-facing command tools and application-controlled invocation are distinct.

- `commandAsHarnessTool(...)` binds one Harness `hostTool` contract to one
  address-first PURISTA command declaration. It derives JSON Schema from the
  shared command contract and forwards trusted tenant/principal identity from
  the active run. Model input cannot supply or replace identity.
- A host-tool function may use a typed mount context containing only explicitly
  declared resources, command invocations, streams, queues, agent/workflow
  invocations, events, metrics, and logger capabilities.
- Pure tools remain native Harness tools and require no Core wrapper.
- Native PURISTA handlers that need embeddings, reranking, media, or direct
  model calls use a typed `canUseHarnessModel(...)` reference. Core does not
  duplicate the Harness model API.

## 8. Queue and provider admission

Direct `run` and `stream` are unqueued. Queue delivery is an explicit mount
binding built from native queue and worker policies. Worker concurrency limits
the selected target's durable jobs.

Provider admission is a separate Harness runtime port keyed by resolved
provider, model, and credential scope. It controls concurrency and rate windows
across agents. Rejections expose a retry delay so a queue worker can defer work
without busy retrying. Local and distributed implementations are separate
adapters.

## 8.1 Generated media and artifacts

Input understanding and output generation are distinct model capabilities.
`vision_input`, `audio_input`, and `file_input` describe model input. Output
methods use `image_generation`, `speech_generation`, and `video_generation`.

- `image(...)` and `speech(...)` return a published artifact reference.
- `imageStream(...)` and `speechStream(...)`, when an adapter supports them,
  emit transient progress and finish with one published artifact reference.
- `video(...)` is an aggregate convenience that waits for a terminal provider
  job and returns one published artifact reference.
- `videoStream(...)` exposes the provider-neutral queued, running, progress,
  completed, and failed job lifecycle. A provider job id remains adapter
  metadata and is never the application artifact identity.
- Media calls require an artifact store at Harness instance creation. Missing
  storage fails before invoking the provider.
- Artifact references are JSON-safe and contain an opaque id, URL, media type,
  and optional filename, size, and expiry. They contain no storage credentials.
- Model adapters may return bytes, a readable byte stream, or a temporary
  authenticated source to the Harness artifact publisher. Those internal
  source values are never persisted as run output or emitted as execution
  events.

The media operation names are deliberately separate. Images and speech are
normally request/response or byte-stream operations; video is commonly a
long-running job. One generic `media(...)` method would erase cancellation,
progress, retry, and durability semantics that applications need in production.

## 9. CLI, testing, docs, and migration

CLI generation creates native Harness definitions and a small PURISTA mount:

```text
src/harness/<service>/
  <service>Harness.ts
  agent/<name>/<name>Agent.ts
  workflow/<name>/<name>Workflow.ts
  tool/<name>/<name>Tool.ts
src/service/<service>/v<version>/harness/<service>HarnessMount.ts
```

The first generated AI artifact creates the service Harness and mount. Later
artifacts add native modules to that Harness and selected targets to the same
mount policy; they never add a second `mountHarness(...)` call.

Generators never add providers, credentials, queueing, HTTP exposure, Skills,
MCP, or sandbox authority implicitly.

Harness definition tests use `@purista/harness/testing`. Core supplies focused
host-tool context and mount integration helpers. Native command and stream tests
mock address-first agent/workflow invokers exactly like command invokers.

This release deletes `AgentQueueBuilder`, `getAgentQueueBuilder`, generated AI
transport definitions, and their runtime/testing helpers. There are no aliases,
forwarders, dual execution paths, deprecated compatibility exports, or automatic
configuration migration. The migration guide explains how to rewrite source to
a native Harness definition plus an explicit mount.

Tutorials remain frozen until implementation, handbook, API docs, skills, and
migration guidance pass their release checks.

## 10. Implementation order

1. Harness definition/runtime split, contribution catalog, host-tool contract,
   portable stream, diagnostics split, and interrupt outcome.
2. Core mount typing, lifecycle, published targets, EventBridge run/stream, and
   business guards.
3. Command/host-tool and deterministic-model adapters.
4. Optional queue binding and provider admission.
5. AI SDK UI Message Stream v1 projection and interrupt/resume path.
6. MCP, Skills, media/artifacts, sandbox/workspace, and durable workflow parity.
7. CLI, examples, starter, create-purista, voyage, handbook, API docs, migration
   guide, and canonical skills.
8. Delete every legacy implementation and verify repository-wide absence.

Each step must land with runtime tests, type tests, TSDoc for exported APIs, and
an executable standalone-plus-mounted path. Later steps may not add a second
definition source to compensate for a missing Harness capability.

## 11. Release acceptance

- A definition runs standalone and mounted without source changes.
- One schema owner exists for each agent, workflow, and tool contract.
- Each service owns at most one mounted Harness definition and one native
  Harness runtime.
- Every published invocation crosses EventBridge and preserves trusted context.
- `run` and `stream` share one typed terminal outcome; interrupts never become
  HTTP 500 responses.
- UI Message Stream v1 works with standard AI SDK React clients and AI Elements.
- Queueing is optional and separate from provider admission.
- All authority is absent by default and explicitly allowlisted.
- No Framework package except Core depends on Harness unless it implements an
  explicit optional adapter.
- No legacy builder, name, export, runtime path, documentation, generator, or
  skill guidance remains.
- Core, Harness, CLI, examples, starter, create-purista, voyage, website, and
  skill verification suites pass.

---
title: Configure AgentBuilder and runtime binding
description: Configure the attached-agent contract and generated projections precisely, then bind compatible runtime capabilities at service composition.
order: 393
---

Configure the builder in the order a reader can verify it: contract, one
execution implementation, declared reach, delivery behavior, then runtime
binding. `getDefinition()` rejects a builder without exactly one execution
definition; a second execution setter rejects immediately.

## Declare the model, contract, and execution

| Method | Parameters and default | Runtime effect |
| --- | --- | --- |
| [`addModel(alias, { capabilities, defaults? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel) | Stable application alias; non-empty declared capability list; optional provider-neutral call defaults | Requires a matching runtime entry in `ai.models`. The agent selects `alias`; the composition root provides its concrete provider and model identifier. `defaults` are model-call defaults, never credentials. Declare it before a Harness agent selects the alias. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema) | Input schema; optional | Adds the payload contract to generated command, stream, queue, and runtime input validation. |
| [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addparameterschema) | Parameter schema; optional | Adds parameter validation to those projections. |
| [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema) | Output schema; optional | Validates aggregate/worker output and stream final output when declared. |
| [`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent) | One Harness agent definition | Executes a Harness agent behind every generated projection. |
| [`setHarnessWorkflow(definition, { agents? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessworkflow) | One Harness workflow; optional Harness-local agent map | Executes a workflow. Local agents share the attached session/sandbox/telemetry boundary. |
| [`setRunFunction(handler)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setrunfunction) | One async `AgentHandlerContext => Promise<Output>` | Runs application-owned handler logic. It is useful for deterministic integration, not a substitute for a real provider. |

`setHarnessAgent`, `setHarnessWorkflow`, and `setRunFunction` are mutually
exclusive. Do not create a second harness instance inside a command handler:
that bypasses generated projections, runtime identity, lifecycle, and tests.
For an inline Harness agent, call `addModel` first: its `model` field is
type-checked against the aliases declared earlier in the fluent chain.

## Select queue and result behavior

| Method | Options / defaults | When to use it |
| --- | --- | --- |
| [`setExecutionPolicy(policy)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setexecutionpolicy) | Merges successive calls. `maxAttempts` defaults to `3`; `maxParallelHandlers` to `1`. Optional `leaseTtlMs`, `heartbeatIntervalMs`, and `timeoutMs`. | Bound queue retry, concurrency, and lease behavior. For a Harness agent/workflow, `timeoutMs` becomes a Harness run-timeout default; it is not forwarded to a model-free run function or a process kill. |
| [`setExecutionProfile('longRunning', { maxRuntimeMs, strict? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setexecutionprofile) | The only current profile. `maxRuntimeMs` is required; it sets a 5-minute visibility lease, 1-minute automatic heartbeat, three attempts, a 24-hour retry window, calculated lease extensions, and 60-second shutdown grace. | Work that can exceed an ordinary queue lease. The profile replaces generated queue lifecycle settings; `maxParallelHandlers` remains controlled by `setExecutionPolicy`. `strict` is retained in profile metadata but is not currently enforced by Core queue-bridge capability validation. Generated queued agent execution does not yet forward cancellation into the agent context. |
| [`setResponseMode(mode, options?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setresponsemode) | `accepted`, `status`, `stream`, or `event`; optional result policy, event names, TTL, delivery, and mode-specific URL metadata. | Intended to change the generated command to enqueue and return acceptance metadata. Current Core output-schema validation conflicts with that result, so do not use it with an output schema until the implementation is repaired. |
| [`setSuccessEventName(name)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsuccesseventname) | Non-empty name | Names the generated command’s success event metadata. It is not a broker/database transaction. |

For `status`, the default result policy is `state`; for `event`, `event`; for
`stream`, `state-and-event`. `accepted` has no default result policy. A supplied
`resultPolicy` can be `none`, `event`, `state`, `state-and-event`, or the full
policy object. `delivery: 'required'` can make queue completion fail when its
result side effect fails; it cannot make the model effect and publication atomic.
`statusUrl` is valid only for `accepted` or `status`; `streamUrl` only for
`stream`. Result-event names require an `event` or `state-and-event` policy.
URLs are copied to the acceptance response as application-owned metadata: the
builder does not interpolate `{jobId}` or create either route. The `stream`
response mode also does not convert model chunks into a durable queue-progress
feed. [Choose command, stream, or queued execution](/handbook/framework/build-ai-powered-services/choose-command-stream-or-queued-execution/#queue-acceptance-and-completion)
contains the mode/result-policy decision table and the full option intent.

When the generated manifest is needed for a build-time diagnostic or a
deployment check, [`getManifest()`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#getmanifest)
returns the provider-neutral declaration without generating the command,
stream, queue, or worker definitions. It is an inspection API, not a runtime
binding or a replacement for awaited `getDefinition()` during service
registration.

## Bind every declared model at service construction

```ts title="src/main.ts"
import { openai } from '@purista/harness-openai'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required to start the support service.')
}

const service = await supportV1Service.getInstance(eventBridge, {
  ai: {
    models: {
      primary: {
        provider: openai({ apiKey }),
        model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
      },
    },
  },
})
```

For each declared alias, runtime resolution combines builder and runtime
defaults, requires the runtime provider and concrete model identifier, and
checks runtime capability evidence when the application supplies it. The
builder's declared capabilities remain the typed requirement. Missing aliases,
missing model identifiers, and insufficient supplied capabilities fail when the
attached runtime is initialized. A run function with no models still requires
`ai.models: {}` because an attached service needs the runtime options object.

This is an OpenAI composition example, not a provider requirement in the agent
definition. Install `@purista/harness-openai` and provision `OPENAI_API_KEY`
before starting this service. Put provider-specific configuration under the
runtime binding only after it is required; the [OpenAI adapter guide](/handbook/harness/configure-the-runtime/openai/)
documents its options.

## Other builder controls

| Method | What it declares | Canonical next page |
| --- | --- | --- |
| [`defineMetric(name, definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#definemetric) | A service metric available in the attached handler. | [Tools, skills, resources, stores, and context](/handbook/framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context/) |
| [`canInvoke(...)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#caninvoke), [`canInvokeAgent(...)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#caninvokeagent) | Permitted Framework command/agent calls. | [Tools, skills, resources, stores, and context](/handbook/framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context/) |
| [`useSkills(names, resourceName?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#useskills), [`useBuiltInTools(names \| false)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#usebuiltintools) | Allowed skill names and built-in-tool restriction. | [Tools, skills, resources, stores, and context](/handbook/framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context/) |
| [`setSessionPolicy`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsessionpolicy), [`setSandboxPolicy`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsandboxpolicy), [`setWorkspacePolicy`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setworkspacepolicy), [`setDurability`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setdurability) | Session and recovery requirements. | [Manage sessions, workspaces, and durable work](/handbook/framework/build-ai-powered-services/manage-sessions-workspaces-and-durable-work/) |
| [`exposeAsHttpEndpoint`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#exposeashttpendpoint), [`setStreamingMode`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setstreamingmode), [`makeEndpointPublic`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#makeendpointpublic) | Generated HTTP projection metadata. | [Expose and invoke an attached agent](/handbook/framework/build-ai-powered-services/expose-and-invoke-an-attached-agent/) |

For exact TypeScript signatures, use the generated
[`AgentQueueBuilder` API reference](/handbook/api/classes/_purista_core.AgentQueueBuilder/).

Next: [choose command, stream, or queued execution](/handbook/framework/build-ai-powered-services/choose-command-stream-or-queued-execution/).

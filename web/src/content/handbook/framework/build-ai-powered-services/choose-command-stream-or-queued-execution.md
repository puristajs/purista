---
title: Choose command, stream, or queued execution
description: Choose the generated attached-agent projection from the caller’s completion requirement, not from whether the provider happens to support streaming.
order: 394
---

Every attached agent has command, stream, queue, and worker definitions. The
choice is about the caller’s delivery contract, while the Harness execution is
the same service-owned runtime behind it.

| If the caller needs… | Choose | Observable result | Do not use it when… |
| --- | --- | --- | --- |
| One bounded typed result now | Default generated command or aggregate HTTP projection | Validated output schema result | The model work must survive a disconnected caller. |
| Run events while connected | Generated stream / stream HTTP projection | Incremental stream chunks and validated final output | A client needs later retrieval rather than a live connection. |
| A quick acceptance response and completion later | `setResponseMode('accepted', …)` | Queue-derived `{ jobId, runId, status: 'queued' }` | The user needs the final value in the same request. |
| A status/result record or completion event | `status`, `event`, or `stream` response mode with appropriate result policy | Queue result metadata and/or result events | State storage or event delivery has not been provisioned. |

## Aggregate command

Do nothing beyond the contract and execution setter for the normal synchronous
shape. The generated command calls `executeAggregate`, validates the result, and
returns it. This is the simplest path for a bounded classification or short
assistant result.

## Streaming projection

Set streaming mode explicitly where the route is declared. The generated stream
maps Harness `RunEvent` values into agent stream chunks and closes with the
validated final output. Its writer aborts the attached runtime when the client
cancels; write stream tools and handlers to honor `context.signal`. Generated
command and queue-worker execution currently does not forward cancellation into
the attached-agent context, including a queue lease-loss abort.

```ts title="src/service/support/v1/agent/answerTicket/answerTicketAgentBuilder.ts"
import { z } from 'zod'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

const answerTicketInput = z.object({ ticketId: z.string(), question: z.string().min(1).max(4_000) })
const answerTicketOutput = z.object({ answer: z.string() })

export const answerTicketAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder('answerTicket', 'Drafts a support answer')
  .addPayloadSchema(answerTicketInput)
  .addOutputSchema(answerTicketOutput)
  .addModel('primary', { capabilities: ['text_stream'] })
  .setHarnessAgent({
    model: 'primary',
    input: answerTicketInput,
    output: answerTicketOutput,
    instructions: 'Draft a concise support response.',
    builtinTools: false,
  })
  .exposeAsHttpEndpoint('POST', 'support/answer', { streamingMode: 'stream' })
```

The fluent builder carries the model alias and both schemas into the generated
stream definition, so the output contract remains consistent across the live
connection and its final result.

| Call | What it configures | Choice and runtime effect |
| --- | --- | --- |
| [`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder) | A service-owned attached agent and its generated command, stream, queue, and worker projections. | Keep `name` stable because it contributes to generated contract names. `description` describes the operation; it is not prompt instructions. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema) and [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema) | The caller input and validated final result shared by generated projections. | The stream may carry intermediate run events, but it closes with the declared output. Do not use the output schema for caller identity or trusted state. |
| [`addModel(alias, options)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel) | The provider-neutral `primary` requirement. | `text_stream` permits the live text path. The composition root must bind a provider/model with that capability before startup. |
| [`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent) | The attached Harness execution. | `model` must be an alias declared earlier in the chain. `builtinTools: false` prevents undeclared built-in tools; add only reviewed tools on the dedicated [context guide](/handbook/framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context/). |
| [`exposeAsHttpEndpoint(method, path, options)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#exposeashttpendpoint) | The HTTP metadata for a generated projection. | `streamingMode: 'stream'` exposes the generated stream; use `aggregate` for the generated command instead. The endpoint remains secure by default and is not served until the HTTP service is configured. |

The stream’s HTTP server and its availability depend on the normal
[HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/),
not on the builder declaration alone.

## Queue acceptance and completion

`setResponseMode` changes the generated **command** from “run the attached
runtime and return its validated output” to “enqueue the generated queue and
return acceptance metadata.” The queue worker still runs the agent and owns
completion, retries, and result side effects. Choose it when the caller can
continue without the model result in the same request.

| Mode | Generated command returns | Default result policy | Choose it when | Important limit |
| --- | --- | --- | --- | --- |
| `accepted` | `{ jobId, runId: \`run:${jobId}\`, status: 'queued' }` plus configured URLs | None | The caller only needs durable acceptance, or the application has another completion mechanism. | No completion record or event is created unless you provide `resultPolicy`. |
| `status` | The same acceptance metadata and optional `statusUrl` | `state` | Your application will retrieve a later result/status record. | PURISTA does not create the HTTP status route or interpolate its URL. The selected queue bridge must support the required result storage. |
| `event` | The same acceptance metadata | `event` | Another service reacts when the agent run completes or fails. | Event delivery is not a transaction with the model's business effect. |
| `stream` | The same acceptance metadata and optional `streamUrl` | `state-and-event` | A client reconnects to application-owned status/stream infrastructure after acceptance. | This does not turn the original HTTP request into a durable stream or create the stream route. |

All response modes declare `canEnqueue` on the generated command. That means a
missing queue bridge, disabled queue capability, or rejected enqueue fails at
the acceptance boundary before the agent runs. Without `setResponseMode`, the
aggregate command instead waits for `executeAggregate` and returns the
validated agent output directly.

The current Core implementation retains the attached agent's output schema on
this generated command even though response mode returns queue acceptance
metadata. That causes command-output validation to reject an otherwise valid
acceptance result. The modes and options below describe the intended contract,
but do not enable a response-mode workflow with an output schema in production
until that implementation mismatch is repaired and covered by an integration
test.

### Configure the completion side effect

| Option | Accepted values | Why and when to set it |
| --- | --- | --- |
| `resultPolicy` | `none`, `event`, `state`, `state-and-event`, or an `AgentQueueResultPolicy` object | Select no generated completion side effect, an event, a stored result/status record, or both. Use the object form when you need cancellation/dead-letter event names or a custom result-event ID strategy. |
| `successEventName`, `failureEventName`, `progressEventName` | Non-empty event names | Override generated result-event names. They require an `event` or `state-and-event` result policy; `accepted` therefore also needs an explicit policy. The generated attached-agent worker publishes completion/failure results, not model-token progress. |
| `ttlMs` | Milliseconds | Bound retained result metadata for `state` or `state-and-event`. It has no stored result to expire with `event` or `none`; do not treat it as a model-session or business-record retention policy. |
| `delivery` | `best-effort` or `required` | Use `best-effort` when the business result remains valid even if a completion side effect cannot be delivered. Use `required` only when the worker should fail its completion path if that side effect fails; it still does not make model work and publication atomic. |
| `statusUrl` | Non-empty application-defined string; `accepted` or `status` mode only | Return the URL/template a client should use to find the application-owned status resource. The builder returns this string unchanged; `{jobId}` is a convention for your client or route code, not runtime substitution. |
| `streamUrl` | Non-empty application-defined string; `stream` mode only | Return a later stream location for a `stream` response design. It does not expose, authenticate, or host the endpoint. |

In the full `AgentQueueResultPolicy` object, `cancelledEventName` and
`deadLetterEventName` name terminal result events, and `eventId` is either the
default `jobIdAndStatus` strategy or a function returning a stable,
non-sensitive identifier from the job ID, queue name, status, and attempt.
`emitProgressEvents` and `progressEventName` are reserved queue-policy metadata
today: the generated attached-agent worker does not publish intermediate model
run events as queue progress. Use the generated live stream while connected, or
operate an application-owned replay/status channel after acceptance.

The generated command now enqueues its generated queue. Its returned `runId` is
derived as `run:{jobId}` for this delivery; it is not a stable workflow run ID.
Use `setDurability` only when the application owns a stable logical run key and
the execution is a Harness workflow. For event names and subscription handling,
continue with [publish results and react through subscriptions](/handbook/framework/build-ai-powered-services/publish-results-and-react-through-subscriptions/).

For the exact callable contract, see the generated
[`AgentQueueBuilder.setResponseMode` API](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setresponsemode).

Next: [use tools, skills, resources, stores, and context](/handbook/framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context/) or [manage sessions, workspaces, and durable work](/handbook/framework/build-ai-powered-services/manage-sessions-workspaces-and-durable-work/).

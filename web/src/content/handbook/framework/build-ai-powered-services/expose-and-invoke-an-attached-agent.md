---
title: Expose and invoke an attached agent
description: Project an attached agent as a secured aggregate HTTP command or stream, or invoke its generated service contract internally while retaining the normal HTTP runtime topology.
order: 399
---

`exposeAsHttpEndpoint(method, path, options?)` selects a generated HTTP
projection. With `streamingMode: 'aggregate'`, it exposes the generated command;
with `streamingMode: 'stream'`, it exposes the generated stream. The declaration
does not start Hono, register an endpoint by itself, or replace normal HTTP
authentication.

## Choose the projection deliberately

| Builder call or option | Values and default | Use it when | Important effect or limit |
| --- | --- | --- | --- |
| [`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder) | A stable service-local name and human-readable operational description. | The agent should have generated command, stream, queue, and worker projections. | The name is part of the generated service contract; the description is not a model instruction. |
| [`addModel(alias, { capabilities, defaults? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel) | A non-empty alias, required capability list, and optional provider-neutral call defaults. | Bind the agent to a declared model requirement. | Declare it before the inline definition; a compatible provider and concrete model are supplied at composition time. |
| [`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent) | An inline Harness agent definition whose `model` selects an earlier alias. | The generated projections should execute the Harness default agent loop. | It is mutually exclusive with `setHarnessWorkflow` and `setRunFunction`; it does not start a standalone Harness runtime. |
| [`exposeAsHttpEndpoint(method, path, options?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#exposeashttpendpoint) | `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`; a route path; `streamingMode` defaults to `stream` when neither this call nor `setStreamingMode` changes it. | You need one generated agent projection at a deliberate HTTP route. | `aggregate` registers the generated command; `stream` registers the generated stream. It does not create a second command and stream at one route. |
| `options.streamingMode` | `aggregate` or `stream` | The client needs one final schema-validated value, or connected incremental output. | Select `aggregate` for normal request/response. Select `stream` only while the caller can keep its connection open and consume chunks. |
| `options.requestContentType` | Optional content type such as `application/json` | The public request uses a deliberate media type. | It becomes HTTP metadata for the generated projection; schemas still own runtime payload validation. |
| `options.responseContentType` | Optional content type; aggregate only | An aggregate response has a deliberate representation. | The value is forwarded to the generated command projection. Stream frames use the stream transport rather than this aggregate response metadata. |
| [`setStreamingMode(mode)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setstreamingmode) | `stream` (default) or `aggregate` | You want to set the projection mode separately from the route declaration. | `exposeAsHttpEndpoint(..., { streamingMode })` is usually clearer when defining one endpoint. |
| [`makeEndpointPublic()`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#makeendpointpublic) | No parameters; endpoint metadata is secure by default. | Anonymous access is an intentional part of the endpoint design. | It changes generated security metadata only. Configure the real Hono authentication, rate limits, and abuse controls separately. |

Define the model requirement before the inline Harness agent so its `model`
property is checked against the aliases declared by the builder.

```mermaid title="HTTP projection uses the normal Framework runtime topology"
sequenceDiagram
  participant E as EventBridge
  participant H as Hono HTTP service
  participant S as Business service
  participant C as Client
  H->>E: Start with enableDynamicRoutes: true and subscribe
  S->>E: Register generated command or stream at service startup
  E->>H: InfoServiceFunctionAdded endpoint metadata
  C->>H: POST aggregate or stream request
  H->>E: Proxy generated command or stream invocation
  E->>S: Deliver to attached agent runtime
```

| Deployment | Required setup | Startup/readiness rule |
| --- | --- | --- |
| Separate Hono process | Set `enableDynamicRoutes: true`; Hono subscribes to `InfoServiceFunctionAdded`. | Start Hono and wait for `honoService.start()` before services register generated commands/streams. The subscription is non-durable: a late Hono instance misses prior registrations and returns `404` until services re-advertise. |
| Monolith | Call `honoService.registerService(service)` before `honoService.start()`, or use `services` with `autoRegisterServicesFromConfig`. | Definitions are read directly; start business service receivers before accepting traffic. Do not register the same service twice or add routes after Hono starts. |

Endpoint metadata alone does not enable dynamic discovery. Configure those two
modes, authentication, and failure mapping in [HTTP runtime architecture and
startup](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).

## Expose an aggregate response

```ts title="src/service/support/v1/agent/triageTicket/triageTicketAgentBuilder.ts"
export const triageTicketAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
  .addPayloadSchema(triageTicketInput)
  .addOutputSchema(triageTicketOutput)
  .addModel('primary', { capabilities: ['object'] })
  .setHarnessAgent({
    model: 'primary',
    input: triageTicketInput,
    output: triageTicketOutput,
    instructions: 'Classify the ticket urgency and return the declared object.',
    builtinTools: false,
  })
  .exposeAsHttpEndpoint('POST', 'support/triage', {
    streamingMode: 'aggregate',
    requestContentType: 'application/json',
    responseContentType: 'application/json',
  })
```

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
creates this service-owned agent and its generated projections.
[`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema)
validates the public request while [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema)
validates the aggregate result.
[`addModel(alias, options)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel)
declares the provider-neutral `primary` requirement before the inline
definition selects it. [`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent)
selects the Harness default loop; it is mutually exclusive with a workflow or
custom run function. [`exposeAsHttpEndpoint(method, path, options?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#exposeashttpendpoint)
then projects the generated command because this route uses `aggregate`.

## Expose a live stream

```ts title="src/service/support/v1/agent/answerTicket/answerTicketAgentBuilder.ts"
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

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
creates the same generated projections for the streaming operation.
[`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema)
validates the caller request, and [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema)
still validates the final result after streaming chunks.
[`addModel(alias, options)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel)
requires `text_stream` before the agent can use that path, while
[`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent)
selects the attached default loop for each projection.
[`exposeAsHttpEndpoint(method, path, options?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#exposeashttpendpoint)
projects the generated stream because this route selects `stream`.

The aggregate endpoint invokes the generated command. If
`setResponseMode(...)` is also configured, that command enqueues work and is
marked as an asynchronous HTTP operation; its acceptance shape is described in
[choose command, stream, or queued execution](/handbook/framework/build-ai-powered-services/choose-command-stream-or-queued-execution/#queue-acceptance-and-completion).
The streaming endpoint invokes the generated stream. It does not become a
durable replay channel after the client disconnects.

`makeEndpointPublic()` only changes generated endpoint security metadata. Use
it only when the HTTP server deliberately permits anonymous traffic and applies
rate limiting, abuse prevention, and input controls. The default remains
non-public metadata.

For internal callers, use the generated command/stream through the normal
service capability proxy, or declare `canInvokeAgent` on another attached agent.
Do not construct a second agent runtime in a command handler: that loses the
contract, trusted identity, observability, and generated queue behavior.

Next: [secure the service boundary](/handbook/framework/build-ai-powered-services/secure-the-service-boundary/).

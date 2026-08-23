# @purista/core API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/core`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [ServiceBuilder](#servicebuilder)
- [CommandDefinitionBuilder](#commanddefinitionbuilder)
- [SubscriptionDefinitionBuilder](#subscriptiondefinitionbuilder)
- [StreamDefinitionBuilder](#streamdefinitionbuilder)
- [QueueDefinitionBuilder](#queuedefinitionbuilder)
- [QueueWorkerBuilder](#queueworkerbuilder)
- [AgentQueueBuilder](#agentqueuebuilder)
- [SchedulerBuilder](#schedulerbuilder)
- [SchedulerRuntime](#schedulerruntime)
- [DefaultSchedulerProvider](#defaultschedulerprovider)
- [getArchitectureManifestDigest](#getarchitecturemanifestdigest)
- [createArchitectureManifest](#createarchitecturemanifest)
- [createArchitectureContext](#createarchitecturecontext)
- [renderArchitectureContextMarkdown](#renderarchitecturecontextmarkdown)
- [validateArchitectureManifest](#validatearchitecturemanifest)
- [compareArchitectureManifests](#comparearchitecturemanifests)
- [validateArchitectureComposition](#validatearchitecturecomposition)
- [exportServiceDefinitions](#exportservicedefinitions)
- [exportScheduleManifest](#exportschedulemanifest)

## ServiceBuilder

**class.** Declares one versioned PURISTA business capability. Source: `ServiceBuilder/ServiceBuilder.impl.ts:153`.

**Verified example**

```ts
const ordersInfo = {
  serviceName: 'orders',
  serviceVersion: '1',
  serviceDescription: 'Owns order lifecycle',
} as const satisfies ServiceInfoType

const orders = new ServiceBuilder(ordersInfo)
  .addCommandDefinition(createOrderCommand.getDefinition())

const service = await orders.getInstance(eventBridge)
await service.start()
```

**Public callable patterns**

- `addAgentDefinition(...definitions)` — Add one or more attached agent definitions to this service.
- `addCommandDefinition(...commands)` — Add one or more resolved or pending command definitions to this service.
- `addQueueDefinition(...queues)` — Add one or more resolved or pending queue definitions to this service.
- `addQueueWorkerDefinition(...workers)` — Add one or more resolved or pending queue worker definitions to this service.
- `addScheduleDefinition(...schedules)` — Add one or more schedule contracts to this service.
- `addStreamDefinition(...streams)` — Add one or more resolved or pending stream definitions to this service.
- `addSubscriptionDefinition(...subscription)` — Add one or more resolved or pending subscription definitions to this service.
- `bindEventToQueue(eventName, queueName, options)` — Bind a custom event to a durable queue job through a generated bounded subscription.
- `defineMetric(name, definition)` — Declare a custom application metric available in every service handler.
- `defineResource()` — Declare a resource required by handlers and enforce `resources` in `getInstance(...)`.
- `getAgentQueueBuilder(agentName, description)` — Create a native core builder for a queue-backed PURISTA agent.
- `getCommandBuilder(commandName, description, eventName?)` — Create a command builder scoped to this service's resource and metric types.
- `getCommandDefinitions()` — Return resolved command definitions after `resolveDefinitions()` has completed.
- `getCustomClass()` — Return the service class constructor currently configured for this builder.
- `getEventToQueueBindings()` — Return resolved event-to-queue bindings after `resolveDefinitions()` has completed.
- `getFullServiceDefinition()` — Return service metadata plus all resolved definitions.
- `getInstance(eventBridge, options?)` — Create a runnable service instance with runtime bridges, stores, resources, telemetry, and agent bindings.
- `getQueueBuilder(queueName, description)` — Create a queue definition builder.
- `getQueueDefinitions()` — Return resolved queue definitions after `resolveDefinitions()` has completed.
- `getQueueWorkerBuilder(queueName, workerName)` — Create a queue worker builder for a queue name.
- `getQueueWorkerDefinitions()` — Return resolved queue worker definitions after `resolveDefinitions()` has completed.
- `getScheduleBuilder(scheduleName, description)` — Create a schedule definition builder.
- `getScheduleDefinitions()` — Return resolved schedule definitions after `resolveDefinitions()` has completed.
- `getStreamBuilder(streamName, description, finalEventName?)` — Create a stream builder scoped to this service's resource and metric types.
- `getStreamDefinitions()` — Return resolved stream definitions after `resolveDefinitions()` has completed.
- `getSubscriptionBuilder(subscriptionName, description)` — Create a subscription builder scoped to this service's resource and metric types.
- `getSubscriptionDefinitions()` — Return resolved subscription definitions after `resolveDefinitions()` has completed.
- `markAsDeprecated()` — Mark the entire service definition as deprecated.
- `resolveDefinitions()` — Resolve all pending definitions once and cache the resolved service definition lists.
- `setConfigSchema(schema)` — Add a configuration schema and infer typed `serviceConfig` for `getInstance(...)`.
- `setCustomClass(customClass)` — Use a custom service subclass when creating service instances.
- `setDefaultConfig(config)` — Set default service configuration merged before runtime `serviceConfig`.
- `testServiceSetup()` — Validate duplicate names and queue-worker references for local tests.
- `validateCommandDefinitions()`
- `validateSubscriptionDefinitions()`

**Verified addAgentDefinition example**

```ts
const triage = await service
  .getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
  .setRunFunction(async context => ({ priority: 'normal' }))
  .getDefinition()

service.addAgentDefinition(triage)
```

**Verified bindEventToQueue example**

```ts
service.bindEventToQueue('billing.monthlyCycleDue', 'billing.monthlyClosing', {
  idempotencyKey: message => message.schedule?.occurrenceId,
})
```

**Verified defineMetric example**

```ts
const service = new ServiceBuilder(serviceInfo).defineMetric('app.orders.created', {
  kind: 'counter',
  unit: '{order}',
  description: 'Created orders',
})
```

**Verified getAgentQueueBuilder example**

```ts
const triage = service
  .getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
```

## CommandDefinitionBuilder

**class.** Declares a typed request/response operation owned by one service. Source: `CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:66`.

**Verified example**

```ts
const createOrder = service
  .getCommandBuilder('createOrder', 'Create an order')
  .addPayloadSchema(createOrderPayloadSchema)
  .addOutputSchema(orderSchema)
  .setCommandFunction(async function (_context, payload) {
    return createOrderInRepository(payload)
  })
```

**Public callable patterns**

- `addOpenApiErrorStatusCodes(...codes)` — If a function can return other status codes, than the default ones, you should add them to openApi definition.
- `addOpenApiTags(...tags)` — Add tags for openApi definition for given function.
- `addOutputSchema(outputSchema, outputContentType?, outputContentEncoding?)` — Add a schema for output payload validation.
- `addParameterSchema(parameterSchema)` — Add a schema for output parameter validation.
- `addPayloadSchema(inputSchema, inputContentType?, inputContentEncoding?)` — Add a schema for input payload validation.
- `addQueryParameters(...queryParams)` — Define query parameters if you expose the function as http endpoint.
- `adviceAutoacknowledgeMessages(acknowledge)` — Instruct the event bridge message broker to autoacknowledge commands as soon as they arrive.
- `canConsumeStream(serviceName, serviceVersion, serviceTarget, chunkSchema?, payloadSchema?, parameterSchema?, finalSchema?, validateChunk, validateFinal)` — Declare a stream this command handler may consume through its typed stream proxy.
- `canEmit(eventName, schema)` — Define which custom events the command can emit.
- `canEnqueue(queueName, payloadSchema?, parameterSchema?)` — Declare a queue this command handler may enqueue through its typed queue proxy.
- `canInvoke(serviceName, serviceVersion, serviceTarget, outputSchema?, payloadSchema?, parameterSchema?)` — Define a command which can be invoked by the current command
- `disableHttpSecurity(disabled)` — enable or disable security for this endpoint
- `enableHttpSecurity(enabled)` — enable or disable security for this endpoint
- `exposeAsHttpEndpoint(method, path, contentTypeRequest?, contentEncodingRequest?, contentTypeResponse?, contentEncodingResponse?, options?)` — Mark the function to be exposed as http endpoint.
- `getAfterGuardHook(name)` — Returns the after guard hook corresponding to the provided name.
- `getBeforeGuardHook(name)` — Get the before guard hook for this command.
- `getCommandFunction(input?)` — Get the function implementation including input and output validation.
- `getCommandFunctionPlain()` — Get the function implementation without input and output validation.
- `getCommandTransformContextMock(input)` — Returns a mocked transform function context, which can be used in unit tests.
- `getDefinition()` — Creates and returns the CommandDefinition used as input for the service.
- `getTransformInputFunction()` — Return the transform input function
- `getTransformOutputFunction()` — Return the transform output function
- `makeEndpointPublic()` — Mark the endpoint to be public available.
- `markAsDeprecated()` — Mark this endpoint/command as deprecated
- `markSchedulable(options)` — Mark this command as a short, idempotent schedule target.
- `setAfterGuardHooks(afterGuards)` — Set one or more after guard hook(s).
- `setBeforeGuardHooks(beforeGuards)` — Set one or more before guard hook(s).
- `setCommandFunction(fn)` — Required: Set the function implementation.
- `setOpenApiOperationId(operationId)` — Set the operationId for openApi documentation
- `setOpenApiSummary(summary)` — Set the function summary text used for example in openApi documentation
- `setSuccessEventName(eventName)`
- `setTransformInput(transformInputSchema, transformParameterSchema, transformFunction, inputContentType?, inputContentEncoding?)` — Set a transform input hook which will encode or transform the input payload and parameters.
- `setTransformOutput(transformOutputSchema, transformFunction, outputContentType?, outputContentEncoding?)` — Set a transform output hook which will encode or transform the response payload.

**Verified addOpenApiErrorStatusCodes example**

```ts
addErrorStatusCodes(StatusCode.PaymentRequired, StatusCode.Conflict)
```

**Verified addOpenApiTags example**

```ts
addTags('User','Public')
```

**Verified addQueryParameters example**

```ts
.addQueryParameters(
  {
    required: false,
    name: 'search',
  },
  {
    required: false,
    name: 'limit',
  },
)
```

**Verified canConsumeStream example**

```ts
command.canConsumeStream(
  'reports',
  '1',
  'generateReport',
  reportChunkSchema,
  reportRequestSchema,
)
```

**Verified canEnqueue example**

```ts
command.canEnqueue('billing.monthlyClosing', monthlyPayloadSchema)
```

**Verified exposeAsHttpEndpoint example**

```ts
command
  .exposeAsHttpEndpoint('POST', 'orders')
  .setOpenApiSummary('Create an order')
```

**Verified markSchedulable example**

```ts
command.markSchedulable({
  name: 'refresh-cache',
  expression: { kind: 'interval', everyMs: 300_000 },
})
```

**Verified setCommandFunction example**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

**Verified setOpenApiSummary example**

```ts
setSummary('Some function summary')
```

## SubscriptionDefinitionBuilder

**class.** Declares a bounded, typed reaction to a business event. Source: `SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:56`.

**Verified example**

```ts
const orderCreated = service
  .getSubscriptionBuilder('reserveInventory', 'Reserve stock after an order is created')
  .subscribeToEvent('orders.orderCreated')
  .addPayloadSchema(orderCreatedSchema)
  .setSubscriptionFunction(async function (_context, _payload) {
    // Keep this bounded and idempotent; enqueue durable work when needed.
  })
```

**Public callable patterns**

- `addOutputSchema(eventName, outputSchema, outputContentType, outputContentEncoding)` — Add a schema for output payload validation.
- `addParameterSchema(parameterSchema)` — Add a schema for output parameter validation.
- `addPayloadSchema(inputSchema, inputContentType, inputContentEncoding)` — Add a schema for input payload validation.
- `adviceAutoacknowledgeMessage(acknowledge)` — Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
- `adviceConsumerFailureHandling(config)` — Advise retry and dead-letter handling for this subscription.
- `adviceDurable(durable)` — False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.
- `canConsumeStream(serviceName, serviceVersion, serviceTarget, chunkSchema?, payloadSchema?, parameterSchema?, finalSchema?, validateChunk, validateFinal)`
- `canEmit(eventName, schema)` — Define which custom events the subscription can emit.
- `canInvoke(serviceName, serviceVersion, serviceTarget, outputSchema?, payloadSchema?, parameterSchema?)` — Define a command which can be invoked by the current subscription
- `filterForMessageType(messageType)` — Adds a filter to match specific message type.
- `filterPrincipalId(principalId)` — Filter messages only for principalId
- `filterReceivedBy(serviceName, serviceVersion, serviceTarget, instanceId)` — Add filter to only match messages received by given service function & version.
- `filterSentFrom(serviceName, serviceVersion, serviceTarget, instanceId)` — Add filter to only match messages send by given service function & version.
- `filterTenantId(tenantId)` — Filter messages only for tenantId
- `getDefinition()` — Returns the final subscription definition which will be passed into the service class.
- `getSubscriptionFunction()` — Get the function implementation including input and output validation.
- `getSubscriptionFunctionPlain()` — Get the function implementation without input and output validation.
- `getSubscriptionTransformContextMock(input)` — Returns a mocked transform function context, which can be used in unit tests.
- `getTransformInputFunction()` — Return the transform input function
- `getTransformOutputFunction()` — Return the transform output function
- `markAsDeprecated()` — Mark this subscription as deprecated
- `receiveMessageOnEveryInstance(enforce)` — Instruct the event bridge message broker to send the matching message to every running instance.
- `setAfterGuardHooks(afterGuards)` — Set one or more after guard hook(s).
- `setBeforeGuardHooks(beforeGuards)` — Set one or more before guard hook(s).
- `setSubscriptionFunction(fn)` — Required: Set the function implementation.
- `setTransformInput(transformInputSchema, transformParameterSchema, transformFunction, inputContentType?, inputContentEncoding?)` — Set a transform input hook which will encode or transform the input payload and parameters.
- `setTransformOutput(transformOutputSchema, transformFunction, outputContentType?, outputContentEncoding?)` — Set a transform output hook which will encode or transform the response payload.
- `subscribeToEvent(eventName, serviceVersion?)` — Add a filter to only subscribe to messages with matching event name

**Verified setSubscriptionFunction example**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

## StreamDefinitionBuilder

**class.** Builds a stream definition for incremental output or aggregate stream results. Source: `StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts:45`.

**Verified example**

```ts
const stream = service
  .getStreamBuilder('generateReport', 'Generate report progress')
  .addChunkSchema(progressSchema)
  .addFinalSchema(reportSchema)
  .exposeAsHttpStreamEndpoint('POST', 'reports/generate')
```

**Public callable patterns**

- `addChunkSchema(chunkSchema, validateChunks)` — Add the schema used to validate each stream chunk written by the handler.
- `addFinalSchema(finalSchema, validateFinal)` — Add the schema used to validate the final stream payload.
- `addOpenApiErrorStatusCodes(...codes)` — Add non-default OpenAPI error status codes for HTTP stream exposure.
- `addOpenApiTags(...tags)` — Add OpenAPI tags for HTTP stream exposure.
- `addParameterSchema(parameterSchema)` — Add the parameter schema used by stream invocation and handler input.
- `addPayloadSchema(inputSchema, inputContentType?, inputContentEncoding?)` — Add the payload schema used by stream invocation and handler input.
- `addQueryParameters(...queryParams)` — Add query parameter metadata for HTTP stream exposure.
- `canConsumeStream(serviceName, serviceVersion, serviceTarget, chunkSchema?, payloadSchema?, parameterSchema?, finalSchema?, validateChunk, validateFinal)` — Declare a stream this stream handler may consume through its typed stream proxy.
- `canEmit(eventName, schema)` — Declare a custom event this stream handler may emit.
- `canEnqueue(queueName, payloadSchema?, parameterSchema?)` — Declare a queue this stream handler may enqueue through its typed queue proxy.
- `canInvoke(serviceName, serviceVersion, serviceTarget, outputSchema?, payloadSchema?, parameterSchema?)` — Declare a command this stream handler may invoke through its typed service proxy.
- `enableChunkAggregation(enabled)` — Enable or disable default aggregation of chunks into the final payload.
- `enableHttpSecurity(enabled)` — Enable or disable generated HTTP security metadata.
- `exposeAsHttpStreamEndpoint(method, path, contentTypeRequest?, contentEncodingRequest?)` — Expose this stream as an HTTP stream endpoint.
- `getAfterGuardHook(name)` — Return a previously registered after-guard hook by name.
- `getBeforeGuardHook(name)` — Return a previously registered before-guard hook by name.
- `getDefinition()` — Resolve this builder into the stream definition consumed by a service.
- `getStreamFunction()` — Return the configured stream handler implementation.
- `makeEndpointPublic()` — Mark the HTTP stream endpoint public in generated security metadata.
- `markAsDeprecated()` — Mark this stream definition as deprecated in generated metadata.
- `setAfterGuardHooks(afterGuards)` — Set one or more after guard hook(s).
- `setBeforeGuardHooks(beforeGuards)` — Set one or more before guard hook(s).
- `setFinalEventName(eventName)` — Set a custom event name emitted for successful final stream output.
- `setHttpStreamingMode(mode)` — Choose whether HTTP exposure returns chunks or an aggregate JSON response.
- `setHttpStreamProtocol(protocol, documentationUrl?)` — Set stream protocol metadata for generated OpenAPI/HTTP exposure.
- `setOpenApiOperationId(operationId)` — Set the OpenAPI operation id for HTTP stream exposure.
- `setOpenApiSummary(summary)` — Set the OpenAPI summary for HTTP stream exposure.
- `setStreamFunction(fn)` — Set the stream handler implementation.

**Verified canConsumeStream example**

```ts
stream.canConsumeStream(
  'reports',
  '1',
  'extractPages',
  pageChunkSchema,
  requestSchema,
  undefined,
  summarySchema,
)
```

**Verified enableChunkAggregation example**

```ts
stream.enableChunkAggregation(false)
```

**Verified exposeAsHttpStreamEndpoint example**

```ts
stream
  .exposeAsHttpStreamEndpoint('POST', 'reports/generate')
  .setHttpStreamingMode('stream')
  .makeEndpointPublic()
```

## QueueDefinitionBuilder

**class.** Builds a durable queue contract for background work. Source: `QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:28`.

**Verified example**

```ts
const queue = service
  .getQueueBuilder('billing.monthlyClosing', 'Close monthly billing')
  .addPayloadSchema(monthlyClosingSchema)
  .setLifecycleConfig({ maxAttempts: 5 })
  .emitResultAsEvent('billing.monthlyClosing.completed')
```

**Public callable patterns**

- `addParameterSchema(schema)` — Add the queue job parameter schema used during enqueue and worker execution.
- `addPayloadSchema(schema)` — Add the queue job payload schema used during enqueue and worker execution.
- `addWorkerDefinition(...workers)` — Attach one or more worker definitions that can process jobs from this queue.
- `emitResultAsEvent(successEventName, options?)` — Convenience helper for emitting successful worker output as a PURISTA event.
- `getDefinition()` — Resolve this builder into the queue definition consumed by a service.
- `markAsDeprecated()` — Mark this queue definition as deprecated in generated metadata.
- `markSchedulable(options)` — Mark this queue as a direct schedule target.
- `setBeforeEnqueueTransform(transform)` — Transform or normalize a job before it is sent to the queue bridge.
- `setBeforeExecuteTransform(transform)` — Transform or enrich a stored job immediately before worker execution.
- `setDeadLetterOptions(options)` — Configure where failed jobs are dead-lettered when the queue bridge supports it.
- `setExecutionProfile(profile, options)` — Apply the built-in long-running queue execution profile.
- `setLifecycleConfig(config)` — Override queue retry, lease, heartbeat, delay, and retention lifecycle defaults.
- `setQueueBridgeConfig(config)` — Configure queue bridge delivery hints such as prefetch and ordering guarantee.
- `setResultPolicy(policy)` — Persist or emit queue worker completion metadata.
- `setTags(tags)` — Set tags used by tooling and generated queue metadata.

**Verified setBeforeEnqueueTransform example**

```ts
queue.setBeforeEnqueueTransform(async job => ({
  ...job,
  parameter: { ...job.parameter, requestedAt: Date.now() },
}))
```

**Verified setExecutionProfile example**

```ts
queue.setExecutionProfile('longRunning', {
  maxRuntimeMs: 6 * 60 * 60_000,
})
```

**Verified setResultPolicy example**

```ts
queue.setResultPolicy({
  mode: 'event',
  successEventName: 'billing.monthlyClosing.completed',
})
```

## QueueWorkerBuilder

**class.** Builds a queue worker definition for one queue. Source: `QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:36`.

**Verified example**

```ts
const worker = service
  .getQueueWorkerBuilder('billing.monthlyClosing', 'close-month')
  .setMaxParallelHandlers(2)
  .setHandler(async (context, job) => ({ status: 'success', output: job.payload }))
```

**Public callable patterns**

- `canConsumeStream(serviceName, serviceVersion, serviceTarget, chunkSchema?, payloadSchema?, parameterSchema?, finalSchema?, validateChunk, validateFinal)` — Declare a stream this worker handler may consume through `context.stream`.
- `canEmit(eventName, schema)` — Declare a custom event this worker handler may emit through `context.emit`.
- `canEnqueue(queueName, payloadSchema?, parameterSchema?)` — Declare a queue this worker handler may enqueue through `context.queue`.
- `canInvoke(serviceName, serviceVersion, serviceTarget, outputSchema?, payloadSchema?, parameterSchema?)` — Declare a command this worker handler may invoke through `context.service`.
- `canInvokeAgent(agentName, serviceVersion, schemas?)` — Declare a same-service agent this worker handler may invoke through `context.agent`.
- `getAfterGuardHook(name)` — Return a previously registered after-guard hook by name.
- `getBeforeGuardHook(name)` — Return a previously registered before-guard hook by name.
- `getDefinition()` — Resolve this builder into the queue worker definition consumed by a service.
- `setAfterGuardHooks(hooks)` — Register named guard hooks that run after the worker handler.
- `setBeforeGuardHooks(hooks)` — Register named guard hooks that run before the worker handler.
- `setHandler(handler)` — Set the job handler implementation for this worker.
- `setIntervalMs(intervalMs)` — Set the polling interval for worker modes that use intervals.
- `setMaxParallelHandlers(count)` — Set how many jobs this worker may process concurrently.
- `setMode(mode)` — Set whether the worker runs continuously or in a bridge-supported polling mode.

**Verified canInvoke example**

```ts
worker.canInvoke('billing', '1', 'getInvoice', invoiceSchema, lookupSchema)
```

## AgentQueueBuilder

**class.** Builds an attached PURISTA agent from normal core queue, worker, command, stream definitions, and a provider-neutral agent manifest. Source: `AgentQueueBuilder/AgentQueueBuilder.ts:96`.

**Verified example**

```ts
const triage = service
  .getAgentQueueBuilder('supportTriage', 'Classifies tickets')
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
  .setRunFunction(async context => ({ priority: 'high' }))
```

**Public callable patterns**

- `addModel(alias, binding)` — Declare a model alias that must be bound when the owning service is instantiated.
- `addOutputSchema(schema)` — Add the final output schema returned by the agent command or aggregate stream response.
- `addParameterSchema(schema)` — Add the parameter schema used by the generated queue, command, stream, and agent handler.
- `addPayloadSchema(schema)` — Add the payload schema used by the generated queue, command, stream, and agent handler.
- `canInvoke(serviceName, serviceVersion, commandName, schemas?)` — Allow the agent handler to call a PURISTA command through `context.invoke.tools`.
- `canInvokeAgent(agentName, serviceVersion, schemas?)` — Allow this agent to call another attached agent through `context.invoke.agents`.
- `defineMetric(name, definition)` — Declare a custom application metric available only in this agent handler.
- `exposeAsHttpEndpoint(method, path, options?)` — Expose the generated agent command or stream as an HTTP endpoint.
- `getDefinition()` — Generate the attached agent and its queue, worker, command, and stream definitions.
- `getManifest()` — Return the provider-neutral manifest for this agent without generating core definitions.
- `makeEndpointPublic()` — Mark the generated HTTP endpoint public in OpenAPI/security metadata.
- `setExecutionPolicy(policy)` — Merge queue worker execution policy for the generated agent worker and queue.
- `setExecutionProfile(profile, options)` — Apply a core queue execution profile to the generated agent queue.
- `setHarnessAgent(this, definition)` — Use a provider-neutral `@purista/harness` agent definition as this agent's execution.
- `setHarnessWorkflow(this, definition, options)` — Use a provider-neutral `@purista/harness` workflow definition as this agent's execution.
- `setResponseMode(mode, options?)` — Configure how a queued agent run exposes its final result contract.
- `setRunFunction(this, handler)` — Use a plain async run function as this agent's execution.
- `setSandboxPolicy(policy)` — Attach sandbox configuration consumed by compatible agent runtimes.
- `setSessionPolicy(policy)` — Configure how this attached agent obtains its Harness session.
- `setStreamingMode(mode, options?)` — Choose whether the generated projection streams chunks or returns an aggregate response, and optionally control model chunks on that stream.
- `setSuccessEventName(eventName)` — Set the success event name used by generated command and result policies.
- `setWorkspacePolicy(policy)` — Require a durable workspace for a wrapped Harness workflow.
- `useBuiltInTools(namesOrFalse)` — Restrict or disable harness built-in tools for this agent.
- `useSkills(names, resourceName?)` — Declare named skill references the runtime can load for this agent.

**Verified addModel example**

```ts
agent.addModel('primary', {
  model: 'gpt-4.1-mini',
  capabilities: ['object'],
})
```

**Verified canInvoke example**

```ts
agent.canInvoke('billing', '1', 'getInvoice', {
  outputSchema: invoiceSchema,
  payloadSchema: invoiceLookupSchema,
})
```

**Verified canInvokeAgent example**

```ts
agent.canInvokeAgent('summarizeTicket', '1', {
  payloadSchema: ticketSchema,
  outputSchema: summarySchema,
})
```

**Verified defineMetric example**

```ts
agent.defineMetric('app.agent.escalations', {
  kind: 'counter',
  unit: '{escalation}',
  description: 'Escalated agent runs',
})
```

**Verified exposeAsHttpEndpoint example**

```ts
agent.exposeAsHttpEndpoint('POST', 'support/triage', {
  streamingMode: 'aggregate',
  responseContentType: 'application/json',
})
```

**Verified setExecutionProfile example**

```ts
agent.setExecutionProfile('longRunning', {
  maxRuntimeMs: 30 * 60_000,
})
```

**Verified setHarnessWorkflow example**

```ts
service
  .getAgentQueueBuilder('incidentReview', 'Reviews one incident')
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
  .setHarnessWorkflow({
    ...reviewWorkflow,
    delegation: { agents: ['summarize'], modelAliases: ['primary'] },
  }, {
    agents: { summarize: summarizeAgent },
  })
```

**Verified setResponseMode example**

```ts
agent.setResponseMode('accepted', {
  resultPolicy: 'state-and-event',
})
```

**Verified setRunFunction example**

```ts
agent.setRunFunction(async context => {
  context.metrics['app.agent.runs'].add(1)
  return { answer: `Ticket ${context.payload.ticketId} queued` }
})
```

**Verified setSessionPolicy example**

```ts
agent.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })
agent.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversation', 'id'] })
```

**Verified setStreamingMode example**

```ts
agent.setStreamingMode('stream', { modelChunkVisibility: 'safe' })
```

## SchedulerBuilder

**class.** Builder for a standalone Core Scheduler Runtime host. Source: `SchedulerBuilder/SchedulerBuilder.impl.ts:27`.

**Verified example**

```ts
const scheduler = new SchedulerBuilder('billing')
  .loadManifest(manifest)
  .useEventBridge(eventBridge)
  .useProvider(redisSchedulerProvider)
  .setStrict()
  .setRequireDistributedClaims()
  .getInstance()
await scheduler.start()
```

**Public callable patterns**

- `getInstance()` — Create the independent Scheduler Runtime.
- `loadManifest(manifest)` — Load provider-neutral schedule declarations exported from application definitions.
- `setMaxOccurrencesPerTick(maxOccurrencesPerTick)` — Bound work performed for one declaration during one scheduler tick.
- `setPollInterval(pollIntervalMs)` — Configure polling granularity in milliseconds.
- `setRequireDistributedClaims(required)` — Require a provider with distributed occurrence claims for a replicated scheduler host.
- `setSender(sender)` — Override the sender identity attached to emitted trigger events.
- `setStrict(strict)` — Require durable provider state during startup validation.
- `useClock(clock)` — Use an injectable clock for deterministic local development and tests.
- `useEventBridge(eventBridge)` — Bind the EventBridge used solely to publish schedule trigger events.
- `useProvider(provider)` — Bind the provider that owns occurrence claims and durability guarantees.

## SchedulerRuntime

**class.** Core-owned scheduler loop that publishes regular PURISTA custom events. Source: `core/Scheduler/SchedulerRuntime.impl.ts:78`.

**Verified example**

```ts
const runtime = new SchedulerRuntime({ registrations, eventBridge, provider, strict: true })
await runtime.start()
```

**Public callable patterns**

- `destroy()` — Stop future ticks and release runtime-owned provider and bridge resources.
- `getRuntimeStatus()` — Return a JSON-safe operator view for this runtime host.
- `listStatus()` — Return sorted, JSON-safe status records without provider secrets or payloads.
- `pause(scheduleKey)` — Pause automatic publication for one known schedule without removing its registration.
- `resume(scheduleKey)` — Resume automatic publication for a schedule paused with pause.
- `start()` — Validate registrations, start the provider and event bridge, and begin the independent scheduling loop.
- `tick(now)` — Evaluate all registrations once.
- `triggerNow(scheduleKey)` — Publish one explicit occurrence immediately, even if the registration is paused or disabled.

## DefaultSchedulerProvider

**class.** Process-local SchedulerProvider for development and deterministic tests. Source: `core/Scheduler/DefaultSchedulerProvider.impl.ts:27`.

**Verified example**

```ts
const scheduler = new SchedulerBuilder()
  .loadManifest(manifest)
  .useEventBridge(new DefaultEventBridge())
  .useProvider(new DefaultSchedulerProvider())
  .getInstance()
```

**Public callable patterns**

- `claimOccurrence(occurrence)` — Claim an occurrence when it has not completed or been claimed in this process.
- `completeOccurrence(claim)` — Mark a currently owned occurrence completed for this process lifetime.
- `destroy()` — Clear process-local state.
- `releaseOccurrence(claim)` — Release a failed occurrence so a later local tick can retry it.
- `start()` — Initialize the process-local provider.

## getArchitectureManifestDigest

**function.** Return the content digest of an architecture artifact, excluding its own digest field. Source: `helper/architectureManifest.ts:258`.

**Verified example**

```ts
const digest = getArchitectureManifestDigest(manifest)
```

## createArchitectureManifest

**function.** Create a complete, sorted, JSON-safe architecture contract from resolved service definitions. Source: `helper/architectureManifest.ts:273`.

**Verified example**

```ts
const manifest = await createArchitectureManifest({ services: definitions, schemaMode: 'full' })
```

## createArchitectureContext

**function.** Create a bounded, deterministic subgraph suitable for tool output and LLM context. Source: `helper/architectureManifest.ts:747`.

**Verified example**

```ts
const context = createArchitectureContext(manifest, {
  scope: ['service:orders/1'],
  depth: 1,
  schemaMode: 'referenced',
})
```

## renderArchitectureContextMarkdown

**function.** Render a deterministic Markdown projection of an architecture context. Source: `helper/architectureManifest.ts:824`.

**Verified example**

```ts
const markdown = renderArchitectureContextMarkdown(context)
```

## validateArchitectureManifest

**function.** Validate static architecture references without contacting runtime infrastructure. Source: `helper/architectureManifest.ts:620`.

**Verified example**

```ts
const diagnostics = validateArchitectureManifest(manifest, { strict: true })
```

## compareArchitectureManifests

**function.** Compare two static architecture contracts without an unsound schema-evolution guess. Source: `helper/architectureManifest.ts:873`.

**Verified example**

```ts
const changes = compareArchitectureManifests(baseManifest, candidateManifest, { strict: true })
```

## validateArchitectureComposition

**function.** Validate explicitly pinned architecture artifacts and cross-artifact relation bindings offline. Source: `helper/architectureManifest.ts:935`.

**Verified example**

```ts
const diagnostics = validateArchitectureComposition(composition, artifacts, { strict: true })
```

## exportServiceDefinitions

**function.** Resolve service builders into the JSON-safe definition inventory used by architecture inspection and interoperability exports. Source: `helper/exportServiceDefinitions.ts:116`.

**Verified example**

```ts
const definitions = await exportServiceDefinitions([ordersV1Service, billingV1Service])
await writeFile('purista.definitions.json', JSON.stringify(definitions, null, 2))
```

## exportScheduleManifest

**function.** Export provider-neutral schedule metadata from service definitions. Source: `helper/enterpriseInterop.ts:425`.

**Verified example**

```ts
const manifest = await exportScheduleManifest({
  title: 'Billing schedules',
  version: '1.0.0',
  services: exportedDefinitions,
})
```


# Component Builders

Use this reference when implementing or reviewing service components.

## Contents
- [Service](#service)
- [Command](#command)
- [Subscription](#subscription)
- [Stream](#stream)
- [Queue And Queue Worker](#queue-and-queue-worker)
- [Schedules](#schedules)
- [Agent](#agent)
- [Contract Rule](#contract-rule)

## Service
Use `ServiceBuilder` for a versioned capability. It declares config, resources, and child definitions. Runtime infrastructure is supplied later through `getInstance(...)`.

Declare service-level custom metrics on the service builder. Custom names must use the `app.` prefix and low-cardinality attributes.

```ts
const orderService = new ServiceBuilder(orderServiceInfo)
	.defineMetric('app.orders.created', {
		kind: 'counter',
		unit: '{order}',
		description: 'Created orders',
		attributes: z.object({ channel: z.enum(['web', 'api']) }),
	})
```

Declared service metrics cascade into commands, subscriptions, streams, queue workers, and attached agent handlers through typed `context.metrics`.

## Command
Use commands for direct business actions. Generated command files are the preferred starting point.

```bash
npm run add:command -- createOrder --service order --service-version 1
```

Attach payload, parameter, output schemas, invocation allowlists, HTTP exposure, and command function explicitly.

## Subscription
Use subscriptions for bounded reactions to events. Do not use subscriptions as durable retry loops; move long-running or retry-heavy work to queues.

```bash
npm run add:subscription -- sendWelcomeEmail --service email --service-version 1 --event user.created
```

## Stream
Use streams for incremental delivery. Streams can be exposed via Hono as SSE or aggregated JSON depending on stream metadata.

```bash
npm run add:stream -- search --service catalog --service-version 1
```

Attach chunk and final schemas. OpenAPI stream schemas come from `chunkPayload` and `finalPayload`.

## Queue And Queue Worker
Use queues for durable work and workers for execution.

```bash
npm run add:queue -- invoiceProcessing --service billing --service-version 1
npm run add:queue-worker -- invoiceProcessor --service billing --service-version 1 --queue invoiceProcessing
```

Use queue-backed execution when work needs leases, retries, delay, dead-letter handling, or operator replay.

Queue workers use the same declared dependency model as other handlers. Declare dependencies before the worker function so the runtime manifest, handler context, and test helpers stay typed and auditable:

```ts
const worker = service
	.getQueueWorkerBuilder('invoiceProcessing', 'Processes invoice jobs')
	.canInvoke('InvoiceService', '1', 'sendInvoice', sendInvoiceOutputSchema, invoicePayloadSchema)
	.canConsumeStream('InvoiceService', '1', 'renderInvoice', invoiceChunkSchema, invoicePayloadSchema)
	.canEnqueue('notificationQueue', notificationPayloadSchema, notificationParameterSchema)
	.canEmit('invoice.completed', invoiceCompletedEventSchema)
	.canInvokeAgent('reconcileInvoice', '1', {
		outputSchema: reconcileOutputSchema,
		payloadSchema: reconcilePayloadSchema,
		parameterSchema: reconcileParameterSchema,
	})
	.setHandler(async function (context) {
		const payload = context.message.payload as { invoiceId: string }
		await context.service.InvoiceService['1'].sendInvoice({ invoiceId: payload.invoiceId })
		await context.queue.enqueue.notificationQueue({ invoiceId: payload.invoiceId })
		await context.emit('invoice.completed', { invoiceId: payload.invoiceId })
		await context.agent['reconcileInvoice.1'].run({ invoiceId: payload.invoiceId })
	})
```

Use `canInvokeAgent(...)` only for agents attached to the same service. Cross-service AI work should go through explicit command, stream, queue, or event contracts.

## Schedules
Use schedules to declare external time-trigger intent. Schedules do not run inside PURISTA.

```ts
const schedule = service
	.getScheduleBuilder('monthlyBillingCycle', 'Monthly billing cycle trigger')
	.emitEvent('billing.monthlyCycleDue', {
		expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
		concurrencyPolicy: 'forbid',
		missedRunPolicy: 'runOnce',
		idempotencyKey: 'payload.cycleId',
	})

service.addScheduleDefinition(schedule)
```

Queue and command builders can be direct schedule targets:

```ts
queue.markSchedulable({
	name: 'monthly-invoice-generation',
	expression: { kind: 'cron', value: '0 2 1 * *' },
	concurrencyPolicy: 'forbid',
})

command.markSchedulable({
	name: 'refresh-cache',
	expression: { kind: 'interval', everyMs: 300_000 },
	concurrencyPolicy: 'replace',
})
```

Do not schedule subscriptions directly. Emit an event and let the subscription or an event-to-queue binding react.

```ts
service.bindEventToQueue('billing.monthlyCycleDue', 'billing.monthlyClosing', {
	idempotencyMode: 'strict',
	idempotencyKey: event => `billing-cycle:${event.cycleId}`,
	mapPayload: event => ({ cycleId: event.cycleId }),
	mapParameter: event => ({ tenantId: event.tenantId }),
})
```

## Agent
Agents are native core service components. Generated agents attach to a service and expand into:
- queue
- queue worker
- aggregate command
- stream

```bash
npm run add:agent -- triage --service support --service-version 1
```

Agents execute exactly one of:
- `setHarnessAgent(...)`
- `setHarnessWorkflow(workflow, { agents })`
- `setRunFunction(...)`

Use the `agents` option only for harness-local agents that should share the same
harness session, sandbox, telemetry, Harness storage, durable workspace, and
model bindings as the wrapped workflow. Use `canInvokeAgent(...)` plus
`setRunFunction(...)` when child agents need independent PURISTA queues,
retries, service ownership, HTTP exposure, sandboxes, or runtime bindings.

Agent-local custom metrics are declared on `AgentQueueBuilder.defineMetric(...)` and are visible only inside that agent handler. Service-level metrics remain visible to the agent handler too.

```ts
const triageAgent = supportService
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
	.defineMetric('app.agent.escalations', {
		kind: 'counter',
		unit: '{escalation}',
		description: 'Tickets escalated by the triage agent',
		attributes: z.object({ priority: z.enum(['normal', 'high']) }),
	})
```

## Contract Rule
Every component boundary owns its schema. Consumers should define a narrow local schema for the fields they read instead of importing an oversized producer schema.

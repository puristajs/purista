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

Declared service metrics cascade into commands, subscriptions, streams, queue workers, and PURISTA host-tool handlers through typed `context.metrics`.

## Command
Use commands for direct business actions. Generated command files are the preferred starting point.

```bash
npm run add:command -- createOrder --service order --service-version 1
```

Attach payload, parameter, output schemas, invocation allowlists, HTTP exposure, and command function explicitly.

Choose command events by lifecycle meaning:

- Use `.setSuccessEventName('order.created')` when the command's validated
  successful result is the fact. PURISTA puts that name on the
  `CommandSuccessResponse`, and subscriptions can consume it. Failed commands
  do not publish a success response.
- Use `.canEmit(name, schema)` and `context.emit(name, payload)` for a distinct
  fact that occurs during command execution, including progress or multiple
  facts whose payload is not the command result.

Do not manually emit a copy of the result after the final write. That duplicates
the success-response mechanism and creates an unnecessary second effect inside
the handler. Remember that output transforms run before the success response;
the named success event carries the final validated command result.

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
	.canInvokeAgent('Reconciliation', '1', 'reconcile_invoice', reconciliationHarness.contracts.agents.reconcile_invoice)
	.setHandler(async function (context) {
		const payload = context.message.payload as { invoiceId: string }
		await context.service.InvoiceService['1'].sendInvoice({ invoiceId: payload.invoiceId })
		await context.queue.enqueue.notificationQueue({ invoiceId: payload.invoiceId })
		await context.emit('invoice.completed', { invoiceId: payload.invoiceId })
		await context.agent.Reconciliation['1'].reconcile_invoice.run({ invoiceId: payload.invoiceId })
	})
```

Mounted targets are always address-first. `canInvokeAgent(...)` and
`canInvokeWorkflow(...)` call through EventBridge for same-service and
cross-service targets alike.

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
Agents and workflows are native `@purista/harness` definitions. PURISTA mounts
selected targets at a service address; mounting creates no implicit command,
stream, queue, worker, or HTTP route.

```bash
npm run add:agent -- triage --service support --service-version 1
```

The CLI creates one native agent module, composes it into the service's Harness
definition, and updates the service's single mount policy. Add a normal PURISTA
command or stream only when the application needs that consumer contract.

```ts
const triageAgent = defineHarnessModule<PrimaryModelState>()('support.agent.triage', {
	register(builder) {
		return builder.agent('triage_ticket', triageAgentDefinition)
	},
})

const harness = defineHarness({ name: 'support' })
	.requireModel('primary', { capabilities: ['object'] })
	.use(triageAgent)
	.define()

const support = supportService.mountHarness(harness, {
	publish: { agents: ['triage_ticket'] },
})
```

Call `mountHarness(...)` once per service. Compose later agents, workflows,
tools, and Skills into the same definition with native modules.

Use mount before/after guards for business authorization and `successEvent` for
the completed target fact. Bind commands as host tools with
`commandAsHarnessTool(...)`, or use `getHarnessHostToolBuilder(...)` when a tool
handler needs several declared PURISTA capabilities.

## Contract Rule
Every component boundary owns its schema. Consumers should define a narrow local schema for the fields they read instead of importing an oversized producer schema.

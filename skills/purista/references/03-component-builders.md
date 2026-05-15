# Component Builders

Use this reference when implementing or reviewing service components.

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
purista add command createOrder --service order --service-version 1
```

Attach payload, parameter, output schemas, invocation allowlists, HTTP exposure, and command function explicitly.

## Subscription
Use subscriptions for bounded reactions to events. Do not use subscriptions as durable retry loops; move long-running or retry-heavy work to queues.

```bash
purista add subscription sendWelcomeEmail --service email --service-version 1 --event user.created
```

## Stream
Use streams for incremental delivery. Streams can be exposed via Hono as SSE or aggregated JSON depending on stream metadata.

```bash
purista add stream search --service catalog --service-version 1
```

Attach chunk and final schemas. OpenAPI stream schemas come from `chunkPayload` and `finalPayload`.

## Queue And Queue Worker
Use queues for durable work and workers for execution.

```bash
purista add queue invoiceProcessing --service billing --service-version 1
purista add queue-worker invoiceProcessor --service billing --service-version 1 --queue invoiceProcessing
```

Use queue-backed execution when work needs leases, retries, delay, dead-letter handling, or operator replay.

## Agent
Agents are native core service components. Generated agents attach to a service and expand into:
- queue
- queue worker
- aggregate command
- stream

```bash
purista add agent triage --service support --service-version 1
```

Agents execute exactly one of:
- `setHarnessAgent(...)`
- `setHarnessWorkflow(...)`
- `setRunFunction(...)`

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

# PURISTA Metrics Example

This example shows the final metrics API shape:

- PURISTA records through the OpenTelemetry Metrics API.
- The application owns the SDK, metric reader, and exporter.
- Custom metrics are declared on `ServiceBuilder.defineMetric`.
- Handlers record through typed `context.metrics`.

The example uses `ConsoleMetricExporter` so it starts without Prometheus, a collector, Jaeger, SigNoz, or any external service.

```bash
npm run start -w @purista/metrics-example
```

Prometheus should be configured outside PURISTA core through an OpenTelemetry Collector or an application-owned OTel Prometheus exporter.

Application business metrics are declared on the owning `ServiceBuilder` and
recorded by its commands, subscriptions, streams, and queue workers through
typed `context.metrics`. A Harness host tool can invoke one of those commands
through its declared address. PURISTA records mount wrapper metrics;
`@purista/harness` owns GenAI, model, token, and tool metrics.

```typescript
const supportServiceBuilder = new ServiceBuilder(supportServiceInfo)
	.defineMetric('app.agent.escalations', {
		kind: 'counter',
		unit: '{escalation}',
		description: 'Tickets escalated by the triage agent',
		attributes: z.object({ priority: z.enum(['normal', 'high']) }),
	})

const recordEscalation = supportServiceBuilder
	.getCommandBuilder('recordEscalation', 'Records a reviewed escalation')
	.setCommandFunction(async function (context) {
		context.metrics['app.agent.escalations'].add(1, { priority: 'high' })
		return undefined
	})
```

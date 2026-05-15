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

Agent-local custom metrics use the same declaration shape on `AgentQueueBuilder`.
PURISTA records the service and agent wrapper metrics; `@purista/harness` owns GenAI, model, token, and tool metrics.

```typescript
const triageAgent = supportServiceBuilder
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
	.defineMetric('app.agent.escalations', {
		kind: 'counter',
		unit: '{escalation}',
		description: 'Tickets escalated by the triage agent',
		attributes: z.object({ priority: z.enum(['normal', 'high']) }),
	})
	.setRunFunction(async context => {
		context.metrics['app.agent.escalations'].add(1, { priority: 'high' })
		return await triageTicket(context)
	})
```

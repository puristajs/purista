---
title: Configure OpenTelemetry for a monolith
description: Wire one monolith's EventBridge, business services, Hono projection, processor shutdown, and Meter lifecycle so traces and metrics cover the complete local request path.
order: 10212
---

A modular monolith has one process but several separately constructed PURISTA
components. Pass telemetry to every component at that composition root: the
EventBridge, each business service, and the Hono projection service.

```ts title="src/main.ts"
const eventBridge = new DefaultEventBridge({ logger, spanProcessor, metrics: { meter } })
await eventBridge.start()

const supportService = await supportV1Service.getInstance(eventBridge, {
  logger,
  spanProcessor,
  metrics: { meter },
  resources: { tickets: ticketRepository },
})
await supportService.start()

const honoService = await honoV1Service.getInstance(eventBridge, {
  logger,
  spanProcessor,
  metrics: { meter },
  serviceConfig: { services: [supportService], enableDynamicRoutes: true },
})
await honoService.start()
```

The Hono service is still a Framework service instance. Passing a processor only
to the HTTP server would omit bridge and business-service spans; passing it only
to the business service would omit HTTP-side evidence.

## Shut down telemetry after the components stop

Place all components plus the processor and Meter provider in your normal
graceful-shutdown list. The processor and provider are last because services and
bridges may finish spans or metrics while they drain.

```ts title="src/main.ts"
gracefulShutdown(logger, [
  { name: 'hono', destroy: () => honoService.destroy() },
  { name: 'support', destroy: () => supportService.destroy() },
  { name: 'event bridge', destroy: () => eventBridge.destroy() },
  { name: 'trace export', destroy: () => spanProcessor.shutdown() },
  { name: 'metrics export', destroy: () => meterProvider.shutdown() },
])
```

Use the same order for a local container exit: stop accepting HTTP, drain
services/bridges, then flush telemetry. Collector availability must not prevent
the service from completing its bounded shutdown.

Verify one HTTP command and one queued operation. Their traces should show the
HTTP, bridge, service, and worker stages available in this process; their metrics
should have stable component/operation labels rather than payload-derived ones.

Next: [configure distributed services](/handbook/framework/secure-and-operate/observability/opentelemetry/distributed-services/).

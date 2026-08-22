---
title: Zipkin
description: Configure PURISTA with Zipkin for distributed tracing.
order: 402000
---

# Zipkin

[Zipkin](https://zipkin.io) is a lightweight distributed tracing system originally created at Twitter. Like Jaeger, a single Docker container gets you up and running immediately.

![Zipkin UI showing trace waterfall](/graphic/zipkin_screenshot.png)

## Install

```bash
npm install @opentelemetry/exporter-zipkin @opentelemetry/sdk-trace-node
```

## TypeScript setup

Zipkin uses its own wire protocol (not OTLP), so you use the dedicated Zipkin exporter.

```typescript [tracing.ts]
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  return new SimpleSpanProcessor(
    new ZipkinExporter({
      url: process.env.ZIPKIN_URL ?? 'http://localhost:9411/api/v2/spans',
    })
  )
}
```

Wire it into your application:

```typescript [main.ts]
import { getSpanProcessor } from './tracing.js'
import { AmqpBridge } from '@purista/amqpbridge'

const spanProcessor = getSpanProcessor()

const eventBridge = new AmqpBridge()

const myService = await myV1Service.getInstance(eventBridge, {
  spanProcessor,
})
await eventBridge.start()
await myService.start()
```

## Run it locally

The [PURISTA repository](https://github.com/puristajs/purista) includes a ready-made example in `examples/fullexample`.

```bash
# Start Zipkin container
npm run zipkin:up

# Start the example application pointing at Zipkin
npm run zipkin:start
```

Open the **Zipkin UI** at [http://localhost:9411](http://localhost:9411) and the **OpenAPI UI** at [http://localhost:8080](http://localhost:8080) to trigger commands and generate traces.

```bash
# Stop and clean up
npm run zipkin:down
```

## Docker Compose snippet

```yaml [docker-compose.yml]
services:
  zipkin:
    image: openzipkin/zipkin:latest
    ports:
      - "9411:9411"
```

## Next steps

- [Jaeger](./jaeger.md) — similar UI, native OTLP support
- [Grafana Tempo](./grafana.md) — integrate into existing Grafana stacks

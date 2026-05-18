[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / frameworkMetricDefinitions

# Variable: frameworkMetricDefinitions

> `const` **frameworkMetricDefinitions**: `object`

Defined in: [core/metrics/frameworkMetrics.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/frameworkMetrics.ts#L17)

PURISTA framework metric catalog.

## Type Declaration

#### http.client.request.duration

> **http.client.request.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### http.server.active\_requests

> **http.server.active\_requests**: `PuristaMetricDefinition`\<`undefined`\>

#### http.server.request.duration

> **http.server.request.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### messaging.client.consumed.messages

> **messaging.client.consumed.messages**: `PuristaMetricDefinition`\<`undefined`\>

#### messaging.client.operation.duration

> **messaging.client.operation.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### messaging.client.sent.messages

> **messaging.client.sent.messages**: `PuristaMetricDefinition`\<`undefined`\>

#### messaging.process.duration

> **messaging.process.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.agent.active

> **purista.agent.active**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.agent.run.duration

> **purista.agent.run.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.agent.runs

> **purista.agent.runs**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.bridge.messages

> **purista.bridge.messages**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.bridge.operation.duration

> **purista.bridge.operation.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.command.duration

> **purista.command.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.command.executions

> **purista.command.executions**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.health.check.duration

> **purista.health.check.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.health.status

> **purista.health.status**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.queue.jobs

> **purista.queue.jobs**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.queue.oldest\_job\_age

> **purista.queue.oldest\_job\_age**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.queue.operation.duration

> **purista.queue.operation.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.queue.worker.duration

> **purista.queue.worker.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.queue.worker.executions

> **purista.queue.worker.executions**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.resource.active

> **purista.resource.active**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.resource.init.duration

> **purista.resource.init.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.store.operation.duration

> **purista.store.operation.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.store.operations

> **purista.store.operations**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.stream.active

> **purista.stream.active**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.stream.duration

> **purista.stream.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.stream.executions

> **purista.stream.executions**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.stream.frames

> **purista.stream.frames**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.subscription.duration

> **purista.subscription.duration**: `PuristaMetricDefinition`\<`undefined`\>

#### purista.subscription.executions

> **purista.subscription.executions**: `PuristaMetricDefinition`\<`undefined`\>

## Example

```ts
const commandCounter = frameworkMetricDefinitions['purista.command.executions']
```

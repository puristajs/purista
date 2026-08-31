---
title: Configure structured logging
description: Emit correlated JSON logs from Harness workflows and tools without copying prompts or secrets into the log pipeline.
order: 292
---

Use logs for discrete operational facts: a workflow started, an authorized
resource was selected, a fallback was used, or an application-owned operation
failed. Do not use logs as a copy of the conversation or model request.

## 1. Configure the logger once

`JsonLogger` writes one JSON object per line. The default minimum level is
`info`, and the default destination is `process.stdout`.

```ts title="src/observability/createApplicationLogger.ts"
import { JsonLogger } from '@purista/harness'

export const applicationLogger = new JsonLogger({
	level: 'info',
	bindings: {
		service: 'support-agent',
		environment: process.env.NODE_ENV ?? 'development',
	},
})
```

| Option | Purpose | Default |
| --- | --- | --- |
| `level` | Lowest emitted level: `trace`, `debug`, `info`, `warn`, `error`, or `fatal`. | `PURISTA_HARNESS_LOG_LEVEL`, then `info` |
| `bindings` | Stable fields included in every record, such as service and environment. | No additional fields |
| `out` | Synchronous destination with `write(chunk)`, useful for a custom transport or tests. | `process.stdout` |

An invalid `PURISTA_HARNESS_LOG_LEVEL` value falls back to `info` and emits a
warning. Prefer a configured runtime value over changing levels inside
handlers.

## 2. Give the logger to the Harness

```ts title="src/createSupportHarness.ts"
import { defineHarness } from '@purista/harness'
import { applicationLogger } from './observability/createApplicationLogger.js'

export const supportHarness = defineHarness({ name: 'support-agent' })
	.logger(applicationLogger)
	// Register models, agents, tools, and workflows here.
	.build()
```

| API | What it configures |
| --- | --- |
| [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the application composition root and gives diagnostics a stable name. |
| [`.logger(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#logger) | The logger inherited by sessions, supported adapters, workflows, and tools. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the runtime definition and returns the executable Harness. |

If `.logger(...)` is omitted, the Harness creates a default `JsonLogger`.

## 3. Log application decisions from the correct context

Workflow and TypeScript tool handlers receive `ctx.logger`; telemetry-aware
handlers receive `ctx.telemetry`. Both are already scoped to the active run.

```ts title="src/workflows/handleTicket.ts"
handler: async ctx => {
	ctx.logger.info('Handling support ticket.', {
		ticket_id: ctx.input.ticketId,
		route: 'billing',
	})

	return ctx.agents.answer_ticket(ctx.input)
}
```

```ts title="src/tools/findCustomer.ts"
handler: async (ctx, input) => {
	ctx.logger.info('Looking up customer.', {
		tool_id: ctx.toolId,
		customer_id: input.customerId,
	})

	return customerStore.find(input.customerId)
}
```

When OpenTelemetry is active, `JsonLogger` adds `trace_id` and `span_id`. The
Harness and its adapters also add run and session context where they own the
log. Application records should add the smallest business identifier needed to
find the operation.

## 4. Keep content and cardinality bounded

Good fields are stable identifiers, small enums, booleans, counts, and error
codes. Avoid prompts, model output, tool payloads, documents, authorization
headers, cookies, credentials, and arbitrary exception bodies.

`JsonLogger` redacts common credential-shaped keys and token patterns, limits
depth and collection size, and never lets a broken log sink fail the Harness
operation. This is a safety net, not permission to log sensitive content. A
field such as `customer_question` can still contain personal data even when its
key does not look secret.

## 5. Replace the logger when the application already has one

Implement the `Logger` interface when an existing platform owns log transport.
Every method must be synchronous and must not throw into Harness code. Preserve
the fields supplied by the Harness and implement `child(bindings)` by returning
a logger that merges the additional bindings.

Use the shared `loggerContract` from `@purista/harness/testing` to verify level
methods, child bindings, and non-throwing behavior. See the
[`Logger` API](/handbook/api/interfaces/_purista_harness.Logger/) for the exact
interface.

Next, [export traces and metrics](../opentelemetry/) so each correlated log can
lead to the complete request path.

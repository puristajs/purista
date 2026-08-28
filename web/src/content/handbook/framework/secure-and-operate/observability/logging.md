---
title: Configure structured logging
description: Use PURISTA’s Pino-backed logger, scoped child fields, and safe event-level practices without leaking payloads, credentials, or tenant data.
order: 1023
---

Every bridge and service has a `Logger`. When you do not provide one, PURISTA
creates its Pino-backed default logger; its default level is `debug` in
development and `info` otherwise. Create one logger at the composition root and
pass it to bridges and service instances so their child loggers share the same
output configuration.

| `getInstance` option | Default / precedence | What it changes |
| --- | --- | --- |
| [`logger`](/handbook/api/classes/_purista_core.Logger/) | When supplied, it wins over `logLevel`. | The exact logger instance used to create the service's scoped child logger. Use one when the application owns transport, redaction, or structured-output configuration. |
| [`logLevel`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Used only when `logger` is absent; the default logger chooses `debug` in development and `info` otherwise. | The minimum level for PURISTA's Pino-backed default logger. Use it for a small application that does not need a custom logger implementation. |

[`initLogger(level, options?)`](/handbook/api/functions/_purista_core.initLogger/)
creates the default logger explicitly. The same precedence applies to bridge
constructors: a supplied logger owns output policy, while `logLevel` only
selects the generated default logger.

```ts title="src/index.ts"
import { DefaultEventBridge, initLogger } from '@purista/core'

const logger = initLogger('info')
const eventBridge = new DefaultEventBridge({ logger })
await eventBridge.start()

const incidentService = await incidentV1Service.getInstance(eventBridge, { logger })
await incidentService.start()
```

PURISTA creates scoped children with service name, version, and target metadata.
Inside handlers, use `context.logger`; do not construct a new logger for every
command or capture raw request data in a closure.

Current runtime paths also attach principal and tenant identifiers to some
handler child loggers. Treat those fields as sensitive/high-cardinality data:
configure logger redaction, restricted log access, and retention before
exporting them to a shared backend. A custom logger can control log output, but
that does not by itself remove separately exported trace attributes.

```ts title="src/service/incident/v1/command/createIncident/createIncidentCommandBuilder.ts"
export const createIncidentCommandBuilder = incidentV1ServiceBuilder
  .getCommandBuilder('createIncident', 'Create an incident')
  .setCommandFunction(async function (context, payload) {
    context.logger.info({ operation: 'createIncident' }, 'creating incident')

    const incident = await context.resources.incidents.create(payload)
    context.logger.info({ operation: 'createIncident', outcome: 'created' }, 'incident created')
    return { incidentId: incident.id }
  })
```

The two builder calls define the operation boundary, not the logger. [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
uses a stable service-local target and a human-readable description; use its
optional success-event name only when the command publishes one canonical fact.
[`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the required service-bound handler that receives the scoped
`context.logger`. It must be a non-arrow `async function`, because Core rejects
arrow handlers and binds the service receiver. This logging-focused fragment
omits schemas; add payload and output schemas when the operation accepts or
returns a public contract, so invalid input and invalid results are caught at
the command boundary.

## Select a level and fields by the operator question

| Level | Use it for | Do not use it for |
| --- | --- | --- |
| `trace` | Per-message diagnostic detail during a controlled investigation | Normal production request payloads |
| `debug` | Development or temporary component diagnostics | Evidence required for every production incident |
| `info` | Startup, shutdown, significant lifecycle transitions, safe business outcomes | A log line for every internal helper call |
| `warn` | A safe fallback, retryable degradation, or approaching limit | An unexpected exception that needs action |
| `error` / `fatal` | Failed operation or process-ending condition with a safe error object | A normal validation or expected domain rejection |

The logger accepts either a message or a structured field object followed by a
message. Prefer fixed field names such as `operation`, `component`, `outcome`,
queue name, and safe error classification. Logs are useful beside traces when
they explain a decision; they are not a payload archive.

| Do | Do not |
| --- | --- |
| Log the safe error object, operation, and outcome | Log authorization headers, tokens, private keys, raw payloads, prompts, completions, or attachments |
| Use a trace ID to correlate with a trace | Add tenant, user, email, or request ID as a default log field without a reviewed policy |
| Log startup configuration by safe name/value class | Log connection strings or resolved secret values |
| Emit a concise retry/failure reason | Repeat the same stack trace at every retry layer |

Provide a custom implementation only when it implements PURISTA’s
[`Logger`](/handbook/api/classes/_purista_core.Logger/)
methods (`trace`, `debug`, `info`, `warn`, `error`, `fatal`, and
`getChildLogger`). Its child logger must preserve supplied fields; otherwise
service/bridge scope and trace correlation disappear. Keep log transport,
shipping, retention, redaction, and access control as platform responsibilities.

Next: [OpenTelemetry](/handbook/framework/secure-and-operate/observability/opentelemetry/)
for traces and metrics, and [handle command errors](/handbook/framework/build-services/commands/handle-errors/)
for the error boundary that determines what should be logged.

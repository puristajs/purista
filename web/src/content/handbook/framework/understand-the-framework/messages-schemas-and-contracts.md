---
title: Messages, schemas, and contracts
description: Define validated inputs and outputs that can survive service, process, and deployment boundaries.
order: 220
---

Schemas make a command, event, stream frame, or queue job a contract instead of an untyped object. Define the smallest payload that the receiving capability needs and validate it at the boundary.

```ts title="src/service/incident/v1/command/createIncident/schema.ts"
import { z } from 'zod'

const createIncidentPayloadSchema = z.object({
  title: z.string().min(1).max(160),
  severity: z.enum(['low', 'high']),
})

const createIncidentOutputSchema = z.object({
  incidentId: z.string(),
})
```

Use the schema in the generated builder with `addPayloadSchema(...)` and `addOutputSchema(...)`. The CLI creates a schema file beside each generated handler; retain that placement so types and tests stay close to the public contract. Define schemas before transforms, guards, and the handler because those later builder steps infer their types from the contract.

For an incident request, `title` and `severity` are the command input; the
generated `incidentId` is the response. Do not expose repository columns,
provider-specific metadata, or a caller-controlled tenant field just because
they are available in the handler. The receiving capability needs a stable
business contract, not an internal object graph.

## Contract rules

- Treat payload, parameters, output, and success-event payload as public once another service can observe them.
- Prefer additive changes. Version the service for incompatible removal, rename, or semantic change.
- Validate before side effects. A rejected payload must not create a partial incident or enqueue a job.
- Do not put credentials, access tokens, or personal data into events as a convenience for subscribers.

## Choose a schema that can support the intended surface

PURISTA validates any [Standard Schema](https://standardschema.dev/)-compatible
validator at service boundaries. Generated PURISTA projects add `zod` as a
direct application dependency and import `extendApi(...)` from
`@purista/core`, so the normal generated path needs no additional schema
package beyond those project dependencies.

| Need | Use | Important boundary |
| --- | --- | --- |
| Runtime validation and typed handler input/output | Any Standard Schema-compatible validator | The validator must implement Standard Schema validation. |
| Generated HTTP/OpenAPI/definition schema | A validator that also exposes Standard Schema JSON Schema support | Validation alone is insufficient for a transport definition. |
| Rich OpenAPI title, description, or example metadata | Zod plus `extendApi(...)` from `@purista/core` | `extendApi` adds metadata to a Zod schema; it is not a generic validator decorator. |

When JSON Schema conversion is absent or fails, PURISTA can still validate the
message but cannot describe that contract for generated transport or service
definitions. Treat that as a missing capability, not a reason to publish an
untyped endpoint. Keep provider-specific schema conversion dependencies in the
application's dependency list and verify the generated definition before a
release.

The generated API reference is the exact lookup surface. This handbook explains how to design a safe contract; it does not replace API signatures. For a focused fluent-builder example, continue with [create and validate a command](/handbook/framework/build-services/commands/create-and-validate/).

Next: [commands, events, and execution flow](/handbook/framework/understand-the-framework/commands-events-and-execution-flow/).

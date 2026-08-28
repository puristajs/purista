---
title: Add a command
description: Add a typed request-response operation to the incident service.
order: 140
---

Use a command when a caller expects one business outcome now: create an incident, reserve inventory, or approve a request. Keep the command's input and output schemas close to the handler so contracts are validated at the boundary.

## Generate the command

```bash title="Generate command"
npm run add:command -- create-incident \
  --description "Create an incident from a reported issue" \
  --service incident \
  --service-version 1 \
  --response-event incidentCreated
```

The response event is optional. Add it when other services need to react to the successful result without the command knowing who they are.

## Implement the smallest result

The generator starts with `z.unknown()` input and `z.void()` output schemas.
Replace those placeholders before accessing `payload.title` in the handler:

```ts title="src/service/incident/v1/command/createIncident/schema.ts"
import { extendApi } from '@purista/core'
import { z } from 'zod'

export const incidentV1CreateIncidentInputParameterSchema = extendApi(z.object({}), { title: 'input parameter schema' })
export const incidentV1CreateIncidentInputPayloadSchema = extendApi(
  z.object({ title: z.string().min(1).max(160), description: z.string().min(1).max(4_000) }),
  { title: 'create incident input' },
)
export const incidentV1CreateIncidentOutputPayloadSchema = extendApi(
  z.object({ incidentId: z.string() }),
  { title: 'create incident result' },
)
```

The generated command builder now exposes one typed business function. Keep the
first result deterministic and return only the declared contract. Replace the
generated handler in that file rather than pasting a detached method call into
a new file.

```ts title="src/service/incident/v1/command/createIncident/createIncidentCommandBuilder.ts"
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { incidentV1ServiceBuilder } from '../../incidentV1ServiceBuilder.js'
import {
  incidentV1CreateIncidentInputParameterSchema,
  incidentV1CreateIncidentInputPayloadSchema,
  incidentV1CreateIncidentOutputPayloadSchema,
} from './schema.js'

export const createIncidentCommandBuilder = incidentV1ServiceBuilder
  .getCommandBuilder('createIncident', 'Create an incident from a reported issue')
  .setSuccessEventName(ServiceEvent.IncidentCreated)
  .addPayloadSchema(incidentV1CreateIncidentInputPayloadSchema)
  .addParameterSchema(incidentV1CreateIncidentInputParameterSchema)
  .addOutputSchema(incidentV1CreateIncidentOutputPayloadSchema)
  .setCommandFunction(async function (_context, payload, _parameter) {
    return { incidentId: `incident-${payload.title.length}` }
  })
```

Use a database-generated identifier in a real application. Do not derive identifiers from user input as this demonstration does.

| Declaration | What it establishes | Options and boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | The service-owned command name and operator-facing description. | The name becomes part of the address clients invoke; change it as a contract migration, not a refactor. |
| [`setSuccessEventName(name)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) | A success event published only after the command succeeds. | Omit it when no independent consumer needs notification. The event uses the successful response flow, so consumers should still validate their own event contract. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) / [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) | The validated body and parameter contracts, and the inferred `payload`/`parameter` handler types. | The parameter schema may be empty for a command with no path/query data. Do not include trusted identity or secrets in either externally supplied contract. |
| [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The validated successful result and the type returned to the caller. | A result outside this schema fails the command instead of becoming an undocumented response. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The implementation after the command runtime has validated input. | Use `async function` so the Framework can bind the service receiver. [Commands](/handbook/framework/build-services/commands/) owns guards, transforms, errors, outbound calls, and HTTP exposure. |

## Verify the contract

The generator creates a command test. Update it with a valid payload and run:

```bash title="Run generated project checks"
npm test
```

Choose a [subscription](/handbook/framework/start/add-a-subscription/) when the creation should trigger independent work. Choose a queue when it must be processed later or with durable retry.

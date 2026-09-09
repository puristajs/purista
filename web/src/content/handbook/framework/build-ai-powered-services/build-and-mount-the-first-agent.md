---
title: Build and mount the first agent
description: Define one agent beside its owning service, mount it once, and call it through EventBridge.
order: 392
---

Start with an existing service. The project-local CLI creates the agent under
that service version and updates its one Harness definition:

```bash title="Create an internal agent"
npm run add:agent -- triage-ticket \
  --service support \
  --service-version 1 \
  --description "Classify a support ticket"
```

`--http` defaults to `none`, so this command creates no route. Use
`--http command` for a protected request/response wrapper or `--http stream`
for a protected AI SDK UI Message Stream v1 wrapper.

## Define the agent

Keep the definition with the service version that owns it. Use lower camel
case for the stable agent id.

```ts title="src/service/support/v1/harness/agent/triageTicket/triageTicketAgent.ts"
import { defineAgent } from '@purista/harness'
import { z } from 'zod'

export const triageInput = z.object({
  ticketId: z.string().min(1),
  text: z.string().min(1),
})

export const triageOutput = z.object({
  priority: z.enum(['low', 'normal', 'high']),
  reason: z.string().min(1),
})

export const triageTicketAgent = defineAgent('triageTicket', {
  input: triageInput,
  output: triageOutput,
  instructions: 'Classify the ticket and give one short reason.',
  prompt: input => ({
    role: 'user',
    content: `Ticket ${input.ticketId}: ${input.text}`,
  }),
})
```

The `prompt` function maps validated business input to a model message. Do not
put credentials, providers, tenant identity, or transport values in this file.

Compose the root directly:

```ts title="src/service/support/v1/harness/supportHarness.ts"
import { defineHarness } from '@purista/harness'
import { triageTicketAgent } from './agent/triageTicket/triageTicketAgent.js'

export const supportHarness = defineHarness({ name: 'support' })
  .addAgent(triageTicketAgent)

export const supportHarnessPolicy = {
  targets: {
    agents: { triageTicket: {} },
  },
} as const
```

Every agent added as a root receives a service address when mounted. The
`targets` entry is where this service attaches guards, success events, queue
delivery, or durable-resume policy. Nested dependency agents stay private.

Mount the graph once on the final service builder:

```ts title="src/service/support/v1/supportV1Service.ts"
export const supportV1Service = supportV1ServiceBuilder
  .addCommandDefinition(runTriageTicketCommandBuilder.getDefinition())
  .mountHarness(supportHarness, supportHarnessPolicy)
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
records the graph and its root policy. A service accepts one Harness mount.

## Call the mounted address

Import the definition and pass its authentic contract as the third argument.
The contract supplies the target id and all input, output, update, and
interruption types.

```ts title="src/service/support/v1/command/runTriageTicket/runTriageTicketCommandBuilder.ts"
export const runTriageTicketCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('runTriageTicket', 'Classify a support ticket')
  .addPayloadSchema(triageInput)
  .addOutputSchema(triageOutput)
  .canInvokeAgent('Support', '1', triageTicketAgent.contract)
  .setCommandFunction(async function ({ agent }, payload) {
    const result = await agent.Support['1'][triageTicketAgent.contract.id].run(payload, {
      sessionId: `ticket:${payload.ticketId}`,
    })
    if (result.outcome.status !== 'completed') {
      throw new Error('This command requires a completed triage result')
    }
    return result.outcome.output
  })
```

[`canInvokeAgent(service, version, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
adds the typed client to the handler. The call crosses EventBridge even when
both services run in one process. The aggregate result contains the resolved
`sessionId` and the typed `outcome`.

Bind the model only when the service instance is created:

```ts title="src/index.ts"
const support = await supportV1Service.getInstance(eventBridge, {
  resources,
  ai: {
    model: { provider: modelProvider, model: 'provider-model-id' },
  },
})
```

The provider package and credentials belong to the application composition
root. The generated first-agent bootstrap uses an environment schema and never
writes a credential value into source.

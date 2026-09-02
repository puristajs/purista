---
title: Build and mount the first agent
description: Scaffold a native Harness definition and PURISTA command, mount the selected agent, bind a model, and run it through EventBridge.
order: 392
---

Start with a service and let the project-local CLI create the files:

```bash title="Scaffold the service and agent"
npm run add:service -- Support 1
npm run add:agent -- triage-ticket --service Support --service-version 1
```

The scaffold has two deliberate parts: a portable Harness definition and a
normal PURISTA command that calls the mounted target. Keep the Harness file free
of PURISTA imports.

```ts title="src/harness/incident/incidentHarness.ts"
import { defineHarness } from '@purista/harness'
import { z } from 'zod'

export const triageInput = z.object({ ticketId: z.string(), text: z.string() })
export const triageOutput = z.object({
  priority: z.enum(['low', 'normal', 'high']),
  reason: z.string(),
})

export const incidentHarness = defineHarness({ name: 'incident-support' })
  .requireModel('primary', { capabilities: ['object'] })
  .agent('triage_ticket', {
    description: 'Classify one support ticket',
    input: triageInput,
    output: triageOutput,
    model: 'primary',
    instructions: 'Classify the ticket. Return only facts supported by the input.',
    updates: 'none',
  })
  .define()
```

Mount only the target that this service publishes:

```ts title="src/service/support/v1/supportV1Service.ts"
export const supportV1Service = supportV1ServiceBuilder
  .addCommandDefinition(triageTicketCommandBuilder.getDefinition())
  .mountHarness(incidentHarness, {
    publish: { agents: ['triage_ticket'] },
  })
```

The command declares the address and contract before using it. The
[`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema)
and
[`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
calls validate the command boundary independently of the Harness contract.

```ts title="triageTicketCommandBuilder.ts"
export const triageTicketCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('triageTicket', 'Classifies a support ticket')
  .addPayloadSchema(triageInput)
  .addOutputSchema(triageOutput)
  .canInvokeAgent('Support', '1', 'triage_ticket', incidentHarness.contracts.agents.triage_ticket)
  .setCommandFunction(async function ({ agent }, payload) {
    const outcome = await agent.Support['1'].triage_ticket.run(payload)
    if (outcome.status !== 'completed') {
      throw new Error('This bounded command cannot complete while the run is interrupted')
    }
    return outcome.output
  })
```

Bind a compatible provider under the `primary` alias in the composition root.
Credentials belong in secret configuration, never in the definition.

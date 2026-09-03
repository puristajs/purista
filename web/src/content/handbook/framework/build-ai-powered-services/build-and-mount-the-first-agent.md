---
title: Build and mount the first agent
description: Scaffold a native Harness module, compose and mount it once in the owning service, then call it through EventBridge.
order: 392
---

Start with a service and let the project-local CLI create the files:

```bash title="Scaffold the service and agent"
npm run add:service -- Support 1
npm run add:agent -- triage-ticket --service Support --service-version 1
npm run add:command -- triage-ticket --service Support --service-version 1
```

The first agent creates a native module, the service's single portable Harness
definition, and one mount policy. The last command creates the ordinary
request/response consumer that you will edit below. Later `add:agent` calls add
modules to that same definition and targets to the same policy. Keep the
Harness files free of PURISTA imports.

```ts title="src/harness/support/agent/triageTicket/triageTicketAgent.ts"
import { defineHarnessModule, type BuilderState, type ModelAlias } from '@purista/harness'
import { z } from 'zod'

export const triageInput = z.object({ ticketId: z.string(), text: z.string() })
export const triageOutput = z.object({
  priority: z.enum(['low', 'normal', 'high']),
  reason: z.string(),
})

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

export const triageTicketAgent = defineHarnessModule<PrimaryModelState>()('support.agent.triage-ticket', {
  version: '1.0.0',
  register(builder) {
    return builder.agent('triage_ticket', {
      input: triageInput,
      output: triageOutput,
      model: 'primary',
      instructions: 'Classify the ticket. Return only facts supported by the input.',
      updates: 'none',
    })
  },
})
```

The service definition declares the portable model requirement and composes
the module:

```ts title="src/harness/support/supportHarness.ts"
import { defineHarness } from '@purista/harness'
import { triageTicketAgent } from './agent/triageTicket/triageTicketAgent.js'

export const supportHarness = defineHarness({ name: 'support' })
  .requireModel('primary', { capabilities: ['object'] })
  .use(triageTicketAgent)
  .define()
```

The generated mount file publishes only the selected target:

```ts title="src/service/support/v1/harness/supportHarnessMount.ts"
import { supportHarness } from '../../../../harness/support/supportHarness.js'

export { supportHarness }

export const supportHarnessPolicy = {
  publish: { agents: ['triage_ticket'] },
  targets: { agents: {} },
} as const
```

The service composition contains the only mount call:

```ts title="src/service/support/v1/supportV1Service.ts"
export const supportV1Service = supportV1ServiceBuilder
  .addCommandDefinition(triageTicketCommandBuilder.getDefinition())
  .mountHarness(supportHarness, supportHarnessPolicy)
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
attaches the one composed definition and publishes only the policy's selected
targets. A second mount on the same service is rejected.
[`addCommandDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addcommanddefinition)
registers the separate application command on the same service.

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
  .canInvokeAgent('Support', '1', 'triage_ticket', supportHarness.contracts.agents.triage_ticket)
  .setCommandFunction(async function ({ agent }, payload) {
    const outcome = await agent.Support['1'].triage_ticket.run(payload)
    if (outcome.status !== 'completed') {
      throw new Error('This bounded command cannot complete while the run is interrupted')
    }
    return outcome.output
  })
```

[`canInvokeAgent(service, version, target, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
declares the remote address and derives the handler client's input, outcome,
and stream types from the neutral Harness contract. The call still crosses the
EventBridge when caller and target run in one process.
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the application command, while
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs its bounded aggregate handler.

Bind a compatible provider under the `primary` alias in the composition root.
Credentials belong in secret configuration, never in the definition.

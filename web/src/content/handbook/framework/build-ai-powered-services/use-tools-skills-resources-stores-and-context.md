---
title: Use tools, skills, resources, stores, and context
description: Use the attached-agent handler context safely, declare every reachable Framework capability, and keep authority at the underlying business boundary.
order: 395
---

[`setRunFunction(handler)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setrunfunction)
receives one `AgentHandlerContext`. It is the place for
service-owned integration code: reading a declared resource, invoking a
declared domain command, emitting an application-owned run event, recording a
safe metric, or using a declared model handle. A model instruction is never an
authorization mechanism.

## What the handler receives

| Context member | Source / declaration | Use it for |
| --- | --- | --- |
| `payload`, `parameter` | `addPayloadSchema`, `addParameterSchema` | Validated request input. |
| `identity` | Trusted PURISTA message context | Transport ID, correlation/trace IDs, tenant/principal metadata, agent/run/session identity. Do not obtain authority from model output. |
| `resources` | `ServiceBuilder.defineResource` + `getInstance({ resources })` | Application repositories, domain gateways, and other service-owned dependencies. |
| `message` | Owning PURISTA execution context | Read transport metadata only when a documented Framework contract requires it. It is not a replacement for `identity` or a source of authority. |
| `metrics`, `logger` | Service/agent `defineMetric`; service logger | Safe application signals and structured diagnostics. Never log prompts, completions, credentials, or raw sensitive input. |
| `signal` | Live generated-stream cancellation | Cooperatively stop stream work and pass it to supported calls. Current generated command and queue-worker executions do not forward a cancellation signal into the attached-agent context. |
| `harness.session`, `.models`, `.skills`, `.events` | Declared model / configured skill runtime | Provider-neutral model handles, skill metadata, and wrapped Harness run events. |
| `invoke.tools`, `invoke.agents` | `canInvoke`, `canInvokeAgent` | Only the command or agent calls explicitly declared on this builder. |

`invoke` is the typed, supported way for an attached agent to call another
command or attached agent. Do not build new calls from untyped forwarded
execution fields: they bypass the declaration that gives the handler its schema
and capability contract.

## Declare and use a domain command as a tool

[`canInvoke(serviceName, serviceVersion, commandName, schemas?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#caninvoke)
is both a type and capability declaration. `serviceName`, `serviceVersion`,
and `commandName` must be non-empty. Its optional schema object may contain
`payloadSchema`, `parameterSchema`, and `outputSchema`; provide all schemas for
an independently owned command so the call is checked at both sides. Omit a
schema only when its contract is intentionally not constrained here. This does
not replace the target command’s authorization, tenant checks, or input
validation.

```ts title="src/service/support/v1/agent/triageTicket/triageTicketAgentBuilder.ts"
export const triageTicketAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
  .addPayloadSchema(triageTicketInput)
  .addOutputSchema(triageTicketOutput)
  .canInvoke('Support', '1', 'getTicket', {
    payloadSchema: ticketLookupInput,
    outputSchema: ticketSchema,
  })
  .setRunFunction(async context => {
    const ticket = await context.invoke.tools['Support.1.getTicket'].call({
      ticketId: context.payload.ticketId,
    })

    context.metrics['app.support.triage.started'].add(1)
    return { priority: ticket.customerImpact === 'high' ? 'high' : 'normal', reason: 'Domain policy applied' }
  })
```

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
creates the service-owned agent plus generated command, stream, queue, and
worker projections. [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema)
validates caller data before this handler, while
[`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema)
checks the final application result. [`setRunFunction(handler)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setrunfunction)
installs the application-owned async execution shown here; it is mutually
exclusive with `setHarnessAgent` and `setHarnessWorkflow`.

[`canInvokeAgent(agentName, serviceVersion, schemas?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#caninvokeagent)
exposes a same-service attached agent at
`context.invoke.agents['agentName.version'].run(payload, parameter?)`. Both
names must be non-empty; the optional payload, parameter, and output schemas
have the same role as `canInvoke`. Use it only when an explicit service-level
delegation boundary is useful; for internal Harness workflow delegation, configure the workflow in the
[AI Harness handbook](/handbook/harness/orchestrate-work/).

## Skills, built-in tools, resources, and stores

| Need | Declare here | Enable at composition | Important boundary |
| --- | --- | --- | --- |
| A named skill directory | [`useSkills(names, resourceName?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#useskills) | `ai.skills.bindings` or `ai.skills.namespaces` resolves named directories. | `names` is a non-empty skill-name array. An optional non-empty `resourceName` chooses a configured namespace. A missing binding fails attached runtime initialization; skill bodies are mounted files, not prompt text. |
| Built-in Harness tools | Inline `setHarnessAgent({ builtinTools })` plus a compatible Harness sandbox/tool setup. | A compatible Harness sandbox/tool setup. | Put `builtinTools: false` or a narrow allow-list on the inline Harness agent definition. The builder's `useBuiltInTools(...)` setting is not consistently applied when no runtime skill resolves, so do not treat it as an enforced boundary until that Framework defect is repaired. |
| Application repository/gateway | `defineResource` | `getInstance({ resources })` | Resource methods must authorize their own effects. |
| Framework state/config/secret store | Use normal service/handler store context | Wire the selected store at composition. | See [Use stores and configuration](/handbook/framework/configure-applications/); do not store prompts or secrets indiscriminately. |

The optional `ai.skills.discovery` capability is a convenience for trusted
development environments. Prefer explicit production bindings. The Harness
guides own how to author skills, configure MCP, and implement or govern tools.

Next: [manage sessions, workspaces, and durable work](/handbook/framework/build-ai-powered-services/manage-sessions-workspaces-and-durable-work/).

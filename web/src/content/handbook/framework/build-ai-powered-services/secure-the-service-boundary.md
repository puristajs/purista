---
title: Secure the service boundary
description: Protect attached-agent input, trusted identity, resources, tools, HTTP exposure, and output at the normal PURISTA boundary before model behavior is involved.
order: 3991
---

An attached agent can reason over content, but it must not become the authority
for a business action. Secure the service boundary first; then apply
content-specific policy in Harness where it belongs.

## Apply controls at the component that can enforce them

| Boundary | Do | Do not |
| --- | --- | --- |
| Input schemas | Bound size and shape with payload/parameter schemas before the runtime starts. | Pass an unbounded request, prompt, attachment, or arbitrary JSON through as a model input. |
| Identity and tenancy | Use trusted message `tenantId` and `principalId`; authorize in resources and target commands. | Accept tenant, role, owner, or permission claims from model output. |
| Domain actions | Declare `canInvoke`/`canInvokeAgent` narrowly; re-check authorization in the called command/resource. | Treat a tool declaration or prompt instruction as complete authorization. |
| HTTP | Leave endpoints non-public by default; configure authentication and tenant propagation in Hono. | Call `makeEndpointPublic()` as a shortcut around an actual security design. |
| Sandbox and workspace | Configure the application-owned adapter once; request only the required sharing and workspace capabilities. | Let one agent choose its adapter, owner, host path, or credentials. |
| Output and telemetry | Validate output schemas; log safe decision metadata and metrics only. | Log prompts, completions, secrets, raw headers, or tenant/user data. |

## Keep private capability declarations small

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
		return classifyTicket(ticket, context.identity.tenantId)
	})
```

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
creates the generated command, stream, queue, and worker boundaries for this
service-owned operation. [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema)
rejects untrusted input before the handler, and
[`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema)
prevents an unchecked result from leaving the service. [`setRunFunction(handler)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setrunfunction)
selects an application-owned async handler and is mutually exclusive with an
inline Harness agent or Harness workflow; use it here because domain code, not
a model loop, produces the result. [`canInvoke(serviceName, serviceVersion,
commandName, schemas?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#caninvoke)
creates the typed Framework command-tool handle; its optional schemas describe
the call boundary but never replace authorization in the target command.

This model-free run function has no Harness tool or sandbox runtime. Apply
`builtinTools` directly to an inline Harness agent definition when that is the
execution shape. `setSandboxPolicy` requests a sharing/owner policy only for a
configured Harness sandbox; runtime adapter selection and explicit-owner
authorization remain in `getInstance(..., { ai: { sandbox, sandboxOptions } })`.
The owner resolver receives validated input and trusted identity, but it does
not itself authorize access.

Continue with [configure governance and Guardrails](/handbook/framework/build-ai-powered-services/configure-governance-and-guardrails/)
for the exact attached-agent and service-instance wiring. Use [configure
sandbox ownership and sharing](/handbook/framework/build-ai-powered-services/configure-sandbox-ownership-and-sharing/)
before granting file or process capabilities. The Harness handbook remains the
canonical owner for rail authoring, policy semantics, detector and sandbox
adapter selection, and evaluation; no Framework attachment silently enables
those optional capabilities.

Next: [test an AI-powered service deterministically](/handbook/framework/build-ai-powered-services/test-an-ai-powered-service-deterministically/).

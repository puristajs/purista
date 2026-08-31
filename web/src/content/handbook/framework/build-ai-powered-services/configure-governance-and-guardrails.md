---
title: Configure governance and Guardrails
description: Attach content rails to one agent definition and inject service-level tool governance at runtime without moving business authorization into the model loop.
order: 3992
---

PURISTA keeps two security decisions at different layers. The attached agent
definition owns content rails because they surround that agent's input, model,
tool, and output lifecycle. The service composition root owns governance and
approval because they are runtime policy and adapter concerns. Commands and
resources still own business authorization.

| Control | Declare it at | Purpose |
| --- | --- | --- |
| Guardrails actions and flow order | Attached Harness agent definition | Inspect, block, or transform content around one default-loop agent |
| Governance policies, approval, and audit | `getInstance(..., { ai: { governance } })` | Apply runtime tool decisions across attached agent runtimes |
| Principal/tenant authorization | Command guard, resource, or tool-backed command | Decide whether this caller may perform the business effect |

## 1. Install Guardrails only when content inspection is needed

```bash title="Install the Guardrails addon"
npm install @purista/harness-guardrails
```

The Framework core integration already supports Harness interceptors and
governance runtime configuration. The addon is a separate application
dependency; installing it does not attach a rail or configure a detector.

## 2. Define the rails and declare every required model

This claims agent uses the provider-neutral `primary` alias for the answer and
the provider-neutral `safety` alias for semantic input/output checks. Both are
declared before `setHarnessAgent(...)`, so the builder and runtime can validate
their capabilities.

```ts title="src/service/claims/v1/agent/reviewClaim/reviewClaimAgentBuilder.ts"
import { defineGuardrails, modelCheckRail } from '@purista/harness-guardrails'

const claimRails = defineGuardrails({
	config: {
		rails: {
			input: { flows: ['claim input policy'] },
			output: { flows: ['claim output policy'] },
		},
	},
	actions: {
		'claim input policy': modelCheckRail({
			phase: 'input',
			model: 'safety',
			instructions: 'Allow only synthetic claim-review input without personal data.',
		}),
		'claim output policy': modelCheckRail({
			phase: 'output',
			model: 'safety',
			instructions: 'Allow only responses without private claim details.',
		}),
	},
	actionTimeoutMs: 2_000,
})

export const reviewClaimAgentBuilder = claimsV1ServiceBuilder
	.getAgentQueueBuilder('reviewClaim', 'Reviews one synthetic insurance claim')
	.addPayloadSchema(reviewClaimInput)
	.addOutputSchema(reviewClaimOutput)
	.addModel('primary', { capabilities: ['object'] })
	.addModel('safety', { capabilities: ['object'] })
	.setHarnessAgent({
		model: 'primary',
		input: reviewClaimInput,
		output: reviewClaimOutput,
		instructions: 'Review the claim and return the declared recommendation.',
		guardrails: claimRails,
	})
```

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
creates the service-owned attached-agent projections.
[`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema)
and [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema)
define their input and final result.
[`addModel(alias, requirement)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel)
declares a provider-neutral capability requirement. `modelCheckRail` refers to
that same alias. It does not select a provider or concrete model. The
composition root supplies both runtime bindings.
[`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent)
attaches the inline default-loop definition after those aliases exist.

Use deterministic rails and a privacy detector before a model rail when they
can express the policy. The Harness [model-backed Guardrails guide](/handbook/harness/secure-and-govern/model-backed-guardrails/)
explains ordering, failure, telemetry, and evaluation.

## 3. Bind providers and runtime governance at service construction

```ts title="src/bootstrap.ts"
const claimsService = await claimsV1Service.getInstance(eventBridge, {
	ai: {
		models: {
			primary: {
				provider: openaiProvider,
				model: process.env.CLAIMS_MODEL!,
			},
			safety: {
				provider: guardrailProvider,
				model: process.env.GUARDRAIL_MODEL!,
			},
		},
		governance: {
			mode: 'enforce',
			defaultEffect: 'deny',
			policies: [claimToolPolicy],
			approval: claimApprovalProvider,
			audit: claimDecisionAudit,
		},
		telemetry: { contentCaptureMode: 'NO_CONTENT' },
	},
})
```

Every attached agent in this service process receives the service-level
governance configuration. Scope each policy to exact tool IDs and use stable
policy/rule IDs. Runtime construction fails if a declared model binding is
missing or lacks a required capability. Guardrails fail closed on block,
timeout, invalid result, or provider failure; governance fails closed on policy,
approval, or audit failure.

Governance approval is a bounded callback for one prepared tool occurrence.
For a human decision that may outlive the process, use the application-owned
[durable review flow](/handbook/harness/orchestrate-work/human-review/).

## 4. Test enforcement before live quality

Use `createAgentTestHarness(definition, { models, governance })` with strict
fake model providers. Prove that a block or denial prevents the application
model/tool handler, that approval is requested once, and that errors contain
only safe decision evidence. These tests prove Framework/Harness composition.
Measure live guardrail and agent correctness with versioned evaluation datasets.

Next: [configure sandbox ownership and sharing](/handbook/framework/build-ai-powered-services/configure-sandbox-ownership-and-sharing/).

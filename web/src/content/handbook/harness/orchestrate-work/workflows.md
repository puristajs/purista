---
title: Build a workflow
description: Coordinate a small number of typed steps with explicit data flow and policy.
order: 510
---

Declare agents before workflows so `ctx.agents` is typed from registered agent
keys. Keep one workflow centered on a business outcome such as reviewing an
incident, not on a generic model conversation. The example is deterministic so
you can prove data flow and policy before substituting a model-backed agent.

```ts title="src/harness/incidentReview.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

export const incidentReviewHarness = defineHarness({ name: 'incident-review' })
  .sandbox(inMemorySandbox())
  .models({
    local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
  })
  .agents(({ agent }) => ({
    facts: agent({
      model: 'local', input: z.object({ report: z.string() }), output: z.object({ confirmed: z.boolean() }),
      builtinTools: false, instructions: 'Extract facts.', handler: async () => ({ confirmed: true }),
    }),
    risk: agent({
      model: 'local', input: z.object({ confirmed: z.boolean() }), output: z.object({ level: z.enum(['low', 'medium', 'high']) }),
      builtinTools: false, instructions: 'Assess risk.', handler: async ({ input }) => ({ level: input.confirmed ? 'medium' : 'low' }),
    }),
  }))
  .workflows(({ workflow }) => ({
    review_incident: workflow({
      input: z.object({ report: z.string() }),
      output: z.object({ level: z.enum(['low', 'medium', 'high']) }),
      delegation: { agents: ['facts', 'risk'] },
      handler: async (ctx) => ctx.agents.risk(await ctx.agents.facts({ report: ctx.input.report })),
    }),
  }))
  .build()
```

```ts title="src/runIncidentReview.ts"
import { incidentReviewHarness } from './harness/incidentReview.js'

const session = await incidentReviewHarness.getSession('incident:42')
console.log(await session.workflows.review_incident.prompt({ report: 'Checkout errors increased after a deploy.' }))
await incidentReviewHarness.shutdown()
```

```text title="Expected deterministic workflow result"
{ level: 'medium' }
```

Child-agent delegation is disabled by default. A workflow-local `delegation`
block is the clearest opt-in: it restricts agents and can bound total calls,
parallel calls, depth, and model aliases. Policy violations fail with
`DelegationPolicyError`; do not replace that boundary with a prompt.

| Call or field | Runtime effect | When to set it |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates this named composition root; a missing name uses `agent-harness`. | The name helps distinguish local runtime diagnostics. It neither enables delegation nor selects a model. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the fixed files-only capability contract returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/) before workflow or agent sandbox policies are checked. | The factory takes no options and exposes only `sandbox.fs`; it has no executor, process spawning, or durable filesystem. Passing it avoids automatic adapter detection for this handler-only workflow. Choose an adapter with the exact required capabilities before adding sandbox-backed tools; this is not a tenant-isolation boundary. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the `local` alias before either agent names it. | This static provider works because both agents use custom handlers. Replace it with a real provider before removing those handlers. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Registers `facts` and `risk` before a workflow refers to them. | Always define agents before workflows so `ctx.agents` is typed from actual IDs. |
| [`.workflows(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflows) | Registers `review_incident` as `session.workflows.review_incident`. | Use the callback helper to infer `ctx.input`, `ctx.agents`, and the declared output schema. |
| [`delegation.agents`](/handbook/api/interfaces/_purista_harness.WorkflowDelegationPolicy/#agents) | Limits child calls to the named agents. | Use an allowlist for production workflows; omitting it permits every registered agent. |
| [`delegation.maxChildAgentCalls`](/handbook/api/interfaces/_purista_harness.WorkflowDelegationPolicy/#maxchildagentcalls) | Caps total child calls in one run. | Set it when a workflow can fan out or recurse. It overrides the Harness default. |
| [`delegation.maxParallelChildAgentCalls`](/handbook/api/interfaces/_purista_harness.WorkflowDelegationPolicy/#maxparallelchildagentcalls) | Caps simultaneously active child calls. | Lower it to protect shared provider and tool quotas. |
| [`delegation.maxDepth`](/handbook/api/interfaces/_purista_harness.WorkflowDelegationPolicy/#maxdepth) | Caps nested local delegation. | Set it whenever child agents can invoke workflow logic that delegates again. |
| [`delegation.modelAliases`](/handbook/api/interfaces/_purista_harness.WorkflowDelegationPolicy/#modelaliases) | Restricts aliases usable by child agents. | Use it to prevent an expensive or higher-risk model alias in a workflow. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the complete model, agent, and workflow registry graph before returning the Harness. | Run it after the workflow registry. Unknown aliases or disallowed delegation fail before a workflow request is served. |

Use `ctx.fanOut(items, fn, { concurrency })` for independent work and return a
schema-validated result. Handle partial failures deliberately—often with
`Promise.allSettled` and a result that identifies unavailable sources. Map
workflow `RunEvent` values to SSE or WebSocket in your application; Harness
does not define a browser streaming protocol.

Next: [child tasks and data flow](/handbook/harness/orchestrate-work/child-tasks-and-data-flow/).

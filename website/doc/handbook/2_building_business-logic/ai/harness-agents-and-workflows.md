---
title: Harness Agents And Workflows
description: Understand harness-level agents/workflows and PURISTA-level orchestration.
order: 207020
---

# Harness agents and workflows

`@purista/ai` embeds `@purista/harness` behind a PURISTA service boundary. The harness provides lower-level agent loops, workflows, model providers, tools, skills, memory, history, state, sandboxing, telemetry, and streaming events.

The PURISTA package exposes those capabilities as queue-backed business logic.

## Choose the orchestration level

```mermaid
flowchart TD
  Start["New AI use case"] --> One["Can one model loop finish it?"]
  One -- "Yes" --> PuristaRun["PURISTA agent with setRunFunction or setHarnessAgent"]
  One -- "No" --> SameSandbox["Should steps share one harness session, memory, history, and sandbox?"]
  SameSandbox -- "Yes" --> HarnessWorkflow["PURISTA agent with setHarnessWorkflow"]
  SameSandbox -- "No" --> PuristaWorkflow["PURISTA parent agent invoking child agents"]
```

| Pattern | Best for | Tradeoff |
| --- | --- | --- |
| `setRunFunction(...)` | Most PURISTA application agents. You need typed access to PURISTA resources, command tools, child agents, model aliases, and events. | You own the orchestration code directly. |
| `setHarnessAgent(...)` | Reusing one harness agent loop with instructions, tools, skills, and output schema. | One harness agent is exposed as one PURISTA agent. |
| `setHarnessWorkflow(...)` | Several tightly coupled harness agents should run inside one session and sandbox instance. | Inner agents are harness-local, not independent PURISTA queue-backed agents. |
| Parent PURISTA agent + `canInvokeAgent(...)` | Larger workflows where each agent needs its own queue, model binding, sandbox, retry policy, stream, or service owner. | More explicit service contracts and operational boundaries. |

## Harness agent

A harness agent is one typed model conversation loop. It prepares instructions, calls a model, handles tool calls, feeds results back into the model, validates output, and emits run events.

```ts
import { z } from 'zod'

const ticketClassifier = {
  model: 'primary',
  input: z.object({
    ticketId: z.string(),
    text: z.string(),
  }),
  output: z.object({
    priority: z.enum(['low', 'normal', 'high']),
    reason: z.string(),
  }),
  builtinTools: false,
  instructions: 'Classify the ticket. Return a structured result only.',
}

const triageAgent = await supportService
  .getAgentQueueBuilder('triage', 'Classifies tickets')
  .addPayloadSchema(ticketClassifier.input)
  .addOutputSchema(ticketClassifier.output)
  .addModel('primary', {
    model: 'support-fast',
    capabilities: ['object'],
  })
  .setHarnessAgent(ticketClassifier)
  .getDefinition()
```

Use this shape when the harness loop is exactly the behavior you want and the agent does not need custom PURISTA orchestration code.

## Harness workflow

A harness workflow coordinates one or more harness agents inside the same harness session and sandbox instance.

This is useful when the steps are one tightly coupled AI run:

- research, then synthesize, then judge using the same mounted workspace
- extract facts, assess risk, and draft a report from the same incident bundle
- call several specialized harness agents that should share memory/history
- run a review loop where all steps belong to one AI session

```ts
const factExtractor = {
  model: 'primary',
  input: z.object({ text: z.string() }),
  output: z.object({ facts: z.array(z.string()) }),
  builtinTools: false,
  instructions: 'Extract factual statements.',
}

const riskAssessor = {
  model: 'primary',
  input: z.object({ facts: z.array(z.string()) }),
  output: z.object({
    risk: z.enum(['low', 'medium', 'high']),
    reasons: z.array(z.string()),
  }),
  builtinTools: false,
  instructions: 'Assess operational risk from the facts.',
}

const incidentReviewWorkflow = {
  input: z.object({ text: z.string() }),
  output: z.object({
    facts: z.array(z.string()),
    risk: z.enum(['low', 'medium', 'high']),
    reasons: z.array(z.string()),
  }),
  agents: {
    factExtractor,
    riskAssessor,
  },
  handler: async ctx => {
    const facts = await ctx.agents.factExtractor({ text: ctx.input.text })
    const risk = await ctx.agents.riskAssessor({ facts: facts.facts })

    return {
      facts: facts.facts,
      risk: risk.risk,
      reasons: risk.reasons,
    }
  },
}

const reviewAgent = await incidentService
  .getAgentQueueBuilder('incidentReview', 'Reviews an incident bundle')
  .addPayloadSchema(incidentReviewWorkflow.input)
  .addOutputSchema(incidentReviewWorkflow.output)
  .addModel('primary', {
    model: 'incident-reasoning',
    capabilities: ['object', 'tool_use'],
  })
  .setHarnessWorkflow(incidentReviewWorkflow)
  .getDefinition()
```

All inner harness agents in the workflow share the harness runtime for that attached PURISTA agent. That means shared session identity, memory, history, sandbox adapter, state store, logger, telemetry, and model bindings.

## PURISTA-level orchestration

Use PURISTA orchestration when the agents are independent business capabilities.

```mermaid
flowchart LR
  Parent["productReview agent"] --> Req["requirementsReview agent"]
  Parent --> Arch["architectureReview agent"]
  Parent --> Sec["securityReview agent"]
  Parent --> Test["testReview agent"]
  Req --> Result["readiness output"]
  Arch --> Result
  Sec --> Result
  Test --> Result
```

```ts
const productReviewAgent = await reviewService
  .getAgentQueueBuilder('productReview', 'Combines specialized review agents')
  .addPayloadSchema(z.object({
    specMarkdown: z.string(),
    architectureMarkdown: z.string(),
    diffSummary: z.string(),
  }))
  .addOutputSchema(z.object({
    ready: z.boolean(),
    blockers: z.array(z.string()),
    reviews: z.object({
      requirements: z.unknown(),
      architecture: z.unknown(),
      security: z.unknown(),
      tests: z.unknown(),
    }),
  }))
  .canInvokeAgent('requirementsReview', '1')
  .canInvokeAgent('architectureReview', '1')
  .canInvokeAgent('securityReview', '1')
  .canInvokeAgent('testReview', '1')
  .setRunFunction(async context => {
    const [requirements, architecture, security, tests] = await Promise.all([
      context.invoke.agents['requirementsReview.1'].run({
        specMarkdown: context.payload.specMarkdown,
      }),
      context.invoke.agents['architectureReview.1'].run({
        architectureMarkdown: context.payload.architectureMarkdown,
      }),
      context.invoke.agents['securityReview.1'].run({
        diffSummary: context.payload.diffSummary,
      }),
      context.invoke.agents['testReview.1'].run({
        diffSummary: context.payload.diffSummary,
      }),
    ])

    const blockers = [
      ...extractBlockers(requirements),
      ...extractBlockers(architecture),
      ...extractBlockers(security),
      ...extractBlockers(tests),
    ]

    return {
      ready: blockers.length === 0,
      blockers,
      reviews: { requirements, architecture, security, tests },
    }
  })
  .getDefinition()
```

Each child agent is a real PURISTA command/queue/stream capability. It can run with a different model provider, queue bridge behavior, sandbox adapter, timeout, retry policy, and HTTP exposure.

## Same sandbox or independent sandbox?

Use the same harness workflow sandbox when:

- several inner agents need the same temporary files or mounted skills
- the work is one user run and should share memory/history
- intermediate state should not become a public service contract
- retrying the whole run is acceptable

Use independent PURISTA agents when:

- each step has a business owner
- each step needs separate retry or dead-letter behavior
- each step should be observable as its own queue-backed capability
- a child result should be reusable by other services
- sandbox isolation matters because one step can mutate or execute code
- parallel execution should not contend on one harness session

## Real-world pattern: research report

1. A `researchReport` PURISTA agent receives the request and creates a run.
2. It invokes independent `sourceDiscovery`, `evidenceExtraction`, and `riskReview` PURISTA agents in parallel.
3. Each child agent uses its own queue and sandbox because each may call different tools or providers.
4. The parent agent validates child outputs and runs deterministic policy checks.
5. The parent invokes one harness workflow for final writing and self-review inside one shared sandbox.
6. The generated command returns a final report or a queued `jobId`, depending on response mode.

This combination is the full power of the stack: harness workflows for tightly coupled AI reasoning, PURISTA orchestration for independent service capabilities.

## Checklist

- choose harness workflow only when shared session/sandbox is intentional
- choose PURISTA child agents when operational independence matters
- keep every boundary schema explicit
- keep deterministic writes behind PURISTA commands
- keep model/provider/sandbox/runtime bindings outside service definitions

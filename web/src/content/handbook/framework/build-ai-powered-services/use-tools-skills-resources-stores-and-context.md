---
title: Use tools, skills, and service resources
description: Keep portable tools in Harness and define service-owned host tools for trusted business operations.
order: 395
---

A portable tool can run in any Harness host. It receives Harness execution
context and portable input only:

```ts title="Define a portable tool"
import { defineTool } from '@purista/harness'
import { z } from 'zod'

export const calculateRiskTool = defineTool('calculateRisk', {
  description: 'Calculate a risk score from supplied values',
  input: z.object({ probability: z.number(), impact: z.number() }),
  output: z.object({ score: z.number() }),
  async handler(_context, input) {
    return { score: input.probability * input.impact }
  },
})
```

Use a host tool when the model must call a PURISTA command, stream, queue,
agent, workflow, event, or service resource. Define it on the service builder:

```ts title="Define a service-owned host tool"
export const getIncidentSnapshotTool = supportV1ServiceBuilder
  .defineTool('getIncidentSnapshot', {
    description: 'Read the current incident snapshot',
    input: getIncidentSnapshotInputSchema,
    output: incidentSnapshotSchema,
  })
  .canInvoke(
    'Incident',
    '1',
    'getIncidentSnapshot',
    incidentSnapshotSchema,
    getIncidentSnapshotInputSchema,
  )
  .setHandler(async function (context, input) {
    return context.service.Incident['1'].getIncidentSnapshot(input, {})
  })
```

[`ServiceBuilder.defineTool(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#definetool)
starts the typed service-owned definition. Capability methods add only the
clients the handler may use. `setHandler(...)` returns the completed tool
definition; add that definition to an agent or workflow tool list directly.

| Host-tool builder member | Adds to the handler context |
| --- | --- |
| [`canInvoke(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#caninvoke) | A command client under `context.service`. |
| [`canConsumeStream(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#canconsumestream) | A stream client under `context.stream`. Consume it fully or cancel it. |
| [`canEnqueue(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#canenqueue) | A queue client under `context.queue`. Acceptance does not mean completion. |
| [`canEmit(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#canemit) | Schema-validated event publication through `context.emit`. |
| [`canInvokeAgent(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#caninvokeagent) | A mounted agent client under `context.agent`. |
| [`canInvokeWorkflow(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#caninvokeworkflow) | A mounted workflow client under `context.workflow`. |
| [`setHandler(...)`](/handbook/api/classes/_purista_core.HarnessHostToolBuilder/#sethandler) | Installs the service-owned implementation and returns the completed tool definition. |

The host-tool context also carries trusted `tenantId`, `principalId`,
`traceId`, `correlationId`, and declared service resources. A model cannot
supply or replace these values. The called business capability must still
check authorization and invariants; a tool schema validates only the
model-produced input.

An agent lists its portable and host tools in its own `tools` array. Skills and
MCP servers are also direct, transport-free definitions:

```ts title="Define a colocated Skill and an MCP tool"
import { defineMcpServer, defineSkill } from '@purista/harness'
import { z } from 'zod'

export const incidentReviewSkill = defineSkill('incident-review', {
  directory: new URL('./', import.meta.url),
  runtimes: ['node'],
})

export const issueTrackerMcp = defineMcpServer('issueTracker', {
  tools: {
    lookupIssue: {
      remoteName: 'lookup_issue',
      description: 'Look up one issue',
      input: z.string(),
      output: z.string(),
    },
  },
})
```

Reference the Skill with `skills: [incidentReviewSkill]` on an agent. Reference
the MCP tool with `tools: [issueTrackerMcp.tools.lookupIssue]` on an agent or
workflow. A generated tool, Skill, or MCP server file stays unused until that
edit is made. A Skill declares only its directory and logical runtime
requirements. An MCP definition declares model-facing tools and exact remote
names; connection URL, token, command, and environment belong in runtime
instance configuration.

Use Harness storage, memory, workspace, and sandbox for AI runtime state. Use a
PURISTA StateStore for application key-value state and a database resource for
transactional business records.

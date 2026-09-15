---
title: Create a portable Harness definition
description: Declare reusable agents and workflows once, then bind models and runtime adapters at the application boundary.
order: 315
---

Portable definitions contain schemas, instructions, direct definition
references, and capability requirements. They do not contain provider
credentials, queues, or live Harness adapters. A native tool may close over a
narrow application client supplied at composition time.

## Define reusable capabilities

```ts title="src/harness/support.ts"
import { defineAgent, defineHarness, defineTool } from '@purista/harness'
import { z } from 'zod'

const accountInput = z.strictObject({ accountId: z.string().min(1) })
const accountOutput = z.strictObject({ accountId: z.string(), status: z.string() })

export const readAccount = defineTool('readAccount', {
  description: 'Read an account the current caller may access.',
  input: accountInput,
  output: accountOutput,
  handler: async (_context, input) => accountRepository.readAuthorized(input.accountId),
})

export const answerAccountQuestion = defineAgent('answerAccountQuestion', {
  model: 'answering',
  input: z.strictObject({ question: z.string().min(1), accountId: z.string().min(1) }),
  output: z.strictObject({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  tools: [readAccount],
  instructions: 'Use readAccount for account facts. Do not invent account data.',
})

export const supportHarness = defineHarness({ name: 'support' })
  .addAgent(answerAccountQuestion)
```
The definition factories create immutable, reusable values:

| Factory | Owns | Runtime binding |
| --- | --- | --- |
| `defineTool(id, definition)` | Input/output schemas and a typed handler | Narrow dependencies and authorization supplied by the application |
| `defineSkill(id, definition)` | Reviewed instructions and a mounted directory | Skill directory and any explicitly enabled tools |
| `defineMcpServer(id, definition)` | Tool schemas and remote tool names | HTTP or stdio transport at instance creation |
| `defineAgent(id, definition)` | One bounded model and tool loop | Model aliases, storage, memory, sandbox, and telemetry |
| `defineWorkflow(id, definition)` | Deterministic orchestration and durable steps | Agents, storage, workspace, and external-wait adapters |

Use `.addAgent(agent)` and `.addWorkflow(workflow)` to compose roots. There
is no terminal builder step. Duplicate IDs and unsatisfied
requirements fail when the definition is composed or bound.

## Bind the standalone runtime

```ts title="src/createSupportHarness.ts"
import { openai } from '@purista/harness-openai'
import { supportHarness } from './harness/support.js'

export async function createSupportHarness(apiKey: string) {
	return supportHarness.getInstance({
		models: { answering: { provider: openai({ apiKey }), model: 'gpt-5-mini' } },
	})
}
```
`getInstance(...)` supplies the concrete model, storage, concurrency, sandbox,
memory, workspace, queue, logger, and telemetry bindings required by the
composed graph. Bind only capabilities the selected adapters implement. The
application still owns authentication, business authorization, and external
transport.

Invoke through a stable session identity:

```ts title="Portable Definitions And Host Bindings example 5"
const session = await harness.getSession('support-case-42', {
  identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
})
const outcome = await session.agents.answerAccountQuestion.run({
  question: 'Is this account active?',
  accountId: 'account-1',
})
if (outcome.status === 'interrupted') {
  // Authenticate and authorize the application decision before resuming.
}
await harness.close()
```
See [HarnessInstance.getSession](/handbook/api/interfaces/_purista_harness.HarnessInstance/#getsession),
[HarnessInstance.close](/handbook/api/interfaces/_purista_harness.HarnessInstance/#close),
and the session lifecycle guidance for release and restart behavior.

## Reuse catalogs and host bindings

A catalog groups trusted definition references for reuse. It does not load code
dynamically or grant authority. Add the catalog to a composition root, then
bind the root's requirements at `getInstance(...)`.

A PURISTA hosted integration keeps the same standalone definitions and binds
service-owned operations at the composition root. Use the service-owned layout
only in that hosted example; standalone definitions remain framework-free.
Continue with [mount Harness and bind runtime](/handbook/framework/build-ai-powered-services/mount-harness-and-bind-runtime/).

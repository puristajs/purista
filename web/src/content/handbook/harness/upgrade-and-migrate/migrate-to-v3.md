---
title: Rewrite a Harness v3 application for v4
description: Replace fluent Harness builders with definition factories, additive composition, explicit runtime bindings, typed outcomes, and safe lifecycle handling.
order: 1310
---

Treat this as a source rewrite. Remove the v3 builder and module APIs; do not
add aliases or a compatibility wrapper.

## 1. Replace registration with definitions

Define each reusable capability in a focused module, then compose it by adding
definitions in dependency order:

~~~ts title="src/harness/support/definition.ts"
import {
  defineAgent,
  defineCatalog,
  defineHarness,
  defineMcpServer,
  defineSkill,
  defineTool,
  defineWorkflow,
} from '@purista/harness'

export const lookup = defineTool('lookup', {
  description: 'Search approved support records.',
  input: lookupInput,
  output: lookupOutput,
  handler: async (context, input) => search(input, context.signal),
})

export const supportSkill = defineSkill('support', {
  directory: new URL('./skills/support/', import.meta.url),
  runtimes: ['node'],
})

export const supportMcp = defineMcpServer('support-mcp', {
  tools: {
    search: {
      remoteName: 'search_support',
      description: 'Search approved support records.',
      input: searchInput,
      output: searchOutput,
    },
  },
})

export const agent = defineAgent('agent', {
  model: 'assistant',
  instructions: 'Answer with evidence from the available support tools.',
  tools: [lookup, supportMcp.tools.search],
  skills: [supportSkill],
})

export const workflow = defineWorkflow('workflow', {
  input: agent.contract.input,
  output: agent.contract.output,
  agents: [agent],
  handler: async context => context.agents.agent.run(context.input, {
    callId: 'support-agent',
  }),
})

export const catalog = defineCatalog('support', {
  tools: [lookup],
  skills: [supportSkill],
  mcpServers: [supportMcp],
  agents: [agent],
  workflows: [workflow],
})

export const definition = defineHarness({ name: 'support' }).use(catalog)
~~~

Declare model aliases in definitions before binding their runtime providers.
Use defineCatalog for a cohesive batch and addAgent/addWorkflow for executable roots. A Harness
definition imports a catalog with use; duplicate IDs are rejected.

A portable tool receives declared Harness facilities and its abort signal. A
PURISTA service resource belongs in a Framework-owned host tool, then the host
tool is mounted into the service. Do not read undeclared resources or identity
fields from portable tool context.

## 2. Create an instance with explicit bindings

~~~ts title="src/runtime/createHarness.ts"
const instance = await definition.getInstance({
  models: { assistant: assistantModel },
  mcp: {
    'support-mcp': {
      transport: 'http',
      url: 'https://support.example.com/mcp',
    },
  },
})
~~~

Harness v4 reserves no model alias and has no singular model shortcut. Every
agent declares a user-chosen alias, and every runtime binding appears under the
exact matching `models` key. Runtime bindings contain provider instances and do
not repeat definition capabilities. Bind only the facilities the graph needs.
Here, the selected MCP tool also makes the `support-mcp` transport binding
required.

## 3. Update invocation and outcomes

Use the target invoker with a stable callId:

~~~ts title="src/handlers/runSupport.ts"
const session = await instance.getSession(sessionId, { identity })
try {
  const outcome = await session.agents.agent.run(input, {
    callId: 'support-request',
  })
  if (outcome.status === 'interrupted') return resumeOrPersist(outcome)
  if (outcome.status !== 'completed') throw new Error('Support run did not complete')
  return outcome.output
} finally {
  await session.release()
}
~~~

Use `.stream(input, { callId })` for execution events. It returns the stream
object, so retain it and call `await events.cancel(reason)` when the request is
cancelled. `release()` returns a retained session to the runtime. Use
`destroy()` only when the application intentionally deletes the session and its
records.

~~~ts title="src/handlers/streamSupport.ts"
const events = session.agents.agent.stream(input, { callId: 'support-stream' })
request.signal.addEventListener('abort', () => { void events.cancel('request cancelled') })
for await (const event of events) writeEvent(event)
const outcome = await events.result
if (outcome.status === 'interrupted') persistContinuation(outcome.interrupt)
~~~

## 4. Move tools, skills, MCP, and approvals

Tools and skills are definition-owned. A skill describes trusted instructions
and location; it does not grant tools. An MCP definition declares logical tools
with their exact remote names. Supply transport, authentication, commands,
environment, and URLs only through runtime bindings. Governance decides whether
an invocation is allowed, denied, audited, or interrupted for approval. Handle
approval as a typed outcome and resume with the stored continuation; never infer
approval from a boolean field or expose reviewer content in telemetry.

For an AI SDK UI stream, the boundary parser supplies the typed continuation;
pass it unchanged to the next addressed stream invocation:

~~~ts title="src/http/streamSupport.ts"
const request = await parseHarnessUIMessageRequest(payload, { sessionId: trustedSessionId })
const target = context.agent.Support['1'].agent
const events = request.resume === undefined
  ? await target.stream(input, { sessionId: request.sessionId })
  : await target.resume(request.resume).stream({ sessionId: request.sessionId })
~~~

## 5. Replace split state and adapter contracts

Select v4 storage for sessions, run history, leases, durable steps, and waits.
Select memory for retrieval or conversation memory, workspace for durable files,
and artifact storage for published artifacts. Recreate indexes when dimensions
or embedding models change. Do not point v4 at an old runtime database unless
the adapter explicitly documents that schema.

For sandbox and MCP changes, verify owner isolation, allowed capabilities,
network and credential policy, remote names, transport, startup, cancellation,
and cleanup. Test each selected adapter contract separately.

## 6. Verify

Run the application typecheck, deterministic FakeModelProvider tests, adapter
contract tests, and bounded integration tests. Exercise run, stream, cancel,
release, destroy, approval interruption/resume, durable restart, and redaction.
After stopping new work and releasing retained sessions, close the Harness
runtime with `await instance.close()`, then close application-owned adapters.
Use evaluations for live-model quality. Keep a tested rollback deployment and
data snapshot until the new runtime is accepted.

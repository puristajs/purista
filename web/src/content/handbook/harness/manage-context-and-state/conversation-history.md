---
title: Bound conversation history
description: Retain complete turns deliberately and make direct delivery retries safe.
order: 610
---

History retention is off unless you configure it. Use it when a support session
must remain useful without retaining an unbounded transcript. It retains the
newest complete turns by persisted UTF-8 bytes, not by an approximate token
count. The storage adapter must implement atomic `replaceMessages`; otherwise
build fails rather than performing a non-atomic trim.

```ts title="src/harness/support.ts"
import { defineHarness, inMemoryHarnessStorage, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

export const supportHarness = defineHarness({ name: 'support' })
	.sandbox(inMemorySandbox())
	.storage(inMemoryHarnessStorage())
	.defaults({ historyRetention: { maxTurns: 50, maxBytes: 256_000 } })
	.models({
		local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
	})
	.agent('support', {
		model: 'local',
		input: z.object({ question: z.string() }),
		output: z.object({ answer: z.string() }),
		instructions: 'Answer the support question.',
		handler: async ({ input }) => ({ answer: `Received: ${input.question}` }),
	})
	.build()
```

The local alias is intentionally a type-correct `ModelProvider` shape with no
generation methods: the custom `handler` produces the result, so this page can
verify retention without credentials or a live model. Replace it with a real
provider alias before removing the handler or adding a default-loop agent.

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named application-local composition root. | Its name identifies diagnostics only; it does not partition stored session history by tenant. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | An ephemeral files-and-search sandbox for this complete local Harness. | It is sufficient because the handler neither reads files nor runs commands. It is not persistent or a tenant-isolation boundary. |
| [`inMemoryHarnessStorage()`](/handbook/api/functions/_purista_harness.inMemoryHarnessStorage/) | Core's in-process storage implementation, including atomic message replacement. | Use for this one-process proof or deterministic tests. It is lost on restart and cannot coordinate several application instances. |
| [`.storage(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#storage) | Registers the one Harness storage adapter that owns sessions and transcript replacement. | A second registration is invalid. Choose a durable adapter before history must survive restart or a request can be handled by a different worker. |
| `historyRetention` | A run-wide `{ maxTurns, maxBytes }` policy; both positive integer bounds are required together. | It retains complete newest turns, not model tokens. An oversized newest turn fails the call instead of leaving an incomplete tool exchange; set a model `historyWindow` separately when you only want to reduce provider context. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) and `handler` | Registers a schema-validated agent. A custom handler receives validated `input` and returns data validated against `output`; it owns model/tool execution when present. | Keep this handler pure for a local retention check. Default-loop-only features such as built-in model/tool iterations do not run inside a custom handler. |

If the newest complete turn alone exceeds the byte limit, the call fails rather
than storing a partial tool exchange. Choose a transient model-context window
separately from durable retention; provider context limits are not retention
policy.

`inMemoryHarnessStorage()` is suitable for the local verification above because
it implements atomic replacement. Select a durable storage adapter before
deploying; retention does not make an in-memory store survive a restart.

| Call or setting | Runtime effect | Use it when |
| --- | --- | --- |
| [`.storage(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#storage) | Supplies persisted session state and must be configured only once. | Use in-memory storage for this local proof; install and wire a durable adapter before restart or multi-instance operation matters. |
| [`.defaults(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#defaults) | Sets run-wide history retention. | Put `historyRetention` here when every session shares a policy; use a dedicated composition root if tenants need distinct policies. |
| [`historyRetention.maxTurns`](/handbook/api/interfaces/_purista_harness.SessionHistoryRetentionPolicy/#maxturns) | Retains newest complete turns up to this count. | Set a count that still supports the conversation task. It does not estimate provider tokens. |
| [`historyRetention.maxBytes`](/handbook/api/interfaces/_purista_harness.SessionHistoryRetentionPolicy/#maxbytes) | Bounds persisted UTF-8 serialized history. | Set it to prevent unbounded storage; a single oversized newest turn fails instead of being split. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the `local` alias before `support` selects it. | The no-operation provider is only valid while the custom handler owns all generation. A default loop requires a provider implementation for the selected capability. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates storage, retention defaults, aliases, and registered agent references before returning the runtime. | Invalid retention bounds or storage without required atomic replacement fail at composition time rather than silently trimming a transcript. |

For at-least-once direct agent delivery, use the application transport message
ID. The key makes a retry of the same successful request safe at the Harness
boundary:

```ts title="src/transport/handleSupportMessage.ts"
import { supportHarness } from '../harness/support.js'

const delivery = {
	id: 'delivery-42',
	input: { question: 'Where can I download my invoice?' },
}
const session = await supportHarness.getSession('support-case:42')

const result = await session.agents.support.run(delivery.input, {
	idempotencyKey: delivery.id,
})

console.log(result)
```

| Invocation option | Purpose | Boundary |
| --- | --- | --- |
| [`idempotencyKey`](/handbook/api/interfaces/_purista_harness.InvokeOptions/#idempotencykey) | A stable caller-owned key for one at-least-once delivery. | The key applies to the same session, agent, and input. Repeating a successful call returns the recorded Harness result; a changed input with the same key is rejected instead of silently replaying different work. |
| [`run(input, options)`](/handbook/api/interfaces/_purista_harness.AgentInvoker/#run) | Runs one non-streaming agent call and returns the validated output. | Use the stream API for event/cancellation assertions. A successful run replay does not make an external database or tool mutation exactly once. |

For the same session, agent, key, and input, a successful retry returns the
recorded result without another provider call or transcript write. It does not
make an external tool write exactly once. Test replay, changed input with the
same key, a turn over the limit, storage without `replaceMessages`, and content
redaction in telemetry.

---
title: Publish results and react through subscriptions
description: Publish queued attached-agent completion deliberately and react through ordinary PURISTA subscriptions without confusing result delivery with atomic business completion.
order: 397
---

Use a queue result policy when work is accepted now and consumers need a later
completion signal. The result policy belongs to the generated agent queue; a
normal [subscription](/handbook/framework/build-services/subscriptions/) then
reacts to its published event. Configure it through
[`setResponseMode(mode, options?)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setresponsemode):
the selected response mode changes the generated command into queue acceptance,
while `resultPolicy` chooses what happens after worker completion.

Current Core output-schema validation conflicts with the acceptance metadata
returned by `setResponseMode(...)`. Treat the policy guidance on this page as
the intended completion contract; do not deploy a response-mode attached agent
with an output schema until the implementation is repaired and an integration
test proves the generated command path.

## Choose a result policy

| Result policy | Use when | Consequence |
| --- | --- | --- |
| `none` | The caller has an independent completion mechanism. | No generated completion side effect. |
| `event` | A service reacts asynchronously. | The selected result events are emitted through the queue result path. |
| `state` | A status endpoint or application process needs retained metadata. | Configure the required queue result state at composition. |
| `state-and-event` | Both retained status and reactive event handling matter. | You operate both persistence and delivery paths. |

`status` response mode defaults to `state`; `event` to `event`; and `stream` to
`state-and-event`. `accepted` needs an explicit policy. Default completion event
names are `{service}.{agent}.completed` and `.failed` when a policy emits them;
custom names belong in `setResponseMode` options. The generated attached-agent
worker does not publish intermediate model-token progress as queue progress, so
do not present `progressEventName` as a live model stream.

`delivery: 'required'` makes result publication part of queue completion: an
unsuccessful required result delivery can fail completion and trigger normal
queue retry behavior. It still does not atomically join model/tool side effects,
state persistence, and EventBridge publication. Design the downstream
subscription to be idempotent.

For every response-mode option—URLs, retention, event-ID strategy, cancellation
and dead-letter names, and the distinction between connected streaming and later
delivery—see [choose command, stream, or queued execution](/handbook/framework/build-ai-powered-services/choose-command-stream-or-queued-execution/#configure-the-completion-side-effect).

Next: [coordinate workflows and human review](/handbook/framework/build-ai-powered-services/coordinate-workflows-and-human-review/) or [test the queue and subscription flow deterministically](/handbook/framework/build-ai-powered-services/test-an-ai-powered-service-deterministically/).

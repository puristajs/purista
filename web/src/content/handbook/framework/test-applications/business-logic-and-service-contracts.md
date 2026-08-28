---
title: Test business logic and service contracts
description: Use generated tests and core harnesses to prove schemas, guards, handler results, and emitted events.
order: 910
---

Test the smallest boundary that can prove the behavior. A command test can
invoke the real builder function with a deterministic context, assert its
schema-valid result and side effects, and avoid starting a broker or database.
Use the deterministic service runtime when the Framework lifecycle matters;
use a separate adapter integration test for connection, credentials, and
delivery guarantees.

## Start from the generated command test

The CLI places a test beside the builder. Keep it focused on a concrete
business outcome—in this example, a health command returns the received ping
without requiring a running EventBridge process.

```ts title="src/service/ping/v1/command/ping/ping.test.ts"
import {
  createCommandContextMock,
  getEventBridgeMock,
  getLoggerMock,
  safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { describe, expect, test } from 'vitest'
import { pingV1Service } from '../../pingV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'

describe('Ping v1 / ping', () => {
  test('returns the validated pong response', async () => {
    const sandbox = createSandbox()
    let service: Awaited<ReturnType<typeof pingV1Service.getInstance>> | undefined
    try {
      service = await pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
        logger: getLoggerMock(sandbox).mock,
      })
      const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)
      const payload = { ping: 'ready' }
      const parameter = {}
      const { context } = createCommandContextMock(pingCommandBuilder, {
        payload,
        parameter,
        sandbox,
      })

      await expect(ping(context, payload, parameter)).resolves.toEqual({ pong: 'ready' })
    } finally {
      await service?.destroy()
      sandbox.restore()
    }
  })
})
```

[`safeBind`](/handbook/api/functions/_purista_core.safeBind/) supplies the
service `this` context used by a normal runtime invocation. The
[`getCommandFunction`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getcommandfunction)
wrapper validates payload, parameters, and output, then runs the builder's
before guards and handler. It does not run input/output transforms, after
guards, response mapping, definition registration, or event-transport
delivery.

[`createCommandContextMock`](/handbook/api/functions/_purista_core.createCommandContextMock/)
infers a typed context from the builder declarations. Its `input` requires
`payload` and `parameter`; `sandbox`, declared `resources`, and a `message`
override for those two message fields are optional. It returns `context` (also
available as `mock`) and stubs for events, invoked services, queues, state,
config, secrets, metrics, and resources. Unconfigured store calls reject,
which prevents a test from accidentally pretending a missing dependency
exists.

| Call | Required input | Optional input and default | Runtime effect and failure boundary |
| --- | --- | --- | --- |
| [`getCommandFunction({ beforeGuards? })`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getcommandfunction) | None | `beforeGuards` is a partial, named override merged over the guards declared by the builder. Omit it to exercise the declared guards unchanged. | Throws when no command function was declared. It is the validated direct-handler boundary, not the full command lifecycle. |
| [`createCommandContextMock(builder, input)`](/handbook/api/functions/_purista_core.createCommandContextMock/) | The same command builder, `payload`, and `parameter` | `sandbox`, `resources`, and `message` (payload/parameter only) | Produces type-aligned proxies from the builder. Missing store stubs reject until the test configures them. |
| [`safeBind(function, service)`](/handbook/api/functions/_purista_core.safeBind/) | A service-bound function and its service instance | None | Preserves the handler's declared argument types while supplying `this`; it does not start, register, or destroy the service. |

## Choose the boundary before writing an assertion

| Test level | Start with | What it proves | What it does not prove |
| --- | --- | --- | --- |
| Direct, validated handler | `safeBind(builder.getCommandFunction(), service)` with `createCommandContextMock(...)` | Input/parameter/output schema validation, before guards, handler decisions, and declared-context interactions. | Transforms, after guards, response mapping, registration, success-event delivery, and adapter behavior. |
| Deterministic Framework runtime | [`createCommandTestHarness(serviceBuilder, commandBuilder, options?)`](/handbook/api/functions/_purista_core.createCommandTestHarness/) | One command definition registered on a real service instance and executed with `service.executeCommand`. | `service.start()`, HTTP projection, EventBridge delivery, or behavior of a supplied adapter. |
| Selected real adapter | A protected adapter integration test | Credentials, a real transport round trip, and the specific provider capability under test. | Every handler branch or production rollout condition; retain the faster tests above. |

The runtime helper accepts the service instance configuration plus optional
`eventBridge` and `queueBridge`. With no `eventBridge`, it creates an owned
EventBridge mock. Its `run({ payload, parameter })` returns the Framework
response as `message` and a typed `result` only for a successful command. Call
`destroy()` in `finally`: it always destroys the service and destroys only the
bridge mock it created. A supplied bridge remains owned by the test.

## Add the behavior the simple example does not need

| Requirement | Deterministic assertion |
| --- | --- |
| Output contract | Valid input returns the expected schema-shaped result; invalid input is rejected at the schema boundary. |
| Event emission | Assert the expected `stubs.emit` call and its schema-valid payload. |
| Authorization | Supply an allowed principal/tenant and a rejected one; assert the forbidden path has no side effect. |
| Resource access | Inject a narrow fake resource and assert calls/arguments rather than a database record. |
| Store lookup | Stub `context.configs`, `context.secrets`, or `context.states` with a value, missing value, and safe failure. |
| Service/queue call | Assert the declared invocation or enqueue contract; do not assert a live broker here. |

For streams, use `createStreamTestHarness(...)` to assert chunks and the final
payload. For subscriptions, use `createSubscriptionContextMock(...)`; for queue
workers, use `createQueueWorkerTestHarness(...)`. Each helper proves the
deterministic Framework boundary, not an external adapter's runtime semantics.

## Keep model-quality tests separate

For an AI-powered service, deterministic Framework tests prove that your queue,
tool binding, authorization, and output-handling flow is wired correctly. They
do not prove a live model's answer is factual or useful. Put prompt/output
quality measurement in the Harness [evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/)
path and keep fixtures synthetic.

Next: test [message flows, queues, and retries](/handbook/framework/test-applications/message-flows-queues-and-retries/).

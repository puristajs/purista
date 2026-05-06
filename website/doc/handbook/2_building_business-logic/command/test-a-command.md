---
title: Test a Command
description: Test command handlers with typed context mocks or run them through the real PURISTA runtime.
order: 202040
---

# Test a command

The first testing decision is simple:

- Use `createCommandContextMock(...)` when you want to test the handler logic directly.
- Use `createCommandTestHarness(...)` when you want to test validation, guards, emits, and runtime wiring together.

That maps to the normal PURISTA flow:

1. define with the builder
2. implement the handler
3. test the handler in isolation
4. test the runtime only when the runtime behavior matters

## Handler test

This is the normal starting point.

```ts
import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { PingV1PingInputParameter, PingV1PingInputPayload } from './types.js'

describe('service Ping version 1 - command ping', () => {
  let sandbox = createSandbox()

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('returns the pong response', async () => {
    const service = await pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

    const payload: PingV1PingInputPayload = { ping: 'test' }
    const parameter: PingV1PingInputParameter = {}

    const { context } = createCommandContextMock(pingCommandBuilder, {
      payload,
      parameter,
      sandbox,
      resources: { ...service.resources },
    })

    const result = await ping(context, payload, parameter)

    expect(result).toStrictEqual({ pong: 'test' })
  })
})
```

Use this level when you want to verify:

- business logic
- service or stream invokes
- emitted events
- resource usage
- branching logic

## Mock invokes and emitted events

Only dependencies declared in the builder are available in the mock.

```ts
const { context, stubs } = createCommandContextMock(signUpCommandBuilder, {
  payload: { email: 'user@example.com' },
  parameter: {},
  sandbox,
})

stubs.service.UserService['1'].findUser.resolves({ exists: false })

const result = await signUp(context, { email: 'user@example.com' }, {})

expect(stubs.emit.userSignedUp.calledOnce).toBe(true)
```

That is the main advantage of the helper: the test stays aligned with the builder contract.

## Runtime test

Use the harness when you care about the real PURISTA runtime path.

```ts
import { createCommandTestHarness } from '@purista/core'

const harness = await createCommandTestHarness(userV1Service, signUpCommandBuilder)

try {
  const result = await harness.run({
    payload: { email: 'user@example.com' },
    parameter: {},
  })

  expect(result.result).toStrictEqual({ accepted: true })
} finally {
  await harness.destroy()
}
```

Use this level when you want to verify:

- schema validation
- before and after guards
- final runtime result shape
- event bridge wiring

## Which one should you choose?

- “I am testing handler logic.”
  Use `createCommandContextMock(...)`.
- “I am testing validation, guards, or runtime execution.”
  Use `createCommandTestHarness(...)`.

## Related guides

- [The command builder](./the-command-builder.md)
- [Service builder](../service/the-service-builder.md)

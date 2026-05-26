---
title: Test a Subscription
description: Test subscription handlers with typed subscription context mocks and focus on the handler logic first.
order: 203020
---

# Test a subscription

Subscriptions are usually tested at the handler level.

That means:

- bind the subscription to a real service instance
- create a typed subscription context mock
- call the handler directly

This is usually enough because subscriptions are event-driven adapters around handler logic, not request/response endpoints.

## Typical subscription test

```ts
import {
  createSubscriptionContextMock,
  getCommandSuccessMessageMock,
  getEventBridgeMock,
  getLoggerMock,
  safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { logSubscriptionBuilder } from './logSubscriptionBuilder.js'
import type { PingV1LogInputPayload } from './types.js'

describe('service Ping version 1 - subscription log', () => {
  let sandbox = createSandbox()

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('handles the incoming event', async () => {
    const pingService = await pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const log = safeBind(logSubscriptionBuilder.getSubscriptionFunction(), service)

    const payload: PingV1LogInputPayload = {
      pong: 'test',
    }

    const message = getCommandSuccessMessageMock(payload)

    const { context } = createSubscriptionContextMock(logSubscriptionBuilder, {
      message,
      sandbox,
      resources: { ...service.resources },
    })

    const result = await log(context, payload, {})

    expect(result).toBeUndefined()
  })
})
```

## Mock invokes and emits

The subscription mock follows the same idea as the command mock: only declared dependencies are available.

```ts
const { context, stubs } = createSubscriptionContextMock(auditSubscriptionBuilder, {
  message,
  sandbox,
})

stubs.service.AuditService['1'].writeAudit.resolves({ ok: true })

await auditSubscription(context, payload, {})

expect(stubs.service.AuditService['1'].writeAudit.calledOnce).toBe(true)
expect(stubs.emit.auditWritten.calledOnce).toBe(true)
```

## When is this enough?

Use `createSubscriptionContextMock(...)` when you want to verify:

- event handling logic
- resource usage
- emits
- service invokes
- state/config/secret access

If your real concern is the command or stream that emits the source event, test that workload at its own level instead.

## Related guides

- [The subscription builder](./the-subscription-builder.md)
- [Test a command](../command/test-a-command.md)

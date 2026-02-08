---
title: Unit Test a Subscription
description: How to unit test a subscription with PURISTA typescript helpers
order: 203020
---

# Unit test a subscription

Subscriptions can be tested as plain functions with typed test helpers.

## Minimal example

```typescript
import { getCommandMessageMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { myV1Service } from '../../myV1Service'
import { mySubscriptionBuilder } from './mySubscriptionBuilder'

describe('service My version 1 - subscription mySubscription', () => {
  let sandbox = createSandbox()

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('executes subscription with validated context', async () => {
    const service = await myV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const subscriptionFn = safeBind(mySubscriptionBuilder.getSubscriptionFunction(), service)

    const message = getCommandMessageMock({
      payload: {
        payload: { id: 'user_1' },
        parameter: {},
      },
    })

    const context = mySubscriptionBuilder.getSubscriptionContextMock({
      message,
      sandbox,
      resources: service.resources,
    })

    const result = await subscriptionFn(context.mock, { id: 'user_1' }, {})

    expect(result).toStrictEqual({ done: true })
  })
})
```

## Mocking invoke and emit

If your subscription uses `canInvoke` or `canEmit`, the context mock includes typed stubs:

```typescript
const context = mySubscriptionBuilder.getSubscriptionContextMock({ message, sandbox })

context.stubs.service.AuditService['1'].writeAudit.resolves({ ok: true })
context.stubs.emit.auditWritten.returns(undefined)
```

## `getSubscriptionFunction` vs `getSubscriptionFunctionPlain`

- `getSubscriptionFunction()`:
  includes validation and guard execution.
- `getSubscriptionFunctionPlain()`:
  raw function only (no validation/guards), useful for focused unit tests.

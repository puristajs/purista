---
title: Unit Test
description: Test PURISTA services, commands, and subscriptions with built-in test harnesses.
order: 201030
---

# Unit Test a Service

A PURISTA service is a container for commands and subscriptions — it has no business logic of its own. The generated service test verifies configuration validity:

```typescript [userV1Service.test.ts]
import { userV1Service as service } from './userV1Service.js'

describe('service user version 1', () => {
  it('has valid setup', () => {
    service.testServiceSetup()
  })
})
```

The real testing happens at the command and subscription level using PURISTA's test harnesses.

## Testing commands

Use `createCommandTestHarness` to test business logic in isolation:

```typescript [userSignUp.test.ts]
import { createCommandTestHarness } from '@purista/core'
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'
import { userSignUpCommandBuilder } from './userSignUpCommandBuilder.js'

describe('userSignUp command', () => {
  it('creates a user and returns an id', async () => {
    const harness = await createCommandTestHarness(userV1ServiceBuilder, userSignUpCommandBuilder, {
      resources: {
        db: { createUser: async () => 'user-123' },
      },
    })

    const response = await harness.run({
      payload: {
        email: 'test@example.com',
        password: 'secure-password',
      },
      parameter: {},
    })

    expect(response.userId).toBe('user-123')
  })

  it('rejects invalid email', async () => {
    const harness = await createCommandTestHarness(userV1ServiceBuilder, userSignUpCommandBuilder)

    await expect(
      harness.run({ payload: { email: 'not-an-email', password: 'short' }, parameter: {} })
    ).rejects.toThrow()
  })
})
```

The harness:

- Validates input against the payload schema
- Injects mocked resources
- Returns the typed output
- Captures emitted events for assertion

## Testing subscriptions

Use `createSubscriptionContextMock` from `@purista/core` to test event reactions:

```typescript [sendWelcomeEmail.test.ts]
import { createSubscriptionContextMock } from '@purista/core'
import { sendWelcomeEmailSubscriptionBuilder } from './sendWelcomeEmailSubscriptionBuilder.js'

describe('sendWelcomeEmail subscription', () => {
  it('sends email on new user event', async () => {
    // Use createSubscriptionContextMock from @purista/core for subscription testing
    const { context, stubs } = createSubscriptionContextMock(sendWelcomeEmailSubscriptionBuilder)

    const payload = { userId: 'user-123' }
    const parameter = {}

    // call the handler directly via the subscription builder
    await sendWelcomeEmailSubscriptionBuilder.getSubscriptionFunction()(context, payload, parameter)

    expect(stubs.logger.info.calledOnce).toBeTruthy()
  })
})
```

## Testing with emitted events

Assert that commands emit the expected events:

```typescript
it('emits newUserRegistered event', async () => {
  const harness = await createCommandTestHarness(userV1ServiceBuilder, userSignUpCommandBuilder)

  await harness.run({ payload: { email: 'test@example.com', password: 'secure' }, parameter: {} })

  expect(harness.stubs.eventBridge.emitMessage.callCount).toBe(1)
  expect(harness.stubs.eventBridge.emitMessage.args[0][0].eventName).toBe('newUserRegistered')
})
```

## Testing services with custom classes

If you extend the service class for custom behavior (like database connection management), test the custom class separately:

```typescript [customService.test.ts]
import { CustomUserService } from './CustomUserService.js'

describe('CustomUserService', () => {
  it('connects to database on start', async () => {
    const service = new CustomUserService(config)
    await service.start()
    expect(service.dbConnection.isOpen).toBe(true)
  })
})
```

::: tip
Do not extend the generated service test file. Create a separate test file for custom class logic to avoid conflicts with CLI updates.
:::

## Test strategy summary

| Layer | Tool | What to test |
|---|---|---|
| Service | `service.testServiceSetup()` | Configuration validity |
| Command | `createCommandTestHarness()` | Business logic, schema validation, emitted events |
| Subscription | `createSubscriptionContextMock()` | Event reaction, side effects |
| Queue | `createQueueWorkerTestHarness()` | Background job logic |
| Stream | `createStreamTestHarness()` | Incremental output frames |

Next: [Command Builder](../command/the-command-builder.md) for adding testable business logic.

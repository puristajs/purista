---
title: Unit Test the Service
description: How to unit test a PURISTA service
order: 201030
---

# Unit test the service

A service itself does not contain any logic which needs to be tested. It a container/group for commands and subscriptions.

If you use the CLI to generate a service, a simple unit test is generated. This test does not need any changes and only tests for valid configurations.

If you use an custom domain class, you might need to test this class. But be aware, that a service class __should not__ contain business logic.  
Use custom classes to provide something like database connections.

The generated test file might look like this:

```typescript
import { userV1Service as service } from './userV1Service.js'

describe('service user version 1', () => {
  it('has valid commands', () => {
    service.validateCommandDefinitions()
  })

  it('has valid subscriptions', () => {
    service.validateSubscriptionDefinitions()
  })
})

```

::: tip
If you have the need to write some unit test for your custom service class implementation, you should not extend the generated file.
Instead create your own test file.
:::

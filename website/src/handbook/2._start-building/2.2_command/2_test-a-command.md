---
order: 20
title: Test a command
shortTitle: Test a command
description: Learn how to unit test a single service command
tag:
  - service
  - command
  - test
  - unit test
  - jest
  - mock
---

The CLI tool will automatically create a unit test file for added commands.  
Generated unit test files expecting the usage of [Jest](https://jestjs.io), or an API compatible test framework.  
For stubbing and mocking, [Sinon.js](https://sinonjs.org) will be used.

A generated test file looks like this:

```typescript
import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service'
import { signUpCommandBuilder } from './signUpCommandBuilder'
import { UserV1SignUpInputParameter, UserV1SignUpInputPayload } from './types'

describe('service User version 1 - command signUp', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const signUp = signUpCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1SignUpInputPayload = undefined

    const parameter: UserV1SignUpInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await signUp(context.mock, payload, parameter)

    expect(result).toBeUndefined()
  })
})
```

A Sinon.js sandbox is created before and restored after each single test.  
Using a sandbox allows to clean everything after each test, even if the test has failed.

The test itself is pretty straight-forward.  
For testing our command function, we will simply call the function.  

A command function is running in the `this`-scope of the service. Because of this, we need a instance of the service.  
For creating a service instance, an event bridge instance is needed.  

Also, the command function is called with a command function context.

PURISTA provides some helpers for creating mocks and stubs.  
Because of this, creation of the event bridge instance, the service instance and function context is pretty easy.

Now, the command function can be called with some test data input.  
The result can now be tested and validated.

## Test helper

You can find a list of test helper can be found in the [API documentation: Unit test helper](../../../api/modules/purista_core.html#unit-test-helper).

There are also some helpfull general helper functions available.  
They can help developers to create test data.  
You can find them in the [API documentation: Helper](../../../api/modules/purista_core.html#helper)

## Mocks

PURISTA comes with some simple mocks, which should developers help to write tests fast and simple.  
In general, the mock helper will work similar.

As optional input, a Sinon.js sandbox can be provided.  
Mock creation helpers will return a object with the two properties `mock` and `stubs`.  
The `mock` property contains the mocked instance or object.  
The `stubs` property returns the Sinon.js stubs, used in the mocked instance or object.

Example:

```typescript
const mockedLogger = getLoggerMock(sandbox)

mockedLogger.mock.error('error')
expect(mockedLogger.stubs.error.calledWith('error'))
```

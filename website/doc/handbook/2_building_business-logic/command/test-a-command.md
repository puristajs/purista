---
title: Test a Command
description: How to test a command with PURISTA typescript helpers
order: 202040
---

# Test a command

A unit test for a command looks like this:

```typescript
import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service'
import { fooCommandBuilder } from './fooCommandBuilder'
import type { PingV1FooInputParameter, PingV1FooInputPayload } from './types'

describe('service Ping version 1 - command foo', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = await pingV1Service.getInstance(
      getEventBridgeMock(sandbox).mock, 
      { 
        logger: getLoggerMock(sandbox).mock 
      }
    )

    // use safeBind to keep the typescript types
    const foo = safeBind(fooCommandBuilder.getCommandFunction(), service)
    // alternative without
    // const foo = fooCommandBuilder.getCommandFunction().bind(service)

    const payload: PingV1FooInputPayload = undefined

    const parameter: PingV1FooInputParameter = {}

    // get a mocked command context
    const context = fooCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    // execute the command including the validations and hooks
    const result = await foo(context.mock, payload, parameter)

    expect(result).toStrictEqual({ foo: 'foo' })
  })
})
```


The intersting part is the mocked command context.  
The `getCommandContextMock`method of the command builder returns an object, which has two entries.

The `mock` entry is the mocked context, which can be passed to the command function.

The `stubs` entry contains [Sinon stubs](https://sinonjs.org/releases/latest/stubs/) for every context method.  

As an example, a command might invoke other services and we need to mock the returned data.

```typescript
const context = fooCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

context.stubs.service.OtherService[1].otherCommand.resolves('mock data')
```


## Testing

During unit tests, you will need to mock command invokes.  
PURISTA provides the `getCommandContextMock` in the command builder, which allows to easy mock service invocations.

Only services defined with `canInvoke` are available in the context mock.

```typescript
const context = fooCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

// type/autocomplete is done magically
context.stubs.service.OtherServiceName[1].otherCommandName.resolves({ resultValue: 'the mocked value })
```

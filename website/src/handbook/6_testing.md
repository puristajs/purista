---
# This control sidebar index
index: true
order: 70
# This is the icon of the page
icon: vial-circle-check fas
# This is the title of the article
title: Testing
# A page can have multiple tags
tag:
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Testing

Testing is one of the most love-hate-stories for developers.  
It's always balancing between quick delivery, highly automated tests and catching each edge case and of course available time/money.

Testing does not come for free, and you need time for it, and as we all know: time is money.

So, how can PURISTA help here?

First, because of it's concept and core design.  
As there are schema validations in each service function for input and output, we avoid a lot of edge cases upfront.  
You do not need to test, what happens, if there is some wrong input.  
Also, you do not need to take care to prevent data leaks if something fails.
It's clear, it's defined, and nothing a developer needs to implement and test over and over again.
So, just put a ✅ on this topic.

We can be pretty sure, that there is no wrong input data cascaded through the system.

Plus:
We use typescript and types generated out of schema.  
So we avoid a lot of issues again.  
We do not struggle if there is one change on the one end, that unexpectedly something breaks at the other end.  
Linter and typescript are your friend.  
Next ✅ we have.

Second big thing to point out here:  
We can build real complex systems, but we write most of the time only simple, encapsulated functions, which are following the same design pattern.  
We have always defined, validated input and always defined, validated output.
Input and Output validation + proper error response = ✅

We also do not need to think about edge cases like "what happens if something inside a function throws".  
We already know it - it's caught, logged and handled with a defined error response.
Unhandled, unexpected errors = ✅

This means we can more focus on testing single functions.  
Just prove the business logic, instead of proving correct code.

## Mocks

PURISTA comes with some simple mocks, which should developers help to write tests fast and simple.

Currently, there are mocks available for:

- FunctionContext
- SubscriptionContext
- Eventbridge
- Logger

## Example

Service function to test:

```typescript
export default new FunctionDefinitionBuilder ....
  ....
  .setFunction( async function ({ invoke }, payload, parameter) {

      // your logic does some stuff with payload and extract parameters

      const invokePayload = {
        complex: {
          payload: 'value',
        }
      }

      const invokeParameter = {
        paramOne: 'value param 1',
        paramTwo: 'value param 2',
        key: 'value'
      }

      // invoke some other service function
      const invokeResult = await invoke<InvokeResultPayloadType>({
        receiver: {
          serviceName: 'OtherService',
          serviceVersion: '1',
          serviceTarget: 'otherServiceFunction',
        },
        command: {
          payload: invokePayload,
          parameter: invokeParameter,
        },
      })

      // do stuff with in invokeResult
      // ... 
      // return the result of our function
      return result
    }
  )
```

Can be tested this way:

```typescript
import { getEventBridgeMock, getFunctionContextMock, getLoggerMock, HandledError } from '@purista/core'

import { UserService } from '../../UserService'
import { userSignUpBuilder } from './index'

const f = userSignUpBuilder.getFunction()

const service = UserService.getInstance(getLoggerMock().mock, getEventBridgeMock().mock)
const fn = f.bind(service)

test('returns a new user id', async () => {
  // the function input payload
  // this is the result of all hooks & transformations
  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  // the function input parameter
  // this is the result of all hooks & transformations
  const parameter = {}

  // the original input before any hook, validation/transformation is done
  const messagePayload = {...payload}
  const messageParameter = {...parameter}

  const context = getFunctionContextMock(messagePayload, messageParameter)

  context.stubs.invoke.resolves( 
    // pass your invoke result data here
    'return some mocked data here'
  )

  const result = await fn(context.mock, payload, parameter)

  expect(result).toBeDefined()

  expect(context.stubs.logger.debug.calledWith(initialPayload)).toBeTruthy()
})


// if you handle invocation errors within your function, you might want to test this unhappy path.
// here is an example on how to let a invocation fail in tests
test('throws because invocation failed', async (t) => {
  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  const parameter = {}

  const messagePayload = {...payload}
  const messageParameter = {...parameter}

  const context = getFunctionContextMock(messagePayload, messageParameter)

  context.stubs.invoke.rejects(new HandledError(500, 'something went wrong'))

  try {
    await fn(context.mock, payload, parameter)
    t.fail('Did not throw')
  } catch (error) {
    expect(err).toBeDefined()
  }
})
```

As you can see, you just need to call your function with some input values and maybe mock invocations of other functions.

There are no unknowns, dependency injections you need to take care of, side effects from other functions if you keep your functions as simple as possible, stateless and separated into many little pieces.

The correct types for your function in-/output are already set.

With this approach, testing becomes real simple, powerful and reduces the time/costs to a minimum.

The same way you can test subscription functions:

```typescript
import { createTestCommandMsg, getEventBridgeMock, getLoggerMock, getSubscriptionContextMock } from '@purista/core'

import { UserService } from '../../UserService'
import { userSignUpBuilder } from './index'

const f = userSignUpBuilder.getFunction()

const service = UserService.getInstance(getLoggerMock().mock, getEventBridgeMock().mock)
const fn = f.bind(service)

test('returns a new user id', async () => {
  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  const parameter = {}

  const messagePayload = { payload: { payload, parameter } }

  const context = getSubscriptionContextMock(createTestCommandMsg(messagePayload))

  // as we have a subscription here.
  // the function has only payload as second parameter.
  // if your subscription is listening on command
  await fn(context.mock, messagePayload })

  expect(context.stubs.logger.info.called).toBeTruthy()
})
```

There are some test helper functions to create propper messages:

- createTestCommandMsg
- createTestCommandResponseMsg
- createTestCommandErrorResponseMsg
- createTestCommandMsg

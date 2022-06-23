---
# This control sidebar index
index: 5
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

- Eventbridge
- Logger

## Example

Service function to test:

```typescript
import type { MyService } from '../../MyService'
import { InputParameterType, InputPayloadType, OutputPayloadType } from './schema'

 import { 
   InputPayloadType as InvokeRequestPayloadType, 
   InputParameterType as InvokeRequestParameterType,
   OutputPayloadType as InvokeResultPayloadType  
  } from '../../../OtherService/commands/otherServiceFunction/schema'


export const myFunction: CommandFunction<MyService, InputPayloadType, InputParameterType, OutputPayloadType> =
  async function (payload, parameter) {

    // your logic does some stuff with payload and extract parameters

    const invokePayload: InvokeRequestPayloadType = {
      complex: {
        payload: 'value',
      }
    }

    const invokeParameter: InvokeRequestParameterType = {
      paramOne: 'value param 1',
      paramTwo: 'value param 2',
      key: 'value'
    }

    // invoke some other service function
    const invokeResult = this.invoke<InvokeResultPayloadType>({
      receiver: {
        serviceName: 'OtherService',
        serviceTarget: 'otherServiceFunction',
        serviceVersion: '1.0.0',
      },
      command: {
        payload: invokePayload,
        parameter: invokeParameter,
      },
    })

    // do stuff with in invokeResult

    // return the result of our function
    return returnPayload
  }
```

Can be tested this way:

```typescript
import { Command, ErrorCode, getEventBridgeMock, getLoggerMock, UnhandledError } from '@purista/core'

import { InputParameterType, InputPayloadType } from './schema'
import { MyService } from '../../MyService'
import { myFunction } from './myFunction
import Sinon from 'sinon'


let service: MyService
let message: Command<InputPayloadType, InputParameterType>
beforeEach(()=>{
  service = new MyService(getLoggerMock(), getEventBridgeMock().mock)
  message = {} as Command<InputPayloadType, InputParameterType>
})

test('works', async () => {
  const payload: InputPayloadType = {
    // add your test input payload data
  } 

  const parameter: InputParameterType = {
    // add your test input parameter data
  }

  const invokeStub = Sinon.stub(service,'invoke').resolves({
    // add the test data response you expect from OtherService otherServiceFunction
  })

  const fnToTest = myFunction.bind(service)

  const result = await fnToTest(payload, parameter, message)

  invokeStub.reset()
  expect(result).toEqual(newChild)
  
})

test('should return a unhandled error if invoked function throws', async () => {
  const payload: InputPayloadType = {
    // add your test input payload data
  } 

  const parameter: InputParameterType = {
    // add your test input parameter data
  }

  const invokeStub = Sinon.stub(service,'invoke').rejects(new Error('Some error))

  const fnToTest = myFunction.bind(service)

  await expect( fnToTest(payload, parameter, message) ).rejects.toEqual(
    new UnhandledError(ErrorCode.InternalServerError, getErrorMessageForCode(ErrorCode.InternalServerError)),
  )

  invokeStub.reset()
})
```

As you can see, you just need to call your function with some input values and maybe mock invocations of other functions.

There are no unknowns, dependency injections, side effects from other functions if you keep your functions as simple as possible, stateless and separated into many little pieces.

With this approach, testing becomes real simple, powerful and reduces the time/costs to a minimum.

---
title: Error Handling
description: Error handling in typescript backend framework PURISTA
order: 204020
---

# Error handling

Error handling is one of the essentials of software development.
But it's not easy - especially when your complexity is growing.

By implementing only happy path, without proper error handling, maintenance will quickly become a nightmare.

PURISTA is build with error handling in mind and helps developers to build understandable, predictable and secure applications.

Error handling is done in different layers of your application, and errors are also unified for better error handling.

PURISTA has deeply integrated support for [OpenTelemetry](https://opentelemetry.io/).
This provides an industrial standard way to keep track of errors and issues.
See [Logging](./logging.md) and [Tracing](../4_open_telemetry/) section.

Errors are automatically added to the OpeneTelemetry trace.

There are two error types provided by PURISTA - `HandledError` and `UnhandledError`.
Both types are logged automatically as soon as they get thrown.

Using these both error types ensures, that we have a defined error structure.

## HandledError

Handled errors are thrown by intention.
These errors are kind of "Ok, I know there is something wrong, and I give back a proper response".

Use cases are something like an API call requests an entity by ID, but no entity for a given ID exist, or the requester does not have proper permissions to access the entity.
Also, every failing input validation in PURISTA is a `HandledError`, as we know what happens and how to react.

Example:

An API call is invoking a service function like this:

```typescript
const result = dbRepository.findOne(id)

if (!result) {
  throw new HandledError(StatusCode.NotFound, 'entity not found')
}

```

This will give the client who has called the API endpoint a response with HTTP status code **404 NOT FOUND** and with a payload like this:

```json
{
  "status": 404,
  "message": "entity not found"
}
```

You can provide additional data to that error response:

```typescript
const result = db.findOne(id)

if (!result) {
  throw new HandledError(StatusCode.NotFound, 'entity not found', { id })
}

```

which results in:

```json
{
  "status": 404,
  "message": "entity not found",
  "data": {
    "id": 1
  }
}
```

::: warning Be aware:
A `HandledError` is only logged in `debug` log level, as it is expected, that this kind of error, is part of the regular business logic, which does not need to get persisted in logs or is used for alerting.
:::

## UnhandledError

Unhandled Errors are more generic errors, where it is not clear, what exactly happened, or how we should handle it.

Let's take an example of a POST endpoint for creating a new Entity.

```typescript
try{
  const result = dbRepository.create(payload)
} catch(err) {
  if (isConstraintViolation(err)) {
    // give the client a propper answer, that he tries to insert a record, but a record with same id already exist
    throw new HandledError(StatusCode.Conflict, 'entity with same id already exist')
  }
  throw new UnhandledError.from(err, StatusCode.InternalServerError)
}

```

As you can see, the error is handled in the sense of _"Ok there is something wrong, and I log this error, and I prevent the system to crash"_, but from client side it is more like _"Ups, something wrong - this should not happen - try again later"_

## General error handling

It is totally fine, if you reduce your error handling in service functions and subscriptions to HandledErrors only.
It is JavaScript/typescript - so just let it throw!

Each service function, and each subscription itself, is wrapped by a try-catch, which will convert any error other than a instance of HandledError, into a UnhandledError with error code 500. The error will be logged. And an error message is send. So no worries, that your whole system can break.

You can create subscriptions to track errors, you have the logs, the user gets a proper response, no information will be leaked.

Because of this, the example from `HandledError` is totally fine, and we do not need to write more code here.
We know that any database issue is handled and returned as **500 INTERNAL SERVER ERROR**.

### Example

**👎 BAD PRACTICE**

Do not catch and handle only *some* errors.

```typescript
try{
  const result = db.create(payload)
} catch(err) {
  if (isConstraintViolation(err)) {
    // give the client a propper answer, that he tries to insert a record,
    // but a record with same id already exist
    throw new HandledError(StatusCode.Conflict, 'entity with same id already exist')
  }
  // ANY NON-CONSTRAINT-ERROR is swallowed, because it is catched, but not handled
  // if it is some other error you never get informed about it
  // it will not throw and will not be logged
}
```

**👍 GOOD PRACTICE**

Handle the things you can, and throw the rest.

```typescript
try{
  const result = db.create(payload)
} catch(error) {
  if (isConstraintViolation(error)) {
    // give the client a propper answer, that he tries to insert a record,
    // but a record with same id already exist
    throw new HandledError(StatusCode.Conflict, 'entity with same id already exist')
  }
  // use static class method .from() to keep the stack trace!
  throw UnhandledError.from(err, StatusCode.InternalServerError)
}
```


## Validation errors

Each service function has input and output validation enforced by design.

Data which is not included in the schema is automatically stripped out and not available inside the service function.
Same for function outputs - unknown is stripped out to prevent exposing sensitive data to the outside in result payload.

### Input validation

If an input validation fails (parameter or payload validation), the validation error is transformed into a HandledError with status **400 BAD REQUEST** and a more specific error detail is available in error response data object.
This is ok, because the one who invoked the function, does already know the input data, and we are safe to give some hints, what data is violating the schema.

PURISTA is passing the `issues` property if Zod error instances into the `data` field. See [Zod - Error handling](https://zod.dev/?id=error-handling).

```json
{
  "status": 400,
  "message": "Bad request",
  "data": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": [ "name" ],
      "message": "Expected string, received number"
    }
  ]
}
```

### Output validation

On the other hand, output validation errors are transformed into UnhandledError with status **500 INTERNAL SERVER ERROR** and no additional data is provided within the error response.
This way, we can be sure, that we do not accidentally expose data or further information which allows attackers to get more insights of our system.

### Errors in subscriptions

Subscriptions should implement their own input validation.
Because a subscription can receive different message types, depending on the subscription settings, there is currently no way to automate it.

If a subscription throws some error - other than a `HandledError`, it is automatically transformed into an UnhandledError and the original error gets logged.



## Error tracking

In general, there are three different options available, to track errors in PURISTA.

### Open Telemetry and logging

The default and recommended way to track errors in a PURISTA based application is, to use the OpeneTelementry possibilities.

### Tracking of javascript events

To allow a more flexible way of tracking, monitoring or alerting, you might want to use some external services like [sentry](https://sentry.io/) or you like to programmatically react on errors and issues.
For example, automatically open a issue in your ticket system.

To allow a flexible and decoupled way, a service emits the following events:

- `handled-subscription-error` emitted when a subscription throws a HandledError
- `handled-command-error` emitted when a command throws a HandledError
- `unhandled-subscription-error` emitted when a subscription throws an error other than a HandledError
- `unhandled-command-error` emitted when a command throws an error other than a HandledError

This means, you can attach your logic like opening a issue in your ticket system, instead of deeply integrate it into your business logic.

### Tracking of error messages

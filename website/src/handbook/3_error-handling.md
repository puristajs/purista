---
# This control sidebar index
index: true
order: 40
# This is the icon of the page
icon: bugs fas
# This is the title of the article
title: Error handling
# A page can have multiple tags
tag:
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Error handling

Error handling is one of the essentials of software development.  
But it's not easy - especially when your complexity is growing.

By implementing only happy path, without proper error handling, maintenance will quickly become a nightmare.

PURISTA is build with error handling in mind and helps developers to build understandable, predictable and secure applications.

Error handling is done in different layers of your application, and errors are also unified for better error handling.

## Error types

There are two error types provided by PURISTA - `HandledError` and `UnhandledError`.  
Both types are logged automatically as soon as they get thrown.

Using these both error types ensures, that we have a defined error structure.

### HandledError

Handled errors are thrown by intention.  
These errors are kind of "Ok, I know there is something wrong, and I give back a proper response".

Use cases are something like an API call requests an entity by ID, but no entity for a given ID exist, or the requester does not have proper permissions to access the entity.  
Also, every failing input validation in PURISTA is a `HandledError`, as we know what happens and how to react.

Example:

An API call is invoking a service function like this:

```typescript
const result = db.findOne(id)

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

This is used, out of the box, for automatically generated errors thrown by failing input validations.

### UnhandledErrors

Unhandled Errors are more generic errors, where it is not clear what exactly happened or how we should handle it.

Let's take an example of a POST endpoint for creating a new Entity.

```typescript
try{
  const result = db.create(payload)
} catch(err) {
  if (isConstraintViolation(err)) {
    // give the client a propper answer, that he tries to insert a record, but a record with same id already exist
    throw new HandledError(StatusCode.Conflict, 'entity with same id already exist')
  }
  // maybe our database is unreachable, so simply return a 500
  throw new UnhandledError(StatusCode.InternalServerError,'internal server error')
}

```

As you can see, the error is handled in the sense of _"Ok there is something wrong, and I log this error and prevent the system to crash"_, but from client side it is more like "Ups, something wrong - this should not happen"

### Error (js/ts)

It is totally fine, if you reduce your error handling in service functions and subscriptions to HandledErrors only.  
It is JavaScript/typescript - so just let it throw!  

Each service function and each subscription itself is wrapped by a try-catch, which will convert any error into a UnhandledError with error code 500. So no worries, that your whole system can break.

Because of this, the example from `HandledError` is totally fine, and we do not need to write more code here.  
We know that any database issue is handled and returned as **500 INTERNAL SERVER ERROR**.

<Badge text="Avoid swallowing errors" type="danger"/>

Do not catch and handle only *some* errors.  
**BAD PRACTICE**

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

<Badge text="Log and throw" type="tip"/>

**GOOD PRACTICE**

```typescript
try{
  const result = db.create(payload)
} catch(err) {
  if (isConstraintViolation(err)) {
    // give the client a propper answer, that he tries to insert a record,
    // but a record with same id already exist
    throw new HandledError(StatusCode.Conflict, 'entity with same id already exist')
  }
  // log the original (unknown) error
  logger.error('Houston we got a problem here', err)
  // throw an unhandled error
  throw new UnhandledError(StatusCode.InternalServerError,'internal server error')
}
```

## Validation errors

Each service function has input and output validation enforced by design.

Data which is not included in the schema is automatically stripped out and not available inside the service function.  
Same for function outputs - unknown is stripped out to prevent exposing sensitive data to the outside in result payload.

If an input validation fails (parameter or payload validation), the validation error is transformed into a HandledError with status **400 BAD REQUEST** and a more specific error detail is available in error response data object.  
This is ok, because the one who invoked the function, does already know the input data, and we are safe to give some hints, what data is violating the schema.

On the other hand, output validation errors are transformed into UnhandledError with status **500 INTERNAL SERVER ERROR** and no additional data is provided within the error response.
This way, we can be sure, that we do not accidentally expose data or further information which allows attackers to get more insights of our system.

Subscriptions should implement their own input validation.  
Because a subscription can receive different message types, depending on the subscription settings, there is currently no way to automate it.

If a subscription throws some error, it is automatically transformed into an UnhandledError and the original error is logged.
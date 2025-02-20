[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / gracefulShutdown

# Function: gracefulShutdown()

> **gracefulShutdown**(`logger`, `list`, `timeoutMs`): `void`

Defined in: [packages/core/src/helper/gracefulShutdown.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/gracefulShutdown.impl.ts#L37)

Helps to gracefully shut down your application.
Provide in list objects. The objects contains a name and a promise function which should be executed.

The execution of array list functions is done sequential.

## Parameters

### logger

[`Logger`](../classes/Logger.md)

the logger object

### list

[`ShutdownEntry`](../type-aliases/ShutdownEntry.md)[]

a object containing name and function

### timeoutMs

`number` = `30000`

in ms to shut

## Returns

`void`

## Example

```typescript
const shutDownList = [
 {
   name: `${serviceA.info.serviceName} version ${serviceA.info.serviceVersion}`,
   fn: serviceA.destroy
 },
 {
   name: `${serviceB.info.serviceName} version ${serviceB.info.serviceVersion}`,
   fn: serviceB.destroy
 },
{
   name: eventbridge.name,
   fn: eventbridge.destroy
 }
]
gracefulShutdown(logger, shutDownList)

// will shutdown ServiceA, then ServiceB, then the event bridge
```

## Default

```ts
30000 milliseconds
```

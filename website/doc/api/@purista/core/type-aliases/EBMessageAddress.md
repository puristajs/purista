[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EBMessageAddress

# Type Alias: EBMessageAddress

> **EBMessageAddress**: `object`

Defined in: [packages/core/src/core/types/EBMessageAddress.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L6)

A event bridge message address describes the sender or receiver of a message.

## Type declaration

### instanceId?

> `optional` **instanceId**: `Exclude`\<[`InstanceId`](InstanceId.md), `""`\>

instance id of eventbridge

### serviceName

> **serviceName**: `Exclude`\<`string`, `""`\>

the name of the service

### serviceTarget

> **serviceTarget**: `Exclude`\<`string`, `""`\>

the name of the command or subscription

### serviceVersion

> **serviceVersion**: `Exclude`\<`string`, `""`\>

the version of the service

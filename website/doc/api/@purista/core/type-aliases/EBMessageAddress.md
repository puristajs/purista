[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EBMessageAddress

# Type Alias: EBMessageAddress

> **EBMessageAddress** = `object`

Defined in: [core/types/EBMessageAddress.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L6)

A event bridge message address describes the sender or receiver of a message.

## Properties

### instanceId?

> `optional` **instanceId**: `Exclude`\<[`InstanceId`](InstanceId.md), `""`\>

Defined in: [core/types/EBMessageAddress.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L14)

instance id of eventbridge

***

### serviceName

> **serviceName**: `Exclude`\<`string`, `""`\>

Defined in: [core/types/EBMessageAddress.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L8)

the name of the service

***

### serviceTarget

> **serviceTarget**: `Exclude`\<`string`, `""`\>

Defined in: [core/types/EBMessageAddress.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L12)

the name of the command or subscription

***

### serviceVersion

> **serviceVersion**: `Exclude`\<`string`, `""`\>

Defined in: [core/types/EBMessageAddress.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L10)

the version of the service

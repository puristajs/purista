[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueLongRunningExecutionProfile

# Type Alias: QueueLongRunningExecutionProfile

> **QueueLongRunningExecutionProfile** = `object`

Defined in: [core/types/queue/QueueExecutionProfile.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueExecutionProfile.ts#L3)

## Properties

### maxRuntimeMs

> **maxRuntimeMs**: `number`

Defined in: [core/types/queue/QueueExecutionProfile.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueExecutionProfile.ts#L5)

***

### name

> **name**: [`QueueExecutionProfileName`](QueueExecutionProfileName.md)

Defined in: [core/types/queue/QueueExecutionProfile.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueExecutionProfile.ts#L4)

***

### onLeaseLost?

> `optional` **onLeaseLost?**: `"abort"`

Defined in: [core/types/queue/QueueExecutionProfile.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueExecutionProfile.ts#L11)

***

### shutdown?

> `optional` **shutdown?**: `object`

Defined in: [core/types/queue/QueueExecutionProfile.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueExecutionProfile.ts#L7)

#### graceMs?

> `optional` **graceMs?**: `number`

#### onTimeout?

> `optional` **onTimeout?**: `"letLeaseExpire"`

***

### strict?

> `optional` **strict?**: `boolean`

Defined in: [core/types/queue/QueueExecutionProfile.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueExecutionProfile.ts#L6)

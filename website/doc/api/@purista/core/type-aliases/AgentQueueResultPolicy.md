[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentQueueResultPolicy

# Type Alias: AgentQueueResultPolicy

> **AgentQueueResultPolicy** = `object`

Defined in: [AgentQueueBuilder/types.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L101)

## Properties

### cancelledEventName?

> `optional` **cancelledEventName?**: `string`

Defined in: [AgentQueueBuilder/types.ts:105](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L105)

***

### deadLetterEventName?

> `optional` **deadLetterEventName?**: `string`

Defined in: [AgentQueueBuilder/types.ts:106](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L106)

***

### delivery?

> `optional` **delivery?**: `"required"` \| `"best-effort"`

Defined in: [AgentQueueBuilder/types.ts:113](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L113)

***

### emitProgressEvents?

> `optional` **emitProgressEvents?**: `boolean`

Defined in: [AgentQueueBuilder/types.ts:109](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L109)

***

### eventId?

> `optional` **eventId?**: `"jobIdAndStatus"` \| ((`input`) => `string`)

Defined in: [AgentQueueBuilder/types.ts:110](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L110)

***

### failureEventName?

> `optional` **failureEventName?**: `string`

Defined in: [AgentQueueBuilder/types.ts:104](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L104)

***

### mode

> **mode**: [`AgentQueueResultPolicyMode`](AgentQueueResultPolicyMode.md)

Defined in: [AgentQueueBuilder/types.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L102)

***

### progressEventName?

> `optional` **progressEventName?**: `string`

Defined in: [AgentQueueBuilder/types.ts:107](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L107)

***

### successEventName?

> `optional` **successEventName?**: `string`

Defined in: [AgentQueueBuilder/types.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L103)

***

### ttlMs?

> `optional` **ttlMs?**: `number`

Defined in: [AgentQueueBuilder/types.ts:108](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L108)

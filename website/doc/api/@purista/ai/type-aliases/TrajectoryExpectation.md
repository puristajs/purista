[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / TrajectoryExpectation

# Type Alias: TrajectoryExpectation

> **TrajectoryExpectation** = `object`

Defined in: [packages/ai/src/testing/trajectory.ts:6](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L6)

## Properties

### approval?

> `optional` **approval**: `object`

Defined in: [packages/ai/src/testing/trajectory.ts:16](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L16)

#### checkpoint?

> `optional` **checkpoint**: `string`

#### statuses?

> `optional` **statuses**: (`"pending"` \| `"approved"` \| `"rejected"` \| `"expired"`)[]

***

### artifacts?

> `optional` **artifacts**: (`string` \| \{ `contentIncludes?`: `string` \| `RegExp`; `id`: `string`; `phase?`: `"chunk"` \| `"final"` \| `"any"`; \})[]

Defined in: [packages/ai/src/testing/trajectory.ts:8](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L8)

***

### errors?

> `optional` **errors**: `boolean` \| (`string` \| `RegExp`)[]

Defined in: [packages/ai/src/testing/trajectory.ts:20](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L20)

***

### finalMessage?

> `optional` **finalMessage**: `string` \| `RegExp`

Defined in: [packages/ai/src/testing/trajectory.ts:9](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L9)

***

### mode?

> `optional` **mode**: [`TrajectoryMatchMode`](TrajectoryMatchMode.md)

Defined in: [packages/ai/src/testing/trajectory.ts:21](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L21)

***

### reflection?

> `optional` **reflection**: `object`

Defined in: [packages/ai/src/testing/trajectory.ts:11](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L11)

#### minIterations?

> `optional` **minIterations**: `number`

#### name?

> `optional` **name**: `string`

***

### requireApprovalArtifact?

> `optional` **requireApprovalArtifact**: `boolean` \| `string`

Defined in: [packages/ai/src/testing/trajectory.ts:15](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L15)

***

### requireReflectionSummary?

> `optional` **requireReflectionSummary**: `boolean`

Defined in: [packages/ai/src/testing/trajectory.ts:10](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L10)

***

### tools?

> `optional` **tools**: (`string` \| \{ `name`: `string`; `statuses?`: (`"invoked"` \| `"success"` \| `"error"`)[]; \})[]

Defined in: [packages/ai/src/testing/trajectory.ts:7](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/trajectory.ts#L7)

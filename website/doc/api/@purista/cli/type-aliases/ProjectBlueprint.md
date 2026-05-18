[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / ProjectBlueprint

# Type Alias: ProjectBlueprint

> **ProjectBlueprint** = `object`

Defined in: [packages/cli/src/blueprints/types.ts:56](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L56)

## Properties

### applies?

> `optional` **applies?**: (`context`) => `boolean`

Defined in: [packages/cli/src/blueprints/types.ts:62](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L62)

#### Parameters

##### context

[`ProjectBlueprintContext`](ProjectBlueprintContext.md)

#### Returns

`boolean`

***

### conflicts?

> `optional` **conflicts?**: [`BlueprintId`](BlueprintId.md)[]

Defined in: [packages/cli/src/blueprints/types.ts:61](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L61)

***

### create

> **create**: (`context`) => [`ProjectBlueprintContribution`](ProjectBlueprintContribution.md)

Defined in: [packages/cli/src/blueprints/types.ts:63](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L63)

#### Parameters

##### context

[`ProjectBlueprintContext`](ProjectBlueprintContext.md)

#### Returns

[`ProjectBlueprintContribution`](ProjectBlueprintContribution.md)

***

### dependencies?

> `optional` **dependencies?**: [`BlueprintId`](BlueprintId.md)[]

Defined in: [packages/cli/src/blueprints/types.ts:60](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L60)

***

### description

> **description**: `string`

Defined in: [packages/cli/src/blueprints/types.ts:58](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L58)

***

### id

> **id**: [`BlueprintId`](BlueprintId.md)

Defined in: [packages/cli/src/blueprints/types.ts:57](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L57)

***

### tags

> **tags**: `string`[]

Defined in: [packages/cli/src/blueprints/types.ts:59](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/blueprints/types.ts#L59)

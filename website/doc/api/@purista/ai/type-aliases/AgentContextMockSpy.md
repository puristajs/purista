[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentContextMockSpy

# Type Alias: AgentContextMockSpy\<Args, Return\>

> **AgentContextMockSpy**\<`Args`, `Return`\> = (...`args`) => `Return` & `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:11](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/testing/createAgentContextMock.ts#L11)

## Type Declaration

### calls

> **calls**: `Args`[]

### reset()

> **reset**(): `AgentContextMockSpy`\<`Args`, `Return`\>

#### Returns

`AgentContextMockSpy`\<`Args`, `Return`\>

### setImplementation()

> **setImplementation**(`implementation`): `AgentContextMockSpy`\<`Args`, `Return`\>

#### Parameters

##### implementation

(...`args`) => `Return`

#### Returns

`AgentContextMockSpy`\<`Args`, `Return`\>

## Type Parameters

### Args

`Args` *extends* `unknown`[] = `unknown`[]

### Return

`Return` = `unknown`

[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentContextMockSpy

# Type Alias: AgentContextMockSpy\<Args, Return\>

> **AgentContextMockSpy**\<`Args`, `Return`\> = (...`args`) => `Return` & `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:18](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L18)

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

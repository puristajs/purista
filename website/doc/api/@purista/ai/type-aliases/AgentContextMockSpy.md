[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentContextMockSpy

# Type Alias: AgentContextMockSpy\<Args, Return\>

> **AgentContextMockSpy**\<`Args`, `Return`\> = (...`args`) => `Return` & `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:11](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/testing/createAgentContextMock.ts#L11)

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

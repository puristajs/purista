[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / TestSpan

# Type Alias: TestSpan

> **TestSpan** = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:75](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L75)

## Properties

### addEvent

> **addEvent**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `Record`\<`string`, `unknown`\>?\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:78](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L78)

***

### end

> **end**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:81](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L81)

***

### recordException

> **recordException**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`unknown`\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:80](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L80)

***

### setAttribute

> **setAttribute**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:76](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L76)

***

### setAttributes

> **setAttributes**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`Record`\<`string`, `unknown`\>\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:77](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L77)

***

### setStatus

> **setStatus**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`unknown`\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:79](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L79)

## Methods

### spanContext()

> **spanContext**(): `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:82](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/createAgentContextMock.ts#L82)

#### Returns

`object`

##### spanId

> **spanId**: `string`

##### traceFlags

> **traceFlags**: `number`

##### traceId

> **traceId**: `string`

[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / TestSpan

# Type Alias: TestSpan

> **TestSpan** = `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:82](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L82)

## Properties

### addEvent

> **addEvent**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `Record`\<`string`, `unknown`\>?\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:85](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L85)

***

### end

> **end**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:88](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L88)

***

### recordException

> **recordException**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`unknown`\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:87](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L87)

***

### setAttribute

> **setAttribute**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`string`, `unknown`\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:83](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L83)

***

### setAttributes

> **setAttributes**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`Record`\<`string`, `unknown`\>\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:84](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L84)

***

### setStatus

> **setStatus**: [`AgentContextMockSpy`](AgentContextMockSpy.md)\<\[`unknown`\], `void`\>

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:86](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L86)

## Methods

### spanContext()

> **spanContext**(): `object`

Defined in: [packages/ai/src/testing/createAgentContextMock.ts:89](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/createAgentContextMock.ts#L89)

#### Returns

`object`

##### spanId

> **spanId**: `string`

##### traceFlags

> **traceFlags**: `number`

##### traceId

> **traceId**: `string`

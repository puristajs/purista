[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentContextLike

# Type Alias: AgentContextLike\<AgentInvokes\>

> **AgentContextLike**\<`AgentInvokes`\> = `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:100](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L100)

## Type Parameters

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Properties

### app

> **app**: `Pick`\<[`AgentHandlerContext`](AgentHandlerContext.md)\<`unknown`, `unknown`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `never`\>, `AgentInvokes`\>\[`"app"`\], `"manifest"`\>

Defined in: [packages/ai/src/bridge/externalRuntime.ts:101](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L101)

***

### invoke

> **invoke**: `Pick`\<[`AgentHandlerContext`](AgentHandlerContext.md)\<`unknown`, `unknown`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `never`\>, `AgentInvokes`\>\[`"invoke"`\], `"tools"` \| `"agents"`\>

Defined in: [packages/ai/src/bridge/externalRuntime.ts:105](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L105)

***

### io

> **io**: `Pick`\<[`AgentHandlerContext`](AgentHandlerContext.md)\<`unknown`, `unknown`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `never`\>, `AgentInvokes`\>\[`"io"`\], `"protocol"`\>

Defined in: [packages/ai/src/bridge/externalRuntime.ts:109](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L109)

[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createStreamContextMock

# Function: createStreamContextMock()

> **createStreamContextMock**\<`TBuilder`\>(`builder`, `input`): [`StreamContextMockResult`](../type-aliases/StreamContextMockResult.md)\<`TBuilder`\>

Defined in: [testing/createStreamContextMock.ts:145](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamContextMock.ts#L145)

Create a typed stream handler context mock together with a capture writer.

Use this helper to unit test a stream handler without booting a full service
runtime. The returned writer records chunks, the final value, and failures.

## Type Parameters

### TBuilder

`TBuilder` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, `any`\>

## Parameters

### builder

`TBuilder`

### input

[`CreateStreamContextMockInput`](../type-aliases/CreateStreamContextMockInput.md)\<`TBuilder`\>

## Returns

[`StreamContextMockResult`](../type-aliases/StreamContextMockResult.md)\<`TBuilder`\>

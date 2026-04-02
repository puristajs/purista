[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutor

# Class: AgentExecutor

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:81](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L81)

Runs prompts against the configured [ModelProvider](../interfaces/ModelProvider.md), writes session state,
and captures telemetry spans using the provided logger/span factory.

## Example

```ts
const executor = new AgentExecutor({
  manifest,
  provider: myModelProvider,
  conversationStore: new InMemoryConversationStore(),
  logger,
  startActiveSpan: startActiveSpanFn,
})

const result = await executor.run({ sessionId: 'demo', prompt: 'Hello agent!' })
console.log(result.output)
```

The executor persists typed user parts into conversation history. It does not
perform document extraction itself; applications should plug in that logic
before invoking the executor.

## Constructors

### Constructor

> **new AgentExecutor**(`options`): `AgentExecutor`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:84](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L84)

#### Parameters

##### options

[`AgentExecutionOptions`](../type-aliases/AgentExecutionOptions.md)

#### Returns

`AgentExecutor`

## Methods

### run()

> **run**(`input`): `Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:86](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L86)

#### Parameters

##### input

[`AgentExecutionInput`](../type-aliases/AgentExecutionInput.md)

#### Returns

`Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

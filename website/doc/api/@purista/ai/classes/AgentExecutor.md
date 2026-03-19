[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutor

# Class: AgentExecutor

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:73](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentExecutor.ts#L73)

Runs prompts against the configured [ModelProvider](../interfaces/ModelProvider.md), writes session state,
and captures telemetry spans using the provided logger/span factory.

## Example

```ts
const executor = new AgentExecutor({
  manifest,
  provider: myModelProvider,
  conversationStore: new InMemoryConversationStore(),
  knowledgeAdapters: { default: new InMemoryKnowledgeAdapter() },
  logger,
  startActiveSpan: startActiveSpanFn,
})

const result = await executor.run({ sessionId: 'demo', prompt: 'Hello agent!' })
console.log(result.output)
```

## Constructors

### Constructor

> **new AgentExecutor**(`options`): `AgentExecutor`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:76](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentExecutor.ts#L76)

#### Parameters

##### options

[`AgentExecutionOptions`](../type-aliases/AgentExecutionOptions.md)

#### Returns

`AgentExecutor`

## Methods

### run()

> **run**(`input`): `Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:78](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentExecutor.ts#L78)

#### Parameters

##### input

[`AgentExecutionInput`](../type-aliases/AgentExecutionInput.md)

#### Returns

`Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

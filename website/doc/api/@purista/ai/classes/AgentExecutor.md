[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutor

# Class: AgentExecutor

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:70](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L70)

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

## Constructors

### Constructor

> **new AgentExecutor**(`options`): `AgentExecutor`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:73](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L73)

#### Parameters

##### options

[`AgentExecutionOptions`](../type-aliases/AgentExecutionOptions.md)

#### Returns

`AgentExecutor`

## Methods

### run()

> **run**(`input`): `Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:75](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/AgentExecutor.ts#L75)

#### Parameters

##### input

[`AgentExecutionInput`](../type-aliases/AgentExecutionInput.md)

#### Returns

`Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

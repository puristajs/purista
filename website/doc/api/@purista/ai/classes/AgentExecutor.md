[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutor

# Class: AgentExecutor

Defined in: [ai/src/runtime/AgentExecutor.ts:71](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L71)

Runs prompts against the configured [ModelProvider](../interfaces/ModelProvider.md), writes session state,
and captures telemetry spans using the provided logger/span factory.

## Example

```ts
const executor = new AgentExecutor({
  manifest,
  provider: new EchoProvider(),
  sessionStore: new InMemorySessionStore(),
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

Defined in: [ai/src/runtime/AgentExecutor.ts:74](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L74)

#### Parameters

##### options

[`AgentExecutionOptions`](../type-aliases/AgentExecutionOptions.md)

#### Returns

`AgentExecutor`

## Methods

### run()

> **run**(`input`): `Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

Defined in: [ai/src/runtime/AgentExecutor.ts:76](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentExecutor.ts#L76)

#### Parameters

##### input

[`AgentExecutionInput`](../type-aliases/AgentExecutionInput.md)

#### Returns

`Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

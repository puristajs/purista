[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentToolExecutorFromInvokeOptions

# Type Alias: AgentToolExecutorFromInvokeOptions

> **AgentToolExecutorFromInvokeOptions** = [`AgentExecutorBaseOptions`](AgentExecutorBaseOptions.md) & `object`

Defined in: [packages/ai/src/runtime/context.ts:303](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L303)

Options for wrapping a typed tool invoke target as a planner delegate.

## Type Declaration

### buildParameter()?

> `optional` **buildParameter**: (`input`) => `unknown` \| `Promise`\<`unknown`\>

Optional task-to-parameter projection.

#### Parameters

##### input

###### request

`string`

###### results

`Record`\<`string`, `unknown`\>

###### task

[`AgentPlanTask`](AgentPlanTask.md)

#### Returns

`unknown` \| `Promise`\<`unknown`\>

### buildPayload()?

> `optional` **buildPayload**: (`input`) => `unknown` \| `Promise`\<`unknown`\>

Optional task-to-payload projection. Defaults to `task.instruction`.

#### Parameters

##### input

###### request

`string`

###### results

`Record`\<`string`, `unknown`\>

###### task

[`AgentPlanTask`](AgentPlanTask.md)

#### Returns

`unknown` \| `Promise`\<`unknown`\>

## Example

```ts
const delegate = context.ai.createToolExecutorFromInvoke(
  context.invoke.tools.invoke.support['1'].lookupFaq,
  {
    id: 'lookup-faq',
    description: 'Fetch factual support guidance',
    buildPayload: ({ task }) => ({ question: task.instruction }),
  },
)
```

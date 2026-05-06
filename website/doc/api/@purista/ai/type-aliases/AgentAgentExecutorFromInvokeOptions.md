[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentAgentExecutorFromInvokeOptions

# Type Alias: AgentAgentExecutorFromInvokeOptions

> **AgentAgentExecutorFromInvokeOptions** = [`AgentExecutorBaseOptions`](AgentExecutorBaseOptions.md) & `object`

Defined in: [packages/ai/src/runtime/context.ts:349](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L349)

Options for wrapping a child-agent invoke target as a planner delegate.

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

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: [`AgentForwardingOptions`](AgentForwardingOptions.md)

Optional canonical child-envelope forwarding configuration.

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Optional schema for validating projected object results.

### resultMode?

> `optional` **resultMode**: [`AgentExecutorResultMode`](AgentExecutorResultMode.md)

Final result projection mode from child invocation.

## Example

```ts
const billingDelegate = context.ai.createAgentExecutorFromInvoke(
  context.invoke.agents.invoke.billingSpecialist['1'],
  { id: 'billing-specialist', description: 'Handles billing requests' },
)
```

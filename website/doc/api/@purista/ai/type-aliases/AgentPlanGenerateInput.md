[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanGenerateInput

# Type Alias: AgentPlanGenerateInput\<Context, Models, Worker, Delegates\>

> **AgentPlanGenerateInput**\<`Context`, `Models`, `Worker`, `Delegates`\> = `object`

Defined in: packages/ai/src/runtime/plan.ts:148

Input for generating a sequential execution plan.

`request` and `title` can be inferred by runtime defaults when omitted.

## Type Parameters

### Context

`Context`

### Models

`Models` *extends* `Record`\<`string`, \{ `generateObject?`: (...`args`) => `Promise`\<`any`\>; \}\>

### Worker

`Worker` *extends* [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `any`\> = [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `unknown`\>

### Delegates

`Delegates` *extends* readonly [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `any`\>[] = readonly [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `unknown`\>[]

## Properties

### delegates?

> `optional` **delegates**: `Delegates`

Defined in: packages/ai/src/runtime/plan.ts:160

***

### instructions?

> `optional` **instructions**: `string`

Defined in: packages/ai/src/runtime/plan.ts:158

***

### model

> **model**: `Extract`\<keyof `Models`, `string`\>

Defined in: packages/ai/src/runtime/plan.ts:155

***

### request?

> `optional` **request**: `string`

Defined in: packages/ai/src/runtime/plan.ts:156

***

### scope?

> `optional` **scope**: `Record`\<`string`, `string`\>

Defined in: packages/ai/src/runtime/plan.ts:157

***

### title?

> `optional` **title**: `string`

Defined in: packages/ai/src/runtime/plan.ts:154

***

### worker

> **worker**: `Worker`

Defined in: packages/ai/src/runtime/plan.ts:159

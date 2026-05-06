[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanDelegateById

# Type Alias: AgentPlanDelegateById\<Delegates, DelegateId\>

> **AgentPlanDelegateById**\<`Delegates`, `DelegateId`\> = `Extract`\<`Delegates`\[`number`\], \{ `id`: `DelegateId`; \}\>

Defined in: packages/ai/src/runtime/plan.ts:83

Resolves a delegate executor by its declared id.

## Type Parameters

### Delegates

`Delegates` *extends* readonly `AnyAgentPlanExecutor`[]

### DelegateId

`DelegateId` *extends* `string`

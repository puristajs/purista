[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentApprovalHelpers

# Type Alias: AgentApprovalHelpers

> **AgentApprovalHelpers** = `object`

Defined in: [packages/ai/src/runtime/approvals.ts:35](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/approvals.ts#L35)

## Methods

### decide()

> **decide**(`input`): `Promise`\<[`ApprovalDecision`](ApprovalDecision.md)\>

Defined in: [packages/ai/src/runtime/approvals.ts:37](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/approvals.ts#L37)

#### Parameters

##### input

`object` & [`ApprovalDecision`](ApprovalDecision.md)

#### Returns

`Promise`\<[`ApprovalDecision`](ApprovalDecision.md)\>

***

### stateKey()

> **stateKey**(`checkpoint`): `string`

Defined in: [packages/ai/src/runtime/approvals.ts:38](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/approvals.ts#L38)

#### Parameters

##### checkpoint

`string`

#### Returns

`string`

***

### wait()

> **wait**(`options`): `Promise`\<[`ApprovalWaitResult`](ApprovalWaitResult.md)\>

Defined in: [packages/ai/src/runtime/approvals.ts:36](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/approvals.ts#L36)

#### Parameters

##### options

[`ApprovalWaitOptions`](ApprovalWaitOptions.md)

#### Returns

`Promise`\<[`ApprovalWaitResult`](ApprovalWaitResult.md)\>

[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / getUnsupportedWorkerAiSdkReason

# Function: getUnsupportedWorkerAiSdkReason()

> **getUnsupportedWorkerAiSdkReason**(`metadata`): `string` \| `null`

Defined in: [packages/ai/src/platform/runtime/AIWorkerService/queue/executeWorkload.ts:17](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/platform/runtime/AIWorkerService/queue/executeWorkload.ts#L17)

Worker queue payload metadata must stay JSON-serializable.
Function-based AI SDK tools cannot be transported/executed by the worker runtime yet.

## Parameters

### metadata

`unknown`

## Returns

`string` \| `null`

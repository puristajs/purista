[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / getUnsupportedWorkerAiSdkReason

# Function: getUnsupportedWorkerAiSdkReason()

> **getUnsupportedWorkerAiSdkReason**(`metadata`): `string` \| `null`

Defined in: [packages/ai/src/platform/runtime/AIWorkerService/queue/executeWorkload.ts:17](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/platform/runtime/AIWorkerService/queue/executeWorkload.ts#L17)

Worker queue payload metadata must stay JSON-serializable.
Function-based AI SDK tools cannot be transported/executed by the worker runtime yet.

## Parameters

### metadata

`unknown`

## Returns

`string` \| `null`

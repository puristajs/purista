[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getQueueBridgeMock

# Function: getQueueBridgeMock()

> **getQueueBridgeMock**(`sandboxOrOptions?`): `object`

Defined in: [mocks/getQueueBridge.mock.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getQueueBridge.mock.ts#L12)

Mocks the queue bridge and stubs the methods.

## Parameters

### sandboxOrOptions?

`SinonSandbox` | \{ `capabilities?`: `Partial`\<[`QueueBridgeCapabilities`](../type-aliases/QueueBridgeCapabilities.md)\>; `sandbox?`: `SinonSandbox`; \}

## Returns

`object`

### mock

> **mock**: [`QueueBridge`](../interfaces/QueueBridge.md)

### stubs

> **stubs**: `Record`\<`string`, `SinonStub`\>

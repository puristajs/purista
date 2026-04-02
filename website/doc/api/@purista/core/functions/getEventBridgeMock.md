[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getEventBridgeMock

# Function: getEventBridgeMock()

> **getEventBridgeMock**(`sandboxOrOptions?`): `object`

Defined in: [mocks/getEventBridge.mock.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getEventBridge.mock.ts#L17)

Mocks the eventBridge and stubs the methods

## Parameters

### sandboxOrOptions?

`SinonSandbox` | \{ `capabilities?`: `EventBridgeCapabilityOverrides`; `sandbox?`: `SinonSandbox`; \}

## Returns

`object`

EventBridge mocked

### mock

> **mock**: [`EventBridge`](../interfaces/EventBridge.md)

### stubs

> **stubs**: `Record`\<`string`, `SinonStub`\>

[**@purista/mqttbridge v2.0.6**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / IMqttBridge

# Type Alias: IMqttBridge

> **IMqttBridge**: `object` & [`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md)\<[`MqttBridgeConfig`](MqttBridgeConfig.md)\>

Defined in: [mqttbridge/src/types/IMqttBridge.ts:5](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/types/IMqttBridge.ts#L5)

## Type declaration

### client

> **client**: `MqttClient` \| `undefined`

### pendingInvocations

> **pendingInvocations**: `Map`\<[`EBMessageId`](../../core/type-aliases/EBMessageId.md), [`PendigInvocation`](../../core/type-aliases/PendigInvocation.md)\>

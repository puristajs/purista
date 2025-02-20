[**@purista/mqttbridge v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / getTopicName

# Function: getTopicName()

> **getTopicName**(`this`, `message`): `string`

Defined in: [mqttbridge/src/topic/getTopicName.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/getTopicName.impl.ts#L31)

Calculates the MQTT topic name for a message which should be sent.
Something like:
purista/
message_type/
principal_id/
sender_instance_id/
sender_name/
sender_version/
sender_target/
eventname/
sender_instance_id/
receiver_name/
receiver_version/
receiver_target

## Parameters

### this

[`MqttBridge`](../classes/MqttBridge.md)

### message

[`EBMessage`](../../core/type-aliases/EBMessage.md)

the message to send

## Returns

`string`

the MQTT topic

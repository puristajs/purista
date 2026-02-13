[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / getTopicName

# Variable: getTopicName

> `const` **getTopicName**: `GetTopicNameFn`

Defined in: [mqttbridge/src/topic/getTopicName.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/getTopicName.impl.ts#L30)

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

## Param

the message to send

## Returns

the MQTT topic

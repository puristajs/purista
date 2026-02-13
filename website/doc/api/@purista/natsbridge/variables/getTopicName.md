[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/natsbridge](../README.md) / getTopicName

# Variable: getTopicName

> `const` **getTopicName**: `GetTopicNameFn`

Defined in: [natsbridge/src/topic/getTopicName.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/topic/getTopicName.impl.ts#L18)

Calculates the NATS topic name for a message which should be sent.
Something like:
purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target

## Param

the message to send

## Returns

the NATS topic

[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Command

# Type Alias: Command\<PayloadType, ParameterType\>

> **Command**\<`PayloadType`, `ParameterType`\>: [`Prettify`](Prettify.md)\<`object` & [`EBMessageBase`](EBMessageBase.md)\>

Defined in: [packages/core/src/core/types/commandType/Command.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/Command.ts#L18)

Command is a event bridge message, which is emitted by sender to event bridge.
The event bridge dispatches the event to the receiver.
A command expects to get a response message from receiver back to sender.

Also if there are subscriptions which are matching given command,
the event bridge also dispatches the command message to the subscriber(s).

BE AWARE:
Subscribers should not respond with command responses if they are "silent" subscribers/listeners.

## Type Parameters

• **PayloadType** = `unknown`

• **ParameterType** = `unknown`

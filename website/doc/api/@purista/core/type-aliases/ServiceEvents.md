[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceEvents

# Type Alias: ServiceEvents

> **ServiceEvents**: [`ServiceEventsInternal`](ServiceEventsInternal.md) & [`addPrefixToObject`](addPrefixToObject.md)\<`CustomEvents`, `"custom-"`\> & [`addPrefixToObject`](addPrefixToObject.md)\<`CustomEvents`, `"misc-"`\>

Defined in: [packages/core/src/core/types/ServiceEvents.ts:98](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L98)

ServiceEvents are plain javascript events sent by the service.
There are three types:
- technical events when a services starts, stops, an error occurs and so on are prefixed with `service-`
- response messages, which have a event name assigned, are prefixed with `custom-`
- additional events, free defined by developer are prefixed with `misc-`

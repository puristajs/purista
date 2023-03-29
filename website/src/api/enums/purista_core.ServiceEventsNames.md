[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ServiceEventsNames

# Enumeration: ServiceEventsNames

[@purista/core](../modules/purista_core.md).ServiceEventsNames

Events which can be emitted by a service.
Internal events are prefixed with `service-`

## Table of contents

### Events

- [CommandHandledError](purista_core.ServiceEventsNames.md#commandhandlederror)
- [CommandUnhandledError](purista_core.ServiceEventsNames.md#commandunhandlederror)
- [ServiceAvailable](purista_core.ServiceEventsNames.md#serviceavailable)
- [ServiceDrain](purista_core.ServiceEventsNames.md#servicedrain)
- [ServiceStarted](purista_core.ServiceEventsNames.md#servicestarted)
- [ServiceStopped](purista_core.ServiceEventsNames.md#servicestopped)
- [ServiceUnavailable](purista_core.ServiceEventsNames.md#serviceunavailable)
- [SubscriptionHandledError](purista_core.ServiceEventsNames.md#subscriptionhandlederror)
- [SubscriptionUnhandledError](purista_core.ServiceEventsNames.md#subscriptionunhandlederror)

## Events

### CommandHandledError

• **CommandHandledError** = ``"service-handled-command-error"``

emitted when a command throws a HandledError

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:36](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L36)

___

### CommandUnhandledError

• **CommandUnhandledError** = ``"service-unhandled-command-error"``

emitted when a command throws an error other than a HandledError

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:42](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L42)

___

### ServiceAvailable

• **ServiceAvailable** = ``"service-available"``

emitted when the service is fully initialized and ready
Should be emitted by custom service class.
It is not emitted by default

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:21](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L21)

___

### ServiceDrain

• **ServiceDrain** = ``"service-drain"``

emitted when the service is going to be stopped

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:24](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L24)

___

### ServiceStarted

• **ServiceStarted** = ``"service-started"``

emitted when the service is started, but not fully initialized and not ready yet

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L13)

___

### ServiceStopped

• **ServiceStopped** = ``"service-stopped"``

emitted when the service has been stopped

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:27](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L27)

___

### ServiceUnavailable

• **ServiceUnavailable** = ``"service-not-available"``

emitted when the service is not available (for example database connection could not be established)

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:30](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L30)

___

### SubscriptionHandledError

• **SubscriptionHandledError** = ``"service-handled-subscription-error"``

emitted when a subscription throws a HandledError

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:33](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L33)

___

### SubscriptionUnhandledError

• **SubscriptionUnhandledError** = ``"service-unhandled-subscription-error"``

emitted when a subscription throws an error other than a HandledError

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:39](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L39)

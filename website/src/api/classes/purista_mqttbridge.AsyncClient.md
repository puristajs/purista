[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/mqttbridge](../modules/purista_mqttbridge.md) / AsyncClient

# Class: AsyncClient

[@purista/mqttbridge](../modules/purista_mqttbridge.md).AsyncClient

## Table of contents

### Constructors

- [constructor](purista_mqttbridge.AsyncClient.md#constructor)

### Properties

- [logger](purista_mqttbridge.AsyncClient.md#logger)
- [mqttClient](purista_mqttbridge.AsyncClient.md#mqttclient)

### Accessors

- [connected](purista_mqttbridge.AsyncClient.md#connected)
- [disconnected](purista_mqttbridge.AsyncClient.md#disconnected)
- [disconnecting](purista_mqttbridge.AsyncClient.md#disconnecting)
- [handleMessage](purista_mqttbridge.AsyncClient.md#handlemessage)
- [incomingStore](purista_mqttbridge.AsyncClient.md#incomingstore)
- [options](purista_mqttbridge.AsyncClient.md#options)
- [outgoingStore](purista_mqttbridge.AsyncClient.md#outgoingstore)
- [queueQoSZero](purista_mqttbridge.AsyncClient.md#queueqoszero)
- [reconnecting](purista_mqttbridge.AsyncClient.md#reconnecting)

### Methods

- [addListener](purista_mqttbridge.AsyncClient.md#addlistener)
- [connect](purista_mqttbridge.AsyncClient.md#connect)
- [emit](purista_mqttbridge.AsyncClient.md#emit)
- [end](purista_mqttbridge.AsyncClient.md#end)
- [eventNames](purista_mqttbridge.AsyncClient.md#eventnames)
- [getLastMessageId](purista_mqttbridge.AsyncClient.md#getlastmessageid)
- [getMaxListeners](purista_mqttbridge.AsyncClient.md#getmaxlisteners)
- [listenerCount](purista_mqttbridge.AsyncClient.md#listenercount)
- [listeners](purista_mqttbridge.AsyncClient.md#listeners)
- [off](purista_mqttbridge.AsyncClient.md#off)
- [on](purista_mqttbridge.AsyncClient.md#on)
- [once](purista_mqttbridge.AsyncClient.md#once)
- [prependListener](purista_mqttbridge.AsyncClient.md#prependlistener)
- [prependOnceListener](purista_mqttbridge.AsyncClient.md#prependoncelistener)
- [publish](purista_mqttbridge.AsyncClient.md#publish)
- [rawListeners](purista_mqttbridge.AsyncClient.md#rawlisteners)
- [reconnect](purista_mqttbridge.AsyncClient.md#reconnect)
- [removeAllListeners](purista_mqttbridge.AsyncClient.md#removealllisteners)
- [removeListener](purista_mqttbridge.AsyncClient.md#removelistener)
- [removeOutgoingMessage](purista_mqttbridge.AsyncClient.md#removeoutgoingmessage)
- [setMaxListeners](purista_mqttbridge.AsyncClient.md#setmaxlisteners)
- [subscribe](purista_mqttbridge.AsyncClient.md#subscribe)
- [unsubscribe](purista_mqttbridge.AsyncClient.md#unsubscribe)

## Constructors

### constructor

• **new AsyncClient**(`logger?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | `Logger` |

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L24)

## Properties

### logger

• `Protected` **logger**: `Logger`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L22)

___

### mqttClient

• `Protected` **mqttClient**: `undefined` \| `MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L21)

## Accessors

### connected

• `get` **connected**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:110](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L110)

• `set` **connected**(`connectedNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `connectedNew` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:117](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L117)

___

### disconnected

• `get` **disconnected**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:144](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L144)

• `set` **disconnected**(`disconnectedNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `disconnectedNew` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:153](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L153)

___

### disconnecting

• `get` **disconnecting**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:126](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L126)

• `set` **disconnecting**(`disconnectingNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `disconnectingNew` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:135](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L135)

___

### handleMessage

• `get` **handleMessage**(): (`packet`: `Packet`, `callback`: `PacketCallback`) => `void`

#### Returns

`fn`

▸ (`packet`, `callback`): `void`

Handle messages with backpressure support, one at a time.
Override at will.

**`Api`**

public

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `packet` | `Packet` | packet the packet |
| `callback` | `PacketCallback` | callback call when finished |

##### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:101](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L101)

• `set` **handleMessage**(`newHandler`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newHandler` | (`packet`: `Packet`, `callback`: `PacketCallback`) => `void` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:92](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L92)

___

### incomingStore

• `get` **incomingStore**(): `Store`

#### Returns

`Store`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:180](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L180)

• `set` **incomingStore**(`incomingStoreNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingStoreNew` | `Store` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:189](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L189)

___

### options

• `get` **options**(): `IClientOptions`

#### Returns

`IClientOptions`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:216](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L216)

• `set` **options**(`optionsNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `optionsNew` | `IClientOptions` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:225](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L225)

___

### outgoingStore

• `get` **outgoingStore**(): `Store`

#### Returns

`Store`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:198](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L198)

• `set` **outgoingStore**(`outgoingStoreNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `outgoingStoreNew` | `Store` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:207](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L207)

___

### queueQoSZero

• `get` **queueQoSZero**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:234](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L234)

• `set` **queueQoSZero**(`queueQoSZeroNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `queueQoSZeroNew` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:243](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L243)

___

### reconnecting

• `get` **reconnecting**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:162](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L162)

• `set` **reconnecting**(`reconnectingNew`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `reconnectingNew` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:171](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L171)

## Methods

### addListener

▸ **addListener**(`eventName`, `listener`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:327](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L327)

___

### connect

▸ **connect**(`opts`, `allowRetries?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `opts` | `IClientOptions` | `undefined` |
| `allowRetries` | `boolean` | `true` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L29)

___

### emit

▸ **emit**(`eventName`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:336](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L336)

___

### end

▸ **end**(`force?`, `opts?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | `boolean` |
| `opts?` | `Object` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:302](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L302)

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:345](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L345)

___

### getLastMessageId

▸ **getLastMessageId**(): `number`

#### Returns

`number`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:354](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L354)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:363](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L363)

___

### listenerCount

▸ **listenerCount**(`eventName`, `listener?`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener?` | `Function` |

#### Returns

`number`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:372](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L372)

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:381](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L381)

___

### off

▸ **off**(`eventName`, `listener`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:390](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L390)

___

### on

▸ **on**(`event`, `cb`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `cb` | `any` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:399](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L399)

___

### once

▸ **once**(`event`, `cb`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `cb` | `any` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:408](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L408)

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:417](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L417)

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:426](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L426)

___

### publish

▸ **publish**(`topic`, `message`, `opts`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` |
| `message` | `string` |
| `opts` | `IClientPublishOptions` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:252](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L252)

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:435](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L435)

___

### reconnect

▸ **reconnect**(`opts?`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `IClientReconnectOptions` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:318](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L318)

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:444](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L444)

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:453](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L453)

___

### removeOutgoingMessage

▸ **removeOutgoingMessage**(`mid`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mid` | `number` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:462](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L462)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): `MqttClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`MqttClient`

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:471](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L471)

___

### subscribe

▸ **subscribe**(`topic`, `opts`): `Promise`<{ `properties?`: { `subscriptionIdentifier?`: `number`  }  }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` \| `string`[] |
| `opts` | `IClientSubscribeOptions` |

#### Returns

`Promise`<{ `properties?`: { `subscriptionIdentifier?`: `number`  }  }[]\>

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:270](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L270)

___

### unsubscribe

▸ **unsubscribe**(`topic`, `opts?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` \| `string`[] |
| `opts?` | `Object` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:286](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L286)

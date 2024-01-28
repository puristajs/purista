[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/dapr-sdk

# Module: @purista/dapr-sdk

SDK and helper to run PURISTA services in Kubernetes.

This package provides the Dapr event bridge and adapters for secret, state and config stores provided by Dapr.

Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.

**`Example`**

```typescript
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'
const eventBridge = new DaprEventBridge({
   spanProcessor,
   logger,
   serve,
 })

const secretStore = new DaprSecretStore({ logger, secretStoreName: 'local-secret-store' })
const stateStore = new DaprStateStore({ logger, stateStoreName: 'local-state-store' })
const configStore = new DaprConfigStore({ logger, configStoreName: 'local-config-store' })

// start the services ...

await eventBridge.start()
```

## Table of contents

### Enumerations

- [DaprPubSubStatusEnum](../enums/purista_dapr_sdk.DaprPubSubStatusEnum.md)

### Classes

- [DaprClient](../classes/purista_dapr_sdk.DaprClient.md)
- [DaprConfigStore](../classes/purista_dapr_sdk.DaprConfigStore.md)
- [DaprSecretStore](../classes/purista_dapr_sdk.DaprSecretStore.md)
- [DaprStateStore](../classes/purista_dapr_sdk.DaprStateStore.md)

### Type Aliases

- [BulkSubscribeConfig](purista_dapr_sdk.md#bulksubscribeconfig)
- [BulkSubscribeOptions](purista_dapr_sdk.md#bulksubscribeoptions)
- [BulkSubscribeResponse](purista_dapr_sdk.md#bulksubscriberesponse)
- [BulkSubscribeResponseEntry](purista_dapr_sdk.md#bulksubscriberesponseentry)
- [DaprClientConfig](purista_dapr_sdk.md#daprclientconfig)
- [DaprConfigStoreConfig](purista_dapr_sdk.md#daprconfigstoreconfig)
- [DaprEventBridgeConfig](purista_dapr_sdk.md#dapreventbridgeconfig)
- [DaprPubSubRouteType](purista_dapr_sdk.md#daprpubsubroutetype)
- [DaprPubSubRuleType](purista_dapr_sdk.md#daprpubsubruletype)
- [DaprPubSubType](purista_dapr_sdk.md#daprpubsubtype)
- [DaprSecretStoreConfig](purista_dapr_sdk.md#daprsecretstoreconfig)
- [DaprStateStoreConfig](purista_dapr_sdk.md#daprstatestoreconfig)
- [KeyValueType](purista_dapr_sdk.md#keyvaluetype)
- [PubSubBulkPublishApiResponse](purista_dapr_sdk.md#pubsubbulkpublishapiresponse)
- [PubSubBulkPublishEntry](purista_dapr_sdk.md#pubsubbulkpublishentry)
- [PubSubBulkPublishMessage](purista_dapr_sdk.md#pubsubbulkpublishmessage)
- [PubSubBulkPublishResponse](purista_dapr_sdk.md#pubsubbulkpublishresponse)
- [PubSubPublishOptions](purista_dapr_sdk.md#pubsubpublishoptions)
- [PubSubPublishResponseType](purista_dapr_sdk.md#pubsubpublishresponsetype)
- [PubSubSubscriptionOptionsType](purista_dapr_sdk.md#pubsubsubscriptionoptionstype)
- [PubSubSubscriptionTopicRouteType](purista_dapr_sdk.md#pubsubsubscriptiontopicroutetype)
- [PubSubSubscriptionTopicRoutesType](purista_dapr_sdk.md#pubsubsubscriptiontopicroutestype)
- [PubSubSubscriptionTopicType](purista_dapr_sdk.md#pubsubsubscriptiontopictype)
- [PubSubSubscriptionType](purista_dapr_sdk.md#pubsubsubscriptiontype)
- [PubSubSubscriptionsType](purista_dapr_sdk.md#pubsubsubscriptionstype)
- [TypeDaprPubSubCallback](purista_dapr_sdk.md#typedaprpubsubcallback)

### Variables

- [DAPR\_API\_VERSION](purista_dapr_sdk.md#dapr_api_version)
- [DEFAULT\_DAPR\_HOST](purista_dapr_sdk.md#default_dapr_host)
- [DEFAULT\_DAPR\_PORT](purista_dapr_sdk.md#default_dapr_port)
- [puristaVersion](purista_dapr_sdk.md#puristaversion)

### Functions

- [configRoute](purista_dapr_sdk.md#configroute)
- [getDefaultClientConfig](purista_dapr_sdk.md#getdefaultclientconfig)
- [getDefaultConfig](purista_dapr_sdk.md#getdefaultconfig)

### Event bridge

- [DaprEventBridge](../classes/purista_dapr_sdk.DaprEventBridge.md)

## Type Aliases

### BulkSubscribeConfig

Ƭ **BulkSubscribeConfig**: `Object`

BulkSubscribeConfig defines the configuration for a bulk subscription

#### Type declaration

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |
| `maxAwaitDurationMs?` | `number` |
| `maxMessagesCount?` | `number` |

#### Defined in

[dapr-sdk/src/types/pubsub/BulkSubscribeConfig.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/BulkSubscribeConfig.type.ts#L19)

___

### BulkSubscribeOptions

Ƭ **BulkSubscribeOptions**: `Object`

BulkSubscribeOptions enlists the options for bulk subscribe

#### Type declaration

| Name | Type |
| :------ | :------ |
| `maxAwaitDurationMs?` | `number` |
| `maxMessagesCount?` | `number` |
| `metadata?` | [`KeyValueType`](purista_dapr_sdk.md#keyvaluetype) |
| `route?` | `string` \| [`DaprPubSubRouteType`](purista_dapr_sdk.md#daprpubsubroutetype) |

#### Defined in

[dapr-sdk/src/types/pubsub/BulkSubscribeOptions.type.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/BulkSubscribeOptions.type.ts#L20)

___

### BulkSubscribeResponse

Ƭ **BulkSubscribeResponse**: `Object`

BulkSubscribeResponse is the response for a bulk subscribe request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `statuses` | [`BulkSubscribeResponseEntry`](purista_dapr_sdk.md#bulksubscriberesponseentry)[] |

#### Defined in

[dapr-sdk/src/types/pubsub/BulkSubscribeResponse.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/BulkSubscribeResponse.type.ts#L19)

___

### BulkSubscribeResponseEntry

Ƭ **BulkSubscribeResponseEntry**: `Object`

BulkSubscribeResponseEntry is the response entry for a bulk subscribe request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entryId` | `string` |
| `status` | [`DaprPubSubStatusEnum`](../enums/purista_dapr_sdk.DaprPubSubStatusEnum.md) |

#### Defined in

[dapr-sdk/src/types/pubsub/BulkSubscribeResponseEntry.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/BulkSubscribeResponseEntry.type.ts#L19)

___

### DaprClientConfig

Ƭ **DaprClientConfig**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appPrefix?` | `string` | The prefix to generate the app-ID of other services. **`Default`** `app-` |
| `daprApiToken?` | `string` | API token to authenticate with Dapr. See https://docs.dapr.io/operations/security/api-token/. |
| `daprApiVersion` | `string` | The Dapr api version **`Default`** ```ts v1.0 ``` |
| `daprHost?` | `string` | Host location of the Dapr sidecar. **`Default`** ```ts 127.0.0.1 ``` |
| `daprPort?` | `string` | Port of the Dapr sidecar. **`Default`** ```ts 3500. ``` |
| `isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. **`Default`** ```ts true ``` |
| `pubSubName?` | `string` | The PubSub to be used for event messages **`Default`** ```ts pubsub ``` |

#### Defined in

[dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L1)

___

### DaprConfigStoreConfig

Ƭ **DaprConfigStoreConfig**: `Object`

Dapr config store configuration

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientConfig?` | [`DaprClientConfig`](purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `configStoreName?` | `string` | The name of the config store |

#### Defined in

[dapr-sdk/src/DaprConfigStore/types/DaprConfigStoreConfig.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/types/DaprConfigStoreConfig.ts#L6)

___

### DaprEventBridgeConfig

Ƭ **DaprEventBridgeConfig**: [`Prettify`](purista_core.md#prettify)\<[`HttpEventBridgeConfig`](purista_base_http_bridge.md#httpeventbridgeconfig) & \{ `clientConfig?`: [`DaprClientConfig`](purista_dapr_sdk.md#daprclientconfig)  }\>

#### Defined in

[dapr-sdk/src/DaprEventBridge/types/DaprEventBridgeConfig.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/types/DaprEventBridgeConfig.ts#L6)

___

### DaprPubSubRouteType

Ƭ **DaprPubSubRouteType**: `Object`

DaprPubSubRouteType Defines the rules for a route

#### Type declaration

| Name | Type |
| :------ | :------ |
| `default?` | `string` |
| `rules?` | [`DaprPubSubRuleType`](purista_dapr_sdk.md#daprpubsubruletype)[] |

#### Defined in

[dapr-sdk/src/types/pubsub/DaprPubSubRouteType.type.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/DaprPubSubRouteType.type.ts#L20)

___

### DaprPubSubRuleType

Ƭ **DaprPubSubRuleType**: `Object`

DaprPubSubRuleType defines a rule set

#### Type declaration

| Name | Type |
| :------ | :------ |
| `match` | `string` |
| `path` | `string` |

#### Defined in

[dapr-sdk/src/types/pubsub/DaprPubSubRuleType.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/DaprPubSubRuleType.type.ts#L19)

___

### DaprPubSubType

Ƭ **DaprPubSubType**: `Object`

DaprPubSubType is the Type used by the Dapr API to interface with its PubSub component

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bulkSubscribe?` | [`BulkSubscribeConfig`](purista_dapr_sdk.md#bulksubscribeconfig) |
| `deadLetterTopic?` | `string` |
| `metadata?` | [`KeyValueType`](purista_dapr_sdk.md#keyvaluetype) |
| `pubsubname` | `string` |
| `route?` | `string` |
| `routes?` | [`DaprPubSubRouteType`](purista_dapr_sdk.md#daprpubsubroutetype) |
| `topic` | `string` |

#### Defined in

[dapr-sdk/src/types/pubsub/DaprPubSub.type.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/DaprPubSub.type.ts#L22)

___

### DaprSecretStoreConfig

Ƭ **DaprSecretStoreConfig**: `Object`

Dapr secret store configuration

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientConfig?` | [`DaprClientConfig`](purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `metadata?` | \{ `namespace?`: `string`  } | Dapr secret store metadata |
| `metadata.namespace?` | `string` | In case of deploying into namespace other than default, the namespace (e.g. production) must be set |
| `secretStoreName?` | `string` | The name of the secret store |

#### Defined in

[dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts#L6)

___

### DaprStateStoreConfig

Ƭ **DaprStateStoreConfig**: `Object`

Dapr state store configuration

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientConfig?` | [`DaprClientConfig`](purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `stateStoreName?` | `string` | The name of the state store |

#### Defined in

[dapr-sdk/src/DaprStateStore/types/DaprStateStoreConfig.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/types/DaprStateStoreConfig.ts#L6)

___

### KeyValueType

Ƭ **KeyValueType**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[dapr-sdk/src/types/pubsub/KeyValue.type.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/KeyValue.type.ts#L14)

___

### PubSubBulkPublishApiResponse

Ƭ **PubSubBulkPublishApiResponse**: `Object`

Response from a bulk publish API request.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failedEntries` | `PubSubBulkPublishApiResponseStatus`[] |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubBulkPublishApiResponse.type.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubBulkPublishApiResponse.type.ts#L22)

___

### PubSubBulkPublishEntry

Ƭ **PubSubBulkPublishEntry**: `Object`

PubSubBulkPublishEntry defines an entry in a bulk publish request.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `entryID` | `string` |
| `event` | `object` \| `string` |
| `metadata` | [`KeyValueType`](purista_dapr_sdk.md#keyvaluetype) |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubBulkPublishEntry.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubBulkPublishEntry.type.ts#L19)

___

### PubSubBulkPublishMessage

Ƭ **PubSubBulkPublishMessage**: `PubSubBulkPublishMessageExplicit` \| `object` \| `string`

PubSubBulkPublishMessage is a message in a bulk publish request.

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubBulkPublishMessage.type.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubBulkPublishMessage.type.ts#L26)

___

### PubSubBulkPublishResponse

Ƭ **PubSubBulkPublishResponse**: `Object`

PubSubBulkPublishResponse defines the response from a bulk publish request.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failedMessages` | `PubSubBulkPublishResponseFailedEntry`[] |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubBulkPublishResponse.type.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubBulkPublishResponse.type.ts#L24)

___

### PubSubPublishOptions

Ƭ **PubSubPublishOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `contentType?` | `string` | The content type of the message. This is optional and will be inferred from the payload if not provided. |
| `metadata?` | [`KeyValueType`](purista_dapr_sdk.md#keyvaluetype) | Metadata to be passed to the publish operation. |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts#L16)

___

### PubSubPublishResponseType

Ƭ **PubSubPublishResponseType**: `Object`

PubSubPublishResponseType defines the response from a publish.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubPublishResponse.type.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubPublishResponse.type.ts#L17)

___

### PubSubSubscriptionOptionsType

Ƭ **PubSubSubscriptionOptionsType**: `Object`

PubSubSubscriptionOptionsType defines the options we can pass while subscribing

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bulkSubscribe?` | [`BulkSubscribeConfig`](purista_dapr_sdk.md#bulksubscribeconfig) |
| `callback?` | [`TypeDaprPubSubCallback`](purista_dapr_sdk.md#typedaprpubsubcallback) |
| `deadLetterCallback?` | [`TypeDaprPubSubCallback`](purista_dapr_sdk.md#typedaprpubsubcallback) |
| `deadLetterTopic?` | `string` |
| `metadata?` | [`KeyValueType`](purista_dapr_sdk.md#keyvaluetype) |
| `route?` | `string` \| [`DaprPubSubRouteType`](purista_dapr_sdk.md#daprpubsubroutetype) |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L22)

___

### PubSubSubscriptionTopicRouteType

Ƭ **PubSubSubscriptionTopicRouteType**: `Object`

This defines the routeName object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventHandlers` | [`TypeDaprPubSubCallback`](purista_dapr_sdk.md#typedaprpubsubcallback)[] |
| `path` | `string` |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubSubscriptionTopicRoute.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionTopicRoute.type.ts#L19)

___

### PubSubSubscriptionTopicRoutesType

Ƭ **PubSubSubscriptionTopicRoutesType**: `Object`

This defines the routes object

#### Index signature

▪ [key: `string`]: [`PubSubSubscriptionTopicRouteType`](purista_dapr_sdk.md#pubsubsubscriptiontopicroutetype)

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubSubscriptionTopicRoutes.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionTopicRoutes.type.ts#L19)

___

### PubSubSubscriptionTopicType

Ƭ **PubSubSubscriptionTopicType**: `Object`

This defines the topicName object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dapr` | [`DaprPubSubType`](purista_dapr_sdk.md#daprpubsubtype) |
| `routes` | [`PubSubSubscriptionTopicRoutesType`](purista_dapr_sdk.md#pubsubsubscriptiontopicroutestype) |

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubSubscriptionTopic.type.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionTopic.type.ts#L20)

___

### PubSubSubscriptionType

Ƭ **PubSubSubscriptionType**: `Object`

This defines the pubsubName object

#### Index signature

▪ [key: `string`]: [`PubSubSubscriptionTopicType`](purista_dapr_sdk.md#pubsubsubscriptiontopictype)

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubSubscription.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscription.type.ts#L19)

___

### PubSubSubscriptionsType

Ƭ **PubSubSubscriptionsType**: `Object`

This defines the entire object containing pubsubNames

#### Index signature

▪ [key: `string`]: [`PubSubSubscriptionType`](purista_dapr_sdk.md#pubsubsubscriptiontype)

#### Defined in

[dapr-sdk/src/types/pubsub/PubSubSubscriptions.type.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptions.type.ts#L19)

___

### TypeDaprPubSubCallback

Ƭ **TypeDaprPubSubCallback**: (`data`: `any`, `headers`: `object`) => `Promise`\<`any` \| `void`\>

#### Type declaration

▸ (`data`, `headers`): `Promise`\<`any` \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `headers` | `object` |

##### Returns

`Promise`\<`any` \| `void`\>

#### Defined in

[dapr-sdk/src/types/pubsub/DaprPubSubCallback.type.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/pubsub/DaprPubSubCallback.type.ts#L14)

## Variables

### DAPR\_API\_VERSION

• `Const` **DAPR\_API\_VERSION**: ``"v1.0"``

#### Defined in

[dapr-sdk/src/types/constants.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/constants.ts#L4)

___

### DEFAULT\_DAPR\_HOST

• `Const` **DEFAULT\_DAPR\_HOST**: ``"http://127.0.0.1"``

#### Defined in

[dapr-sdk/src/types/constants.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/constants.ts#L2)

___

### DEFAULT\_DAPR\_PORT

• `Const` **DEFAULT\_DAPR\_PORT**: ``"3500"``

#### Defined in

[dapr-sdk/src/types/constants.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/types/constants.ts#L1)

___

### puristaVersion

• `Const` **puristaVersion**: ``"1.9.1"``

#### Defined in

[dapr-sdk/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/version.ts#L1)

## Functions

### configRoute

▸ **configRoute**(`this`, `c`): `Promise`\<`Response`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpEventBridge`](../classes/purista_base_http_bridge.HttpEventBridge.md)\<[`HttpEventBridgeConfig`](purista_base_http_bridge.md#httpeventbridgeconfig)\> |
| `c` | `Context`\<`any`, `any`, {}\> |

#### Returns

`Promise`\<`Response`\>

#### Defined in

[dapr-sdk/src/DaprEventBridge/routes/config.impl.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/routes/config.impl.ts#L3)

___

### getDefaultClientConfig

▸ **getDefaultClientConfig**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `appPrefix` | `string` |
| `daprApiToken` | `undefined` |
| `daprApiVersion` | `string` |
| `daprHost` | `string` |
| `daprPort` | `string` |
| `isKeepAlive` | `boolean` |
| `pubSubName` | `string` |

#### Defined in

[dapr-sdk/src/DaprClient/getDefaultClientConfig.impl.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/getDefaultClientConfig.impl.ts#L3)

___

### getDefaultConfig

▸ **getDefaultConfig**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `apiPrefix` | `string` |
| `clientConfig` | \{ `appPrefix`: `string` = 'app-'; `daprApiToken`: `undefined` = undefined; `daprApiVersion`: `string` = DAPR\_API\_VERSION; `daprHost`: `string` ; `daprPort`: `string` ; `isKeepAlive`: `boolean` = true; `pubSubName`: `string` = 'pubsub' } |
| `clientConfig.appPrefix` | `string` |
| `clientConfig.daprApiToken` | `undefined` |
| `clientConfig.daprApiVersion` | `string` |
| `clientConfig.daprHost` | `string` |
| `clientConfig.daprPort` | `string` |
| `clientConfig.isKeepAlive` | `boolean` |
| `clientConfig.pubSubName` | `string` |
| `commandPayloadAsCloudEvent` | `boolean` |
| `enableRestApiExpose` | `boolean` |
| `name` | `string` |
| `pathPrefix` | `string` |
| `serverHost` | `string` |
| `serverPort` | `number` |
| `subscriptionPayloadAsCloudEvent` | `boolean` |

#### Defined in

[dapr-sdk/src/DaprEventBridge/getDefaultConfig.impl.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/getDefaultConfig.impl.ts#L3)

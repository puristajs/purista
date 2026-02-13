[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/dapr-sdk

# @purista/k8s-sdk

SDK and helper to run PURISTA services in Kubernetes.

Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.

```typescript
// src/index.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import {
  DefaultConfigStore,
  DefaultEventBridge,
  DefaultSecretStore,
  DefaultStateStore,
  gracefulShutdown,
  initLogger,
} from '@purista/core'
import { getHttpServer } from '@purista/k8s-sdk'

import { theServiceV1Service } from './service/theService/v1/'

const main = async () => {
  // create a logger
  const logger = initLogger()

  // optional: set up opentelemetry if you like to use it
  const exporter = new OTLPTraceExporter({
    url: `http://localhost:14268/api/traces`,
  })
  const spanProcessor = new SimpleSpanProcessor(exporter)

  // optional: set up stores if they are needed for your service
  const secretStore = new DefaultSecretStore({ logger })
  const configStore = new DefaultConfigStore({ logger })
  const stateStore = new DefaultStateStore({ logger })

  // set up the eventbridge and start the event bridge
  const eventBridge = new DefaultEventBridge({}, { spanProcessor })
  await eventBridge.start()

  // set up the service
  const theService = await theServiceV1Service.getInstance(eventBridge, {
    spanProcessor,
    configStore,
    secretStore,
    stateStore,
  })
  await theService.start()

  // create http server
  const server = getHttpServer({
    logger,
    // check event bridge health if /healthz endpoint is called
    healthFn: () => eventBridge.isHealthy(),
    // optional: expose the commands if they are defined to have url endpoint
    services: theService,
    // optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]
    // defaults to /api
    apiMountPath: '/api',
  })

  // register shut down methods
  gracefulShutdown(logger, [
    // start with the event bridge to no longer accept incoming messages
    eventBridge,
    // optional: shut down the service
    theService,
    // optional: shut down the secret store
    secretStore,
    // optional: shut down the config store
    configStore,
    // optional: shut down the state store
    stateStore,
    // stop the http server
    server,
  ])

  // start the http server
  // defaults to port 8080
  // optional: you can set the port in the optional parameter of this method
  await server.start()
}

main()
```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

SDK and helper to run PURISTA services in Kubernetes.

This package provides the Dapr event bridge and adapters for secret, state and config stores provided by Dapr.

Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.

## Example

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

## Enumerations

- [DaprPubSubStatusEnum](enumerations/DaprPubSubStatusEnum.md)

## Classes

- [DaprClient](classes/DaprClient.md)
- [DaprConfigStore](classes/DaprConfigStore.md)
- [DaprSecretStore](classes/DaprSecretStore.md)
- [DaprStateStore](classes/DaprStateStore.md)

## Type Aliases

- [BulkSubscribeConfig](type-aliases/BulkSubscribeConfig.md)
- [BulkSubscribeOptions](type-aliases/BulkSubscribeOptions.md)
- [BulkSubscribeResponse](type-aliases/BulkSubscribeResponse.md)
- [BulkSubscribeResponseEntry](type-aliases/BulkSubscribeResponseEntry.md)
- [DaprClientConfig](type-aliases/DaprClientConfig.md)
- [DaprConfigStoreConfig](type-aliases/DaprConfigStoreConfig.md)
- [DaprEventBridgeConfig](type-aliases/DaprEventBridgeConfig.md)
- [DaprPubSubRouteType](type-aliases/DaprPubSubRouteType.md)
- [DaprPubSubRuleType](type-aliases/DaprPubSubRuleType.md)
- [DaprPubSubType](type-aliases/DaprPubSubType.md)
- [DaprSecretStoreConfig](type-aliases/DaprSecretStoreConfig.md)
- [DaprStateStoreConfig](type-aliases/DaprStateStoreConfig.md)
- [KeyValueType](type-aliases/KeyValueType.md)
- [PubSubBulkPublishApiResponse](type-aliases/PubSubBulkPublishApiResponse.md)
- [PubSubBulkPublishEntry](type-aliases/PubSubBulkPublishEntry.md)
- [PubSubBulkPublishMessage](type-aliases/PubSubBulkPublishMessage.md)
- [PubSubBulkPublishResponse](type-aliases/PubSubBulkPublishResponse.md)
- [PubSubPublishOptions](type-aliases/PubSubPublishOptions.md)
- [PubSubPublishResponseType](type-aliases/PubSubPublishResponseType.md)
- [PubSubSubscriptionOptionsType](type-aliases/PubSubSubscriptionOptionsType.md)
- [PubSubSubscriptionsType](type-aliases/PubSubSubscriptionsType.md)
- [PubSubSubscriptionTopicRoutesType](type-aliases/PubSubSubscriptionTopicRoutesType.md)
- [PubSubSubscriptionTopicRouteType](type-aliases/PubSubSubscriptionTopicRouteType.md)
- [PubSubSubscriptionTopicType](type-aliases/PubSubSubscriptionTopicType.md)
- [PubSubSubscriptionType](type-aliases/PubSubSubscriptionType.md)
- [TypeDaprPubSubCallback](type-aliases/TypeDaprPubSubCallback.md)

## Variables

- [configRoute](variables/configRoute.md)
- [DAPR\_API\_VERSION](variables/DAPR_API_VERSION.md)
- [DEFAULT\_DAPR\_HOST](variables/DEFAULT_DAPR_HOST.md)
- [DEFAULT\_DAPR\_PORT](variables/DEFAULT_DAPR_PORT.md)
- [puristaVersion](variables/puristaVersion.md)

## Functions

- [getDefaultClientConfig](functions/getDefaultClientConfig.md)
- [getDefaultConfig](functions/getDefaultConfig.md)

## Event bridge

- [DaprEventBridge](classes/DaprEventBridge.md)

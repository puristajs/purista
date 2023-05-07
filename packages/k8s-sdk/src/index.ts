/**
 *
 * SDK and helper to run PURISTA services in Kubernetes.
 *
 * Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.
 *
 * @example ```typescript
 * // src/index.ts
 * import { serve } from '@hono/node-server'
 * import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
 * import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
 * import {
 *   DefaultConfigStore,
 *   DefaultEventBridge,
 *   DefaultSecretStore,
 *   DefaultStateStore,
 *   gracefulShutdown,
 *   initLogger,
 * } from '@purista/core'
 * import { getHttpServer } from '@purista/k8s-sdk'
 *
 * import { theServiceV1Service } from './service/theService/v1/'
 *
 * const main = async () => {
 *   // create a logger
 *   const logger = initLogger()
 *
 *   // optional: set up opentelemetry if you like to use it
 *   const exporter = new OTLPTraceExporter({
 *     url: `http://localhost:14268/api/traces`,
 *   })
 *   const spanProcessor = new SimpleSpanProcessor(exporter)
 *
 *   // optional: set up stores if they are needed for your service
 *   const secretStore = new DefaultSecretStore({ logger })
 *   const configStore = new DefaultConfigStore({ logger })
 *   const stateStore = new DefaultStateStore({ logger })
 *
 *   // set up the eventbridge and start the event bridge
 *   const eventBridge = new DefaultEventBridge({ spanProcessor })
 *   await eventBridge.start()
 *
 *   // set up the service
 *   const theService = theServiceV1Service.getInstance(eventBridge, {
 *     spanProcessor,
 *     configStore,
 *     secretStore,
 *     stateStore,
 *   })
 *   await theService.start()
 *
 *   // create http server
 *   const app = getHttpServer({
 *     logger,
 *     // check event bridge health if /healthz endpoint is called
 *     healthFn: () => eventBridge.isHealthy(),
 *     // optional: expose the commands if they are defined to have url endpoint
 *     services: theService,
 *     // optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]
 *     // defaults to /api
 *     apiMountPath: '/api',
 *   })
 *
 *    // start the http server
 *    // defaults to port 3000
 *    // optional: you can set the port in the optional parameter of this method
 *    const server = serve({
 *      fetch: app.fetch,
 *    })
 *
 *   // register shut down methods
 *   gracefulShutdown(logger, [
 *     // begin with the event bridge to no longer accept incoming messages
 *     eventBridge,
 *     // optional: shut down the service
 *     theService,
 *     // optional: shut down the secret store
 *     secretStore,
 *     // optional: shut down the config store
 *     configStore,
 *     // optional: shut down the state store
 *     stateStore,
 *     // stop the http server
 *     {
 *        name: 'httpserver',
 *        destroy: async () => {
 *        server.closeIdleConnections()
 *        server.close()
 *     },
 *  },,
 *   ])
 * }
 *
 * main()
 *```
 *
 * @module
 */
declare global {
  interface FetchEvent extends Event {
    readonly request: Request
    respondWith(response: Promise<Response> | Response): Promise<Response>
  }
  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void
    passThroughOnException(): void
  }
}

export * from './addServiceEndpoints.impl'
export * from './getHttpServer.impl'
export * from './types'

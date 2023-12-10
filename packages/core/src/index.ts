/* eslint-disable simple-import-sort/exports */
/**
 * This is the main package of PURISTA.
 *
 * A backend framework for building message based domain services.
 *
 * This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.
 *
 * It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, OpenApi documentation (swagger).
 *
 * It contains the builders, classes & types and some helper functions.
 * For easier testing of commands and subscriptions, the package contains different mock creation helper based on [sinon](https://sinonjs.org)
 *
 * Learn PURIST at [purista.dev](https://purista.dev)
 *
 * @module
 */

export * from './version.js'
export * from './core/index.js'
export * from './helper/index.js'
export * from './CommandDefinitionBuilder/index.js'
export * from './SubscriptionDefinitionBuilder/index.js'
export * from './DefaultConfigStore/index.js'
export * from './DefaultEventBridge/index.js'
export * from './HttpClient/index.js'
export * from './DefaultSecretStore/index.js'
export * from './DefaultStateStore/index.js'
export * from './ServiceBuilder/index.js'
export * from './mocks/index.js'
export * from './zodOpenApi/index.js'

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

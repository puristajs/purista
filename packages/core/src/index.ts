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
 * For easier testing of commands and subscriptions, the package contains different mock creation helper based on [jest](https://jestjs.io) and [sinon](https://sinonjs.org)
 *
 * Learn PURIST at [purista.dev](https://purista.dev)
 *
 * @module
 */

export * from './version'
export * from './core'
export * from './helper'
export * from './CommandDefinitionBuilder'
export * from './SubscriptionDefinitionBuilder'
export * from './DefaultConfigStore'
export * from './DefaultEventBridge'
export * from './HttpClient'
export * from './HttpEventBridge'
export * from './DefaultSecretStore'
export * from './DefaultStateStore'
export * from './ServiceBuilder'
export * from './mocks'
export * from './zodOpenApi'

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

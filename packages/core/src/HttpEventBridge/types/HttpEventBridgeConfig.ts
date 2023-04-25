import { Server } from 'node:http'

export type HttpEventBridgeConfig = {
  /** name of the bridge */
  name?: string

  /**
   * The serve function is depending on the runtime.
   *
   * - Bun: `Bun.serve`
   * - Node.js: `serve` function from additional package `@purista/hono-node-server`
   * - Deno: `serve` function from package `https://deno.land/std/http/server.ts`
   *
   * @see https://hono.dev
   */
  serve: (options: {
    fetch: (request: Request) => Promise<unknown> | unknown
    port?: number
    hostname?: string
  }) => Server

  /**
   * Host of the server.
   */
  serverHost?: string

  /**
   * Port of the server.
   */
  serverPort?: number

  /**
   * the prefix to be used for exposing commands as endpoints expecting a event bus message
   */
  pathPrefix?: string

  /**
   * the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion
   * needs to `enableRestApiExpose` set to `true`
   */
  apiPrefix?: string

  /**
   * expose commands as regular REST endpoints when they are configured as endpoints
   */
  enableRestApiExpose?: boolean

  /**
   * subscription invocations are wrapped in CloudEvent
   *
   * @link https://github.com/cloudevents/spec/tree/v1.0
   */
  subscriptionPayloadAsCloudEvent?: boolean

  /**
   * command invocations are wrapped in CloudEvent
   *
   * @link https://github.com/cloudevents/spec/tree/v1.0
   */
  commandPayloadAsCloudEvent?: boolean
}

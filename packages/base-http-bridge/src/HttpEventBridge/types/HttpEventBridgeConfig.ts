import type { Server } from 'node:http'
import type { Http2SecureServer, Http2Server } from 'node:http2'

export type HttpEventBridgeConfig = {
  /**
   * name of the bridge
   *
   * @default HttpEventBridge
   * */
  name?: string

  /**
   * The serve function is depending on the runtime.
   *
   * - Bun: `Bun.serve`
   * - Node.js: `serve` function from additional package `@hono/hono-node-server`
   * - Deno: `serve` function from package `https://deno.land/std/http/server.ts`
   *
   * @see https://hono.dev
   */
  serve: (options: {
    fetch: (request: Request) => Promise<unknown> | unknown
    port?: number
    hostname?: string
  }) => Server | Http2Server | Http2SecureServer

  /**
   * Host of the server.
   *
   * @default 127.0.0.1
   */
  serverHost?: string

  /**
   * Port of the server.
   *
   * @default 8080
   */
  serverPort?: number

  /**
   * the prefix to be used for exposing commands as endpoints expecting a event bus message
   *
   * @default purista
   */
  pathPrefix?: string

  /**
   * the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion
   * needs to `enableRestApiExpose` set to `true`
   *
   * @default /api
   */
  apiPrefix?: string

  /**
   * expose commands as regular REST endpoints when they are configured as endpoints
   *
   * @default true
   */
  enableRestApiExpose?: boolean

  /**
   * subscription invocations are wrapped in CloudEvent
   *
   * @link https://github.com/cloudevents/spec/tree/v1.0
   *
   * @default false
   */
  subscriptionPayloadAsCloudEvent?: boolean

  /**
   * command invocations are wrapped in CloudEvent
   *
   * @link https://github.com/cloudevents/spec/tree/v1.0
   *
   * @default false
   */
  commandPayloadAsCloudEvent?: boolean
  /**
   * enable HTTP compression in web server
   * @default false
   */
  enableHttpCompression?: boolean
}

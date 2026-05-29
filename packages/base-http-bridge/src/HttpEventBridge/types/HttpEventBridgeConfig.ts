import type { Server } from 'node:http'
import type { Http2SecureServer, Http2Server } from 'node:http2'

/**
 * Configuration for HTTP event bridges that host PURISTA command/subscription routes.
 */
export type HttpEventBridgeConfig = {
	/**
	 * Logger and telemetry name for the bridge instance.
	 */
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
	 * Prefix for internal command/subscription endpoints that exchange full PURISTA messages.
	 *
	 * @default purista
	 */
	pathPrefix?: string

	/**
	 * Prefix for public REST command projections.
	 *
	 * The command definition must declare HTTP exposure and `enableRestApiExpose`
	 * must be `true`.
	 *
	 * @default /api
	 */
	apiPrefix?: string

	/**
	 * Exposes commands as regular REST endpoints when command metadata declares HTTP exposure.
	 *
	 * @default true
	 */
	enableRestApiExpose?: boolean

	/**
	 * Whether subscription invocations arrive wrapped as CloudEvents.
	 *
	 * CloudEvents specification v1.0: https://github.com/cloudevents/spec/tree/v1.0
	 *
	 * @default false
	 */
	subscriptionPayloadAsCloudEvent?: boolean

	/**
	 * Whether internal command invocations arrive wrapped as CloudEvents.
	 *
	 * CloudEvents specification v1.0: https://github.com/cloudevents/spec/tree/v1.0
	 *
	 * @default false
	 */
	commandPayloadAsCloudEvent?: boolean
	/**
	 * Enables HTTP compression middleware for the hosted Hono server.
	 * @default true
	 */
	enableHttpCompression?: boolean
}

import type { Logger, Service } from '@purista/core'

/**
 * Configuration for the Kubernetes-oriented Hono HTTP helper.
 *
 * The helper is intentionally small: it creates an app with `/healthz` and,
 * unless disabled, exposes command HTTP projections from the provided services.
 */
export type GetHttpServerConfig = {
	/** Logger used for request, health and process error reporting. */
	logger: Logger
	/** Hostname used in tracing and logging. Defaults to `process.env.HOSTNAME`. */
	hostname?: string
	/** Health probe callback. Return `true` only when the process can serve traffic. */
	healthFn: () => Promise<boolean>
	/** Service or services whose HTTP-exposed commands should be added as endpoints. */
	services?: Service | Service[]
	/** Disables automatic endpoint registration for commands marked as HTTP-exposed. */
	disableEndpointExposing?: boolean
	/** Base path for generated command endpoints. @default /api */
	apiMountPath?: string
	/** Enables HTTP compression middleware. @default true */
	enableHttpCompression?: boolean
}

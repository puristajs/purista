import type { Service } from '@purista/core'

/**
 * Health callback for the Hono HTTP service.
 *
 * Resolve to report healthy. Throw to make the health endpoint return an
 * internal server error problem response.
 */
export type HealthFunction<T extends Service> = (this: T) => Promise<void>

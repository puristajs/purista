import { z } from 'zod'
import type { SandboxDriver } from '../../../types/SandboxDriver.js'

/**
 * Configuration schema for the Sandbox Service.
 * @group Schemas
 */
export const SandboxServiceConfigSchema = z.object({
	/**
	 * The driver to use for sandboxing.
	 *
	 * This is optional in the config because it can be injected as a
	 * dynamic resource during service initialization.
	 */
	driver: z.custom<SandboxDriver>(data => !!(data as SandboxDriver)?.name).optional(),
})

/**
 * Inferred type for Sandbox service configuration.
 */
export type SandboxServiceConfig = z.infer<typeof SandboxServiceConfigSchema>

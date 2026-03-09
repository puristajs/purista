import { ServiceBuilder } from '@purista/core'
import type { SandboxDriver } from '../../../types/SandboxDriver.js'
import type { SandboxRegistry } from './resources/SandboxRegistry.js'
import { SandboxService } from './SandboxService.js'
import { SandboxServiceConfigSchema } from './SandboxServiceConfig.js'

/**
 * sandboxServiceBuilder
 *
 * The main builder for the Sandbox Service. This service manages the lifecycle
 * and execution of multi-tenant sandboxes.
 *
 * Resources:
 * - `driver`: The virtualization engine (Docker, Lima, etc.)
 * - `registry`: The persistence layer for sandbox metadata
 */
export const sandboxServiceBuilder = new ServiceBuilder({
	serviceName: 'Sandbox',
	serviceVersion: '1',
	serviceDescription: 'A secure sandboxing service for agents and users',
})
	.setCustomClass(SandboxService)
	.setConfigSchema(SandboxServiceConfigSchema)
	.defineResource<'driver', SandboxDriver>()
	.defineResource<'registry', SandboxRegistry>()

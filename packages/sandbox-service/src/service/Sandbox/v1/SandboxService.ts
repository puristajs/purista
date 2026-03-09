import { Service } from '@purista/core'
import type { SandboxDriver } from '../../../types/SandboxDriver.js'
import type { SandboxRegistry } from './resources/SandboxRegistry.js'

/**
 * Custom Sandbox service with startup reconciliation.
 *
 * This runs once on service start and is intentionally implemented in service
 * lifecycle (not as subscription) because subscriptions are event-triggered.
 */
export class SandboxService extends Service {
	private get sandboxResources() {
		return this.resources as { driver: SandboxDriver; registry: SandboxRegistry }
	}

	override async start() {
		await super.start()

		this.logger.info('Starting sandbox reconciliation...')
		try {
			const runningSandboxes = await this.sandboxResources.driver.scanRunningSandboxes()
			this.logger.info(`Found ${runningSandboxes.length} running sandboxes.`)
			await this.sandboxResources.registry.reconcile(runningSandboxes)
			this.logger.info('Sandbox reconciliation completed.')
		} catch (error) {
			this.logger.error({ err: error }, 'Sandbox reconciliation failed')
		}
	}
}

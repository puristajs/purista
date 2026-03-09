import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'

/**
 * reconcileOnStartupSubscriptionBuilder
 *
 * Passive listener that triggers on service initialization.
 * It provides self-healing capabilities by scanning the underlying virtualization
 * layer (via the driver) and ensuring the 'registry' (state store) is in sync.
 *
 * Benefits:
 * - Recovers sandbox tracking after a service crash or restart.
 * - Ensures multi-tenant metadata is restored from infrastructure labels.
 */
export const reconcileOnStartupSubscriptionBuilder: any = sandboxServiceBuilder
	.getSubscriptionBuilder('reconcileOnStartup', 'Reconciles Docker containers on service startup')
	.subscribeToEvent('ServiceStarted')
	.setSubscriptionFunction(async function (context: any) {
		context.logger.info('Starting sandbox reconciliation...')

		try {
			// 1. Scan running containers via the driver
			const runningSandboxes = await context.resources.driver.scanRunningSandboxes()

			context.logger.info(`Found ${runningSandboxes.length} running sandboxes.`)

			// 2. Synchronize with the registry
			await context.resources.registry.reconcile(runningSandboxes)

			context.logger.info('Sandbox reconciliation completed.')
		} catch (error: any) {
			// Subscriptions should handle errors to prevent breaking the event bridge flow
			context.logger.error(`Sandbox reconciliation failed: ${error.message}`)
		}
	})

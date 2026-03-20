import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { resolveSandboxOwnerFromMessage } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { EnsureSandboxInputSchema, EnsureSandboxOutputSchema } from './schema.js'

export const ensureSandboxCommandBuilder: any = sandboxServiceBuilder
	.getCommandBuilder('ensureSandbox', 'Returns an existing healthy sandbox for owner tuple or creates one if missing')
	.addPayloadSchema(EnsureSandboxInputSchema)
	.addOutputSchema(EnsureSandboxOutputSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox/ensure')
	.setCommandFunction(async function (context: any, payload: z.infer<typeof EnsureSandboxInputSchema>) {
		const owner = resolveSandboxOwnerFromMessage(context, payload)
		const existing = await context.resources.registry.findByOwner(owner)

		if (existing) {
			const health = await context.resources.driver.executeBash({
				sandboxId: existing.sandboxId,
				command: 'echo "__purista_health__"',
			})
			if (health.exitCode === 0) {
				return {
					sandboxId: existing.sandboxId,
					status: 'ready',
					created: false,
				}
			}

			context.logger.warn(
				{ sandboxId: existing.sandboxId, stderr: health.stderr, exitCode: health.exitCode },
				'Sandbox health check failed, recreating sandbox.',
			)
			try {
				await context.resources.driver.destroySandbox({ sandboxId: existing.sandboxId })
			} catch (error) {
				context.logger.warn({ err: error, sandboxId: existing.sandboxId }, 'Failed to destroy unhealthy sandbox.')
			}
			await context.resources.registry.unregister(existing.sandboxId)
		}

		const sandboxId = randomUUID()
		const created = await context.resources.driver.createSandbox({
			...owner,
			gitConfig: payload.gitConfig,
			sandboxId,
		})

		await context.resources.registry.register({
			...owner,
			sandboxId,
			containerName: created.containerName,
			createdAt: Date.now(),
			gitConfigured: !!payload.gitConfig,
		})

		return {
			sandboxId,
			status: 'starting',
			created: true,
		}
	})

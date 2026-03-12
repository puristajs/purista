import { randomUUID } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { EnsureSandboxInputSchema, EnsureSandboxOutputSchema } from './schema.js'

const SandboxStartedEventSchema = z.object({
	sandboxId: z.string(),
	organizationId: z.string(),
	projectId: z.string(),
	userId: z.string(),
})

export const ensureSandboxCommandBuilder: any = sandboxServiceBuilder
	.getCommandBuilder('ensureSandbox', 'Returns an existing healthy sandbox for owner tuple or creates one if missing')
	.addPayloadSchema(EnsureSandboxInputSchema)
	.addOutputSchema(EnsureSandboxOutputSchema)
	.canEmit('SandboxStarted', SandboxStartedEventSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox/ensure')
	.setCommandFunction(async function (context: any, payload: z.infer<typeof EnsureSandboxInputSchema>) {
		const existing = await context.resources.registry.findByOwner({
			organizationId: payload.organizationId,
			projectId: payload.projectId,
			userId: payload.userId,
		})

		if (existing) {
			const health = await context.resources.driver.executeBash({
				sandboxId: existing.sandboxId,
				command: 'echo "__purista_health__"',
			})
			if (health.exitCode !== 0) {
				throw new HandledError(
					StatusCode.InternalServerError,
					`Sandbox ${existing.sandboxId} exists but health check failed`,
					{ stderr: health.stderr, exitCode: health.exitCode },
				)
			}
			return {
				sandboxId: existing.sandboxId,
				status: 'ready',
				created: false,
			}
		}

		const sandboxId = randomUUID()
		const created = await context.resources.driver.createSandbox({
			...payload,
			sandboxId,
		})

		await context.resources.registry.register({
			...payload,
			sandboxId,
			containerName: created.containerName,
			createdAt: Date.now(),
		})

		await context.emit('SandboxStarted', {
			sandboxId,
			organizationId: payload.organizationId,
			projectId: payload.projectId,
			userId: payload.userId,
		})

		return {
			sandboxId,
			status: 'starting',
			created: true,
		}
	})

import { createHash } from 'node:crypto'
import type { z } from 'zod'
import { createSanitizedErrorDiagnostics } from '../../../../../../runtime/errorDiagnostics.js'
import { resolveSandboxOwnerFromMessage } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { EnsureSandboxInputSchema, EnsureSandboxOutputSchema } from './schema.js'

const getDeterministicSandboxId = (input: {
	organizationId: string
	projectId: string
	userId: string
	scopePart: string
}) => {
	const hash = createHash('sha256')
		.update(`${input.organizationId}:${input.projectId}:${input.userId}:${input.scopePart}`)
		.digest('hex')
	return `sb-${hash.slice(0, 32)}`
}

const summarizeTextForLog = (value: string | undefined) => {
	if (!value) {
		return undefined
	}
	return {
		bytes: Buffer.byteLength(value, 'utf8'),
		sha256: createHash('sha256').update(value).digest('hex').slice(0, 16),
	}
}

export const ensureSandboxCommandBuilder: any = sandboxServiceBuilder
	.getCommandBuilder('ensureSandbox', 'Returns an existing healthy sandbox for owner tuple or creates one if missing')
	.addPayloadSchema(EnsureSandboxInputSchema)
	.addOutputSchema(EnsureSandboxOutputSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox/ensure')
	.setCommandFunction(async function (context: any, payload: z.infer<typeof EnsureSandboxInputSchema>) {
		const owner = resolveSandboxOwnerFromMessage(context, payload)
		return await context.resources.registry.withOwnerProvisionLock(owner, async () => {
			const existing = await context.resources.registry.findByOwner(owner)

			if (existing) {
				const health = await context.resources.driver.executeBash({
					sandboxId: existing.sandboxId,
					command: 'echo "__purista_health__"',
					timeoutMs: 5_000,
				})
				if (health.exitCode === 0) {
					return {
						sandboxId: existing.sandboxId,
						status: 'ready',
						created: false,
					}
				}

				context.logger.warn(
					{
						sandboxId: existing.sandboxId,
						exitCode: health.exitCode,
						stderr: summarizeTextForLog(health.stderr),
					},
					'Sandbox health check failed, recreating sandbox.',
				)
				try {
					await context.resources.driver.destroySandbox({ sandboxId: existing.sandboxId })
				} catch (error) {
					context.logger.warn(
						{
							sandboxId: existing.sandboxId,
							error: createSanitizedErrorDiagnostics(error, { fallbackKind: 'sandbox' }),
						},
						'Failed to destroy unhealthy sandbox.',
					)
				}
				await context.resources.registry.unregister(existing.sandboxId)
			}

			const scopePart =
				!owner.scope || owner.scope.kind === 'shared-project-user'
					? 'shared-project-user'
					: `${owner.scope.kind}:${owner.scope.key}`
			const sandboxId = getDeterministicSandboxId({
				organizationId: owner.organizationId,
				projectId: owner.projectId,
				userId: owner.userId,
				scopePart,
			})
			let createdContainerName: string
			try {
				const created = await context.resources.driver.createSandbox({
					...owner,
					gitConfig: payload.gitConfig,
					sandboxId,
				})
				createdContainerName = created.containerName
			} catch (error) {
				const racedExisting = await context.resources.registry.findByOwner(owner)
				if (racedExisting) {
					return {
						sandboxId: racedExisting.sandboxId,
						status: 'ready',
						created: false,
					}
				}
				throw error
			}

			await context.resources.registry.register({
				...owner,
				sandboxId,
				containerName: createdContainerName,
				createdAt: Date.now(),
				gitConfigured: !!payload.gitConfig,
			})

			return {
				sandboxId,
				status: 'starting',
				created: true,
			}
		})
	})

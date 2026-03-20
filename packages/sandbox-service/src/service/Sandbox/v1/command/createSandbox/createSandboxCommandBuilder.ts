import { randomUUID } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import { resolveSandboxOwnerFromMessage } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { CreateSandboxInputSchema, CreateSandboxOutputSchema } from './schema.js'

/**
 * createSandboxCommandBuilder
 *
 * This command handles the end-to-end provisioning of a new sandbox environment.
 * It coordinates between the underlying virtualization driver and the persistent registry.
 *
 * Workflow:
 * 1. Generates a unique Sandbox ID.
 * 2. Delegates infrastructure creation to the 'driver' resource.
 * 3. Persists sandbox metadata in the 'registry' resource.
 * 4. Returns the sandbox reference to the caller.
 */
export const createSandboxCommandBuilder: any = sandboxServiceBuilder
	.getCommandBuilder('createSandbox', 'Provisions and starts a new sandbox environment')
	.addPayloadSchema(CreateSandboxInputSchema)
	.addOutputSchema(CreateSandboxOutputSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox')
	.setCommandFunction(async function (context: any, payload: z.infer<typeof CreateSandboxInputSchema>) {
		const owner = resolveSandboxOwnerFromMessage(context, payload)
		const existing = await context.resources.registry.findByOwner(owner)
		if (existing) {
			throw new HandledError(
				StatusCode.Conflict,
				`Sandbox ${existing.sandboxId} already exists for this owner. Use ensureSandbox to reuse it.`,
				{ sandboxId: existing.sandboxId },
			)
		}

		const sandboxId = randomUUID()

		// Create the container using the driver resource
		const result = await context.resources.driver.createSandbox({
			...owner,
			gitConfig: payload.gitConfig,
			sandboxId,
		})

		// Register the sandbox in our registry resource
		await context.resources.registry.register({
			...owner,
			sandboxId,
			containerName: result.containerName,
			createdAt: Date.now(),
			gitConfigured: !!payload.gitConfig,
		})

		return {
			sandboxId,
			status: 'starting',
		}
	})

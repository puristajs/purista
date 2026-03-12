import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { CreateSandboxInputSchema, CreateSandboxOutputSchema } from './schema.js'

/**
 * Event payload for SandboxStarted
 */
const SandboxStartedEventSchema = z.object({
	sandboxId: z.string(),
	organizationId: z.string(),
	projectId: z.string(),
	userId: z.string(),
})

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
 * 4. Emits a 'SandboxStarted' event.
 */
export const createSandboxCommandBuilder: any = sandboxServiceBuilder
	.getCommandBuilder('createSandbox', 'Provisions and starts a new sandbox environment')
	.addPayloadSchema(CreateSandboxInputSchema)
	.addOutputSchema(CreateSandboxOutputSchema)
	.canEmit('SandboxStarted', SandboxStartedEventSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox')
	.setCommandFunction(async function (context: any, payload: z.infer<typeof CreateSandboxInputSchema>) {
		const sandboxId = randomUUID()

		// Create the container using the driver resource
		const result = await context.resources.driver.createSandbox({
			...payload,
			sandboxId,
		})

		// Register the sandbox in our registry resource
		await context.resources.registry.register({
			...payload,
			sandboxId,
			containerName: result.containerName,
			createdAt: Date.now(),
		})

		// The emit expects a payload that matches the schema
		await context.emit('SandboxStarted', {
			sandboxId,
			organizationId: payload.organizationId,
			projectId: payload.projectId,
			userId: payload.userId,
		})

		return {
			sandboxId,
			status: 'starting',
		}
	})

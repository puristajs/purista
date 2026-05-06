import { HandledError, StatusCode } from '@purista/core'
import { assertSandboxAccess } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { DestroySandboxInputSchema, DestroySandboxOutputSchema } from './schema.js'

export const destroySandboxCommandBuilder = sandboxServiceBuilder
	.getCommandBuilder('destroySandbox', 'Destroys a sandbox and unregisters it')
	.addPayloadSchema(DestroySandboxInputSchema)
	.addOutputSchema(DestroySandboxOutputSchema)
	.exposeAsHttpEndpoint('DELETE', 'sandbox/:sandboxId')
	.setCommandFunction(async function (context: any, payload: { sandboxId: string; projectId: string }) {
		const metadata = await context.resources.registry.getMetadata(payload.sandboxId)
		if (!metadata) {
			throw new HandledError(StatusCode.NotFound, `Sandbox ${payload.sandboxId} not found in registry`)
		}
		assertSandboxAccess(context, metadata, payload.projectId)
		await context.resources.driver.destroySandbox({ sandboxId: payload.sandboxId })
		await context.resources.registry.unregister(payload.sandboxId)
		return { sandboxId: payload.sandboxId, destroyed: true }
	})

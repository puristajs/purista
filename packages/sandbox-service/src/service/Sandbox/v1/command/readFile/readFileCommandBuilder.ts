import { HandledError, StatusCode } from '@purista/core'
import { assertSandboxAccess } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { ReadFileInputSchema, ReadFileOutputSchema } from './schema.js'

export const readFileCommandBuilder = sandboxServiceBuilder
	.getCommandBuilder('readFile', 'Reads a file from a sandbox workspace')
	.addPayloadSchema(ReadFileInputSchema)
	.addOutputSchema(ReadFileOutputSchema)
	.exposeAsHttpEndpoint('GET', 'sandbox/:sandboxId/file')
	.setCommandFunction(async function (context: any, payload: { sandboxId: string; path: string }) {
		const metadata = await context.resources.registry.getMetadata(payload.sandboxId)
		if (!metadata) {
			throw new HandledError(StatusCode.NotFound, `Sandbox ${payload.sandboxId} not found in registry`)
		}
		assertSandboxAccess(context, metadata)
		return await context.resources.driver.readFile(payload)
	})

import { HandledError, StatusCode } from '@purista/core'
import { assertSandboxAccess } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { WriteFilesInputSchema, WriteFilesOutputSchema } from './schema.js'

export const writeFilesCommandBuilder = sandboxServiceBuilder
	.getCommandBuilder('writeFiles', 'Writes one or more files to a sandbox workspace')
	.addPayloadSchema(WriteFilesInputSchema)
	.addOutputSchema(WriteFilesOutputSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox/:sandboxId/files')
	.setCommandFunction(async function (context: any, payload: { sandboxId: string; files: Record<string, string> }) {
		const metadata = await context.resources.registry.getMetadata(payload.sandboxId)
		if (!metadata) {
			throw new HandledError(StatusCode.NotFound, `Sandbox ${payload.sandboxId} not found in registry`)
		}
		assertSandboxAccess(context, metadata)
		await context.resources.driver.writeFiles(payload)
		return { updated: Object.keys(payload.files).length }
	})

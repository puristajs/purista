import { HandledError, StatusCode } from '@purista/core'
import type { SandboxFileContent } from '../../../../../types/SandboxDriver.js'
import { assertSandboxAccess } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { WriteFilesInputSchema, WriteFilesOutputSchema } from './schema.js'

export const writeFilesCommandBuilder = sandboxServiceBuilder
	.getCommandBuilder('writeFiles', 'Writes one or more files to a sandbox workspace')
	.addPayloadSchema(WriteFilesInputSchema)
	.addOutputSchema(WriteFilesOutputSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox/:sandboxId/files')
	.setCommandFunction(async function (
		context: any,
		payload: { sandboxId: string; projectId: string; files: Record<string, SandboxFileContent> },
	) {
		const metadata = await context.resources.registry.getMetadata(payload.sandboxId)
		if (!metadata) {
			throw new HandledError(StatusCode.NotFound, `Sandbox ${payload.sandboxId} not found in registry`)
		}
		assertSandboxAccess(context, metadata, payload.projectId)
		const { projectId: _projectId, ...driverPayload } = payload
		await context.resources.driver.writeFiles(driverPayload)
		return { updated: Object.keys(payload.files).length }
	})

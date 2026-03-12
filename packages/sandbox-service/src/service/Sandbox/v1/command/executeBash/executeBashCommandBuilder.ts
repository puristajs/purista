import { HandledError, StatusCode } from '@purista/core'
import type { z } from 'zod'
import { assertSandboxAccess } from '../../helper/ownership.js'
import { sandboxServiceBuilder } from '../../SandboxServiceBuilder.js'
import { ExecuteBashInputSchema, ExecuteBashOutputSchema } from './schema.js'

/**
 * executeBashCommandBuilder
 *
 * Executes a bash command within an existing sandbox.
 * This command ensures that the requested sandbox is valid and registered before
 * invoking the driver.
 *
 * Security:
 * - Checks the 'registry' resource to verify existence.
 * - Uses the 'driver' resource for isolated execution.
 */
export const executeBashCommandBuilder: any = sandboxServiceBuilder
	.getCommandBuilder('executeBash', 'Executes a bash command in a sandbox')
	.addPayloadSchema(ExecuteBashInputSchema)
	.addOutputSchema(ExecuteBashOutputSchema)
	.exposeAsHttpEndpoint('POST', 'sandbox/:sandboxId/bash')
	.setCommandFunction(async function (context: any, payload: z.infer<typeof ExecuteBashInputSchema>) {
		// 1. Verify sandbox exists in registry
		const metadata = await context.resources.registry.getMetadata(payload.sandboxId)

		if (!metadata) {
			throw new HandledError(StatusCode.NotFound, `Sandbox ${payload.sandboxId} not found in registry`)
		}
		assertSandboxAccess(context, metadata)

		// 2. Execute command via driver
		return await context.resources.driver.executeBash(payload)
	})

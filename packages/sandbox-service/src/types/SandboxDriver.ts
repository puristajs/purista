import { z } from 'zod'

/**
 * Common payload for sandbox operations requiring a specific sandbox reference.
 * @group Schemas
 */
export const SandboxPayloadSchema = z.object({
	sandboxId: z.string().describe('The unique identifier of the sandbox'),
})

/**
 * Result of a bash command execution within a sandbox.
 * @group Schemas
 */
export const BashResultSchema = z.object({
	stdout: z.string().describe('The standard output of the command'),
	stderr: z.string().describe('The standard error of the command'),
	exitCode: z.number().describe('The exit code of the process'),
})

/**
 * Metadata for a sandbox instance used for registry and reconciliation.
 * @group Schemas
 */
export const SandboxMetadataSchema = z.object({
	sandboxId: z.string().describe('The unique identifier of the sandbox'),
	organizationId: z.string().describe('The organization owning this sandbox'),
	projectId: z.string().describe('The project reference'),
	userId: z.string().describe('The user who created the sandbox'),
	containerName: z.string().describe('The underlying container or VM name'),
	createdAt: z.number().describe('Timestamp of creation'),
	/** Indicates if Git/GitHub was configured */
	gitConfigured: z.boolean().optional().describe('Flag indicating if Git was initialized'),
})

/**
 * Inferred type for Sandbox metadata.
 */
export type SandboxMetadata = z.infer<typeof SandboxMetadataSchema>

/**
 * Interface for sandbox drivers.
 * Implement this interface to add support for new virtualization backends.
 *
 * @group Drivers
 */
export interface SandboxDriver {
	/** The unique name of the driver implementation */
	name: string

	/**
	 * Provisions and starts a new sandbox environment.
	 *
	 * @param params Configuration for the new sandbox
	 * @returns The sandbox ID and underlying container name
	 */
	createSandbox(params: {
		organizationId: string
		projectId: string
		userId: string
		sandboxId: string
		gitConfig?: {
			username: string
			email: string
			token?: string
		}
	}): Promise<{ sandboxId: string; containerName: string }>

	/**
	 * Permanently removes a sandbox and its resources.
	 *
	 * @param params Reference to the sandbox to destroy
	 */
	destroySandbox(params: { sandboxId: string }): Promise<void>

	/**
	 * Executes a bash command within the specified sandbox.
	 *
	 * @param params Command and execution context
	 * @returns The result of the command execution
	 */
	executeBash(params: { sandboxId: string; command: string; cwd?: string }): Promise<z.infer<typeof BashResultSchema>>

	/**
	 * Reads the content of a file from the sandbox.
	 *
	 * @param params Path to the file
	 */
	readFile(params: { sandboxId: string; path: string }): Promise<string>

	/**
	 * Writes one or more files to the sandbox workspace.
	 *
	 * @param params Map of file paths to their contents
	 */
	writeFiles(params: { sandboxId: string; files: Record<string, string> }): Promise<void>

	/**
	 * Scans the underlying system for running sandboxes and recovers their metadata.
	 * This is used for self-healing and service restarts.
	 */
	scanRunningSandboxes(): Promise<Array<SandboxMetadata>>
}

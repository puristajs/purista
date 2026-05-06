import { z } from 'zod'

const NonEmptyIdentifierSchema = z.string().min(1)

/**
 * Optional isolation scope for sandbox ownership and reuse.
 * When omitted, sandboxes are shared per organization + project + user.
 *
 * @group Schemas
 */
export const SandboxScopeSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('shared-project-user'),
	}),
	z.object({
		kind: z.literal('agent-run'),
		key: NonEmptyIdentifierSchema.describe('Logical run identifier used for isolated sandbox reuse'),
	}),
	z.object({
		kind: z.literal('agent-instance'),
		key: NonEmptyIdentifierSchema.describe('Logical agent instance identifier used for isolated sandbox reuse'),
	}),
	z.object({
		kind: z.literal('conversation'),
		key: NonEmptyIdentifierSchema.describe('Conversation identifier used for isolated sandbox reuse'),
	}),
	z.object({
		kind: z.literal('runtime-instance'),
		key: NonEmptyIdentifierSchema.describe('Runtime instance identifier used for isolated sandbox reuse'),
	}),
	z.object({
		kind: z.literal('custom'),
		key: NonEmptyIdentifierSchema.describe('Application-defined isolation key'),
	}),
])

/**
 * Common payload for sandbox operations requiring a specific sandbox reference.
 * @group Schemas
 */
export const SandboxPayloadSchema = z.object({
	sandboxId: NonEmptyIdentifierSchema.describe('The unique identifier of the sandbox'),
	projectId: NonEmptyIdentifierSchema.describe('The project that owns the sandbox'),
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
 * Encoded file payload for sandbox writes.
 * @group Schemas
 */
export const SandboxFileContentSchema = z.object({
	encoding: z.enum(['utf-8', 'base64']),
	content: z.string(),
})

export type SandboxFileContent = z.infer<typeof SandboxFileContentSchema>

/**
 * Metadata for a sandbox instance used for registry and reconciliation.
 * @group Schemas
 */
export const SandboxMetadataSchema = z.object({
	sandboxId: NonEmptyIdentifierSchema.describe('The unique identifier of the sandbox'),
	organizationId: NonEmptyIdentifierSchema.describe('The organization owning this sandbox'),
	projectId: NonEmptyIdentifierSchema.describe('The project reference'),
	userId: NonEmptyIdentifierSchema.describe('The user who created the sandbox'),
	scope: SandboxScopeSchema.optional().describe(
		'Optional isolation scope used to distinguish shared and isolated sandboxes',
	),
	containerName: NonEmptyIdentifierSchema.describe('The underlying container or VM name'),
	createdAt: z.number().int().nonnegative().describe('Timestamp of creation'),
	/** Indicates if Git/GitHub was configured */
	gitConfigured: z.boolean().optional().describe('Flag indicating if Git was initialized'),
})

/**
 * Owner tuple for sandbox access control and lookup.
 * @group Schemas
 */
export const SandboxOwnerSchema = z.object({
	organizationId: NonEmptyIdentifierSchema.describe('The organization owning this sandbox'),
	projectId: NonEmptyIdentifierSchema.describe('The project reference'),
	userId: NonEmptyIdentifierSchema.describe('The user who created the sandbox'),
	scope: SandboxScopeSchema.optional().describe(
		'Optional isolation scope used to distinguish shared and isolated sandboxes',
	),
})

/**
 * Inferred type for Sandbox metadata.
 */
export type SandboxMetadata = z.infer<typeof SandboxMetadataSchema>
export type SandboxOwner = z.infer<typeof SandboxOwnerSchema>
export type SandboxScope = z.infer<typeof SandboxScopeSchema>

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
		scope?: SandboxScope
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
	executeBash(params: {
		sandboxId: string
		command: string
		cwd?: string
		timeoutMs?: number
	}): Promise<z.infer<typeof BashResultSchema>>

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
	writeFiles(params: { sandboxId: string; files: Record<string, SandboxFileContent> }): Promise<void>

	/**
	 * Scans the underlying system for running sandboxes and recovers their metadata.
	 * This is used for self-healing and service restarts.
	 */
	scanRunningSandboxes(): Promise<Array<SandboxMetadata>>
}

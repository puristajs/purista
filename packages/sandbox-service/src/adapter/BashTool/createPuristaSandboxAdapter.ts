import type { EventBridge } from '@purista/core'
import type { ExecuteBashOutput } from '../../service/Sandbox/v1/command/executeBash/schema.js'

export type SandboxAdapter = {
	executeCommand: (command: string) => Promise<ExecuteBashOutput>
	readFile: (path: string) => Promise<string>
	writeFiles: (files: Array<{ path: string; content: string | Buffer }>) => Promise<void>
}

export type SandboxAdapterIdentity = {
	sandboxId: string
	tenantId: string
	principalId: string
}

/**
 * Creates a generic sandbox adapter for command-based bash runtimes.
 *
 * The adapter forwards operations to the PURISTA sandbox service commands.
 */
export const createPuristaSandboxAdapter = (
	eventBridge: EventBridge,
	identity: SandboxAdapterIdentity,
): SandboxAdapter => {
	const { sandboxId, principalId, tenantId } = identity

	return {
		async executeCommand(command: string) {
			return await eventBridge.invoke<ExecuteBashOutput>({
				sender: {
					serviceName: 'BashToolAdapter',
					serviceVersion: '1',
					serviceTarget: 'executeCommand',
					instanceId: '1',
				},
				receiver: {
					serviceName: 'Sandbox',
					serviceVersion: '1',
					serviceTarget: 'executeBash',
				},
				payload: {
					payload: { sandboxId, command },
					parameter: {},
				},
				principalId,
				tenantId,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
			})
		},

		async readFile(path: string) {
			return await eventBridge.invoke<string>({
				sender: {
					serviceName: 'BashToolAdapter',
					serviceVersion: '1',
					serviceTarget: 'readFile',
					instanceId: '1',
				},
				receiver: {
					serviceName: 'Sandbox',
					serviceVersion: '1',
					serviceTarget: 'readFile',
				},
				payload: {
					payload: { sandboxId, path },
					parameter: {},
				},
				principalId,
				tenantId,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
			})
		},

		async writeFiles(files: Array<{ path: string; content: string | Buffer }>) {
			const filesRecord: Record<string, string> = {}
			for (const file of files) {
				filesRecord[file.path] = file.content.toString('utf-8')
			}

			await eventBridge.invoke({
				sender: {
					serviceName: 'BashToolAdapter',
					serviceVersion: '1',
					serviceTarget: 'writeFiles',
					instanceId: '1',
				},
				receiver: {
					serviceName: 'Sandbox',
					serviceVersion: '1',
					serviceTarget: 'writeFiles',
				},
				payload: {
					payload: { sandboxId, files: filesRecord },
					parameter: {},
				},
				principalId,
				tenantId,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
			})
		},
	}
}

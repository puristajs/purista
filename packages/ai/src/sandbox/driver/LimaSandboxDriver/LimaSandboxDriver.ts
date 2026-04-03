import { execa } from 'execa'
import type { z } from 'zod'
import type { BashResultSchema, SandboxDriver, SandboxFileContent, SandboxMetadata } from '../../types/SandboxDriver.js'

export interface LimaSandboxDriverConfig {
	/** The name of the base Lima template to use (e.g. 'ubuntu-lts') */
	template: string
	/** Memory limit for the VM */
	memory?: string
	/** CPU limit for the VM */
	cpus?: number
	/** Whether to use the native Apple Virtualization Framework (vz) */
	useVz?: boolean
}

/**
 * LimaSandboxDriver - A 100% Open Source driver for Apple Silicon and Linux.
 * It uses 'limactl' to manage Linux VMs and can natively leverage Apple's Virtualization Framework (vz).
 * Best for users who want to avoid the licensing constraints of Tart/OrbStack.
 */
export class LimaSandboxDriver implements SandboxDriver {
	public name = 'LimaSandboxDriver'
	private config: LimaSandboxDriverConfig

	constructor(config: LimaSandboxDriverConfig) {
		this.config = {
			useVz: true,
			...config,
		}
	}

	private getInstanceName(sandboxId: string): string {
		return `purista-${sandboxId}`
	}

	async createSandbox(params: {
		organizationId: string
		projectId: string
		userId: string
		sandboxId: string
		gitConfig?: {
			username: string
			email: string
			token?: string
		}
	}): Promise<{ sandboxId: string; containerName: string }> {
		const sandboxId = params.sandboxId
		const instanceName = this.getInstanceName(sandboxId)

		try {
			// 1. Create instance from template
			const args = ['create', '--name', instanceName]
			if (this.config.useVz) {
				args.push('--vm-type=vz')
			}
			args.push(`template://${this.config.template}`)

			await execa('limactl', args)

			// 2. Start instance
			await execa('limactl', ['start', instanceName])

			// 3. Setup Git identity inside the VM
			if (params.gitConfig) {
				await execa('limactl', [
					'shell',
					instanceName,
					'git',
					'config',
					'--global',
					'user.name',
					params.gitConfig.username,
				])
				await execa('limactl', [
					'shell',
					instanceName,
					'git',
					'config',
					'--global',
					'user.email',
					params.gitConfig.email,
				])

				if (params.gitConfig.token) {
					// Securely pipe token for GitHub CLI if installed in the Lima image
					const loginProc = execa('limactl', ['shell', instanceName, 'gh', 'auth', 'login', '--with-token'])
					loginProc.stdin?.write(params.gitConfig.token)
					loginProc.stdin?.end()
					await loginProc
				}
			}

			return { sandboxId, containerName: instanceName }
		} catch (error: any) {
			throw new Error(`Failed to create Lima sandbox: ${error.message}`)
		}
	}

	async destroySandbox(params: { sandboxId: string }): Promise<void> {
		const instanceName = this.getInstanceName(params.sandboxId)
		try {
			await execa('limactl', ['stop', instanceName])
			await execa('limactl', ['delete', instanceName])
		} catch (error: any) {
			if (!error.message.includes('does not exist')) {
				throw new Error(`Failed to destroy Lima sandbox: ${error.message}`)
			}
		}
	}

	async executeBash(params: {
		sandboxId: string
		command: string
		cwd?: string
		timeoutMs?: number
	}): Promise<z.infer<typeof BashResultSchema>> {
		const instanceName = this.getInstanceName(params.sandboxId)
		try {
			const args = ['shell', instanceName, 'bash', '-c', params.command]
			const { stdout, stderr, exitCode } = await execa('limactl', args, {
				reject: false,
				timeout: params.timeoutMs,
			})
			return {
				stdout: stdout || '',
				stderr: stderr || '',
				exitCode: exitCode ?? 1,
			}
		} catch (error: any) {
			if (error?.timedOut === true) {
				return {
					stdout: error.stdout ?? '',
					stderr: `Command timed out after ${params.timeoutMs ?? 0}ms`,
					exitCode: 124,
				}
			}
			return { stdout: '', stderr: error.message, exitCode: 1 }
		}
	}

	async readFile(params: { sandboxId: string; path: string }): Promise<string> {
		const instanceName = this.getInstanceName(params.sandboxId)
		const { stdout } = await execa('limactl', ['shell', instanceName, 'cat', params.path])
		return stdout
	}

	async writeFiles(params: { sandboxId: string; files: Record<string, SandboxFileContent> }): Promise<void> {
		const instanceName = this.getInstanceName(params.sandboxId)
		for (const [filePath, encoded] of Object.entries(params.files)) {
			const proc = execa('limactl', ['shell', instanceName, 'bash', '-c', `cat > '${filePath.replace(/'/g, `'\\''`)}'`])
			const content = encoded.encoding === 'base64' ? Buffer.from(encoded.content, 'base64') : encoded.content
			proc.stdin?.write(content)
			proc.stdin?.end()
			await proc
		}
	}

	async scanRunningSandboxes(): Promise<Array<SandboxMetadata>> {
		// Lima instances do not currently expose owner metadata in a recoverable form.
		// Returning incomplete metadata would poison the registry owner index after restart.
		return []
	}
}

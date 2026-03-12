import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { execa } from 'execa'
import type { z } from 'zod'
import type { BashResultSchema, SandboxDriver, SandboxMetadata } from '../../types/SandboxDriver.js'

export interface TartSandboxDriverConfig {
	/** The name of the base Tart image to clone (e.g. 'ghcr.io/cirruslabs/ubuntu:latest') */
	baseImage: string
	/** Memory limit for the VM (in MB) */
	memory?: number
	/** CPU limit for the VM */
	cpus?: number
	/** Display type: 'none' (default for headless) or 'gui' */
	display?: 'none' | 'gui'
}

/**
 * TartSandboxDriver - A native Apple Virtualization Framework driver for Apple Silicon.
 * It uses the 'tart' CLI to manage Linux/macOS VMs.
 */
export class TartSandboxDriver implements SandboxDriver {
	public name = 'TartSandboxDriver'
	private config: TartSandboxDriverConfig

	constructor(config: TartSandboxDriverConfig) {
		this.config = {
			display: 'none',
			...config,
		}
	}

	private getVmName(sandboxId: string): string {
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
		const vmName = this.getVmName(sandboxId)

		try {
			// 1. Clone the base image
			await execa('tart', ['clone', this.config.baseImage, vmName])

			// 2. Configure VM resources if specified
			if (this.config.memory) {
				await execa('tart', ['set', vmName, '--memory', this.config.memory.toString()])
			}
			if (this.config.cpus) {
				await execa('tart', ['set', vmName, '--cpu', this.config.cpus.toString()])
			}

			// 3. Start the VM in the background (using nohup or background process)
			// Tart 'run' is blocking, so we spawn it and detach
			const runProcess = execa('tart', ['run', '--display', this.config.display ?? 'none', vmName], {
				detached: true,
				stdio: 'ignore',
			})
			runProcess.unref()

			// 4. Wait for SSH or Tart guest tools to be ready (simplified here)
			// Note: This requires the VM image to have an IP and be reachable via tart ip
			let ip = ''
			for (let i = 0; i < 30; i++) {
				try {
					const { stdout } = await execa('tart', ['ip', vmName])
					if (stdout.trim()) {
						ip = stdout.trim()
						break
					}
				} catch (_e) {}
				await new Promise(resolve => setTimeout(resolve, 1000))
			}

			if (!ip) throw new Error('Failed to obtain VM IP address')

			// 5. Setup Git/GitHub (requires SSH access and setup inside VM)
			// This is a simplified version; a real implementation would use SSH to run commands
			// ...

			return { sandboxId, containerName: vmName }
		} catch (error: any) {
			throw new Error(`Failed to create Tart sandbox: ${error.message}`)
		}
	}

	async destroySandbox(params: { sandboxId: string }): Promise<void> {
		const vmName = this.getVmName(params.sandboxId)
		try {
			await execa('tart', ['stop', vmName])
			await execa('tart', ['delete', vmName])
		} catch (error: any) {
			if (!error.message.includes('not found')) {
				throw new Error(`Failed to destroy Tart sandbox: ${error.message}`)
			}
		}
	}

	async executeBash(params: {
		sandboxId: string
		command: string
		cwd?: string
	}): Promise<z.infer<typeof BashResultSchema>> {
		const vmName = this.getVmName(params.sandboxId)
		try {
			// Tart uses SSH or its own exec protocol for guest commands
			// Simplified here: assuming 'tart run' handles command execution or use SSH
			const { stdout, stderr, exitCode } = await execa(
				'ssh',
				[`agent@${await this.getVmIp(vmName)}`, 'bash', '-c', params.command],
				{ reject: false },
			)
			return {
				stdout: stdout || '',
				stderr: stderr || '',
				exitCode: exitCode ?? 1,
			}
		} catch (error: any) {
			return { stdout: '', stderr: error.message, exitCode: 1 }
		}
	}

	private async getVmIp(vmName: string): Promise<string> {
		const { stdout } = await execa('tart', ['ip', vmName])
		return stdout.trim()
	}

	async readFile(params: { sandboxId: string; path: string }): Promise<string> {
		// Use scp or sftp to read files from the VM
		const ip = await this.getVmIp(this.getVmName(params.sandboxId))
		const { stdout } = await execa('ssh', [`agent@${ip}`, 'cat', params.path])
		return stdout
	}

	async writeFiles(params: { sandboxId: string; files: Record<string, string> }): Promise<void> {
		const ip = await this.getVmIp(this.getVmName(params.sandboxId))
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'purista-tart-'))
		try {
			for (const [filePath, content] of Object.entries(params.files)) {
				const localPath = path.join(tempDir, 'file.tmp')
				await fs.writeFile(localPath, content)
				await execa('scp', [localPath, `agent@${ip}:${filePath}`])
			}
		} finally {
			await fs.rm(tempDir, { recursive: true, force: true })
		}
	}

	async scanRunningSandboxes(): Promise<Array<SandboxMetadata>> {
		// Tart does not currently persist recoverable owner metadata for restart reconciliation.
		// Returning incomplete metadata would create invalid registry entries.
		return []
	}
}

import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { execa } from 'execa'
import type { z } from 'zod'
import {
	type BashResultSchema,
	type SandboxDriver,
	type SandboxMetadata,
	SandboxMetadataSchema,
} from '../../types/SandboxDriver.js'

/**
 * Configuration for the DockerSandboxDriver.
 */
export interface DockerSandboxDriverConfig {
	/** The name of the Docker image to use for the sandbox */
	imageName: string
	/** Memory limit for the container (e.g. '1g') */
	memory?: string
	/** CPU limit for the container (e.g. '1.0') */
	cpus?: string
	/** Disable network access */
	networkDisabled?: boolean
}

/**
 * DockerSandboxDriver - A robust driver for Docker, OrbStack, and Colima.
 * It provides secure execution environments using Docker containers.
 *
 * @group Drivers
 */
export class DockerSandboxDriver implements SandboxDriver {
	public name = 'DockerSandboxDriver'
	private config: DockerSandboxDriverConfig

	/**
	 * @param config Driver configuration
	 */
	constructor(config: DockerSandboxDriverConfig) {
		this.config = {
			...config,
		}
	}

	/**
	 * Generates the standardized container name for a sandbox.
	 * @param sandboxId Unique sandbox ID
	 */
	public getContainerName(sandboxId: string): string {
		return `purista-${sandboxId}`
	}

	/**
	 * Provisions and starts a new Docker container.
	 * Securely configures Git identity and GitHub CLI inside the container.
	 */
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
		const containerName = this.getContainerName(sandboxId)

		const args = [
			'run',
			'-d',
			'--name',
			containerName,
			'--init',
			'--label',
			`purista.organizationId=${params.organizationId}`,
			'--label',
			`purista.projectId=${params.projectId}`,
			'--label',
			`purista.userId=${params.userId}`,
			'--label',
			`purista.sandboxId=${sandboxId}`,
			'--label',
			`purista.createdAt=${Date.now()}`,
			'--label',
			`purista.gitConfigured=${!!params.gitConfig}`,
		]

		if (this.config.memory) {
			args.push('--memory', this.config.memory)
		}

		if (this.config.cpus) {
			args.push('--cpus', this.config.cpus)
		}

		if (this.config.networkDisabled) {
			args.push('--network', 'none')
		}

		// Keep the container running by tailing dev null
		args.push(this.config.imageName, 'tail', '-f', '/dev/null')

		try {
			await execa('docker', args)

			// Configure Git identity and GitHub CLI securely
			if (params.gitConfig) {
				// 1. Set Git user identity
				await execa('docker', [
					'exec',
					containerName,
					'git',
					'config',
					'--global',
					'user.name',
					params.gitConfig.username,
				])
				await execa('docker', [
					'exec',
					containerName,
					'git',
					'config',
					'--global',
					'user.email',
					params.gitConfig.email,
				])

				// 2. Securely login to GitHub CLI if a token is provided
				if (params.gitConfig.token) {
					// Pipe the token directly into 'gh auth login' to keep it out of logs and process lists
					const loginProcess = execa('docker', ['exec', '-i', containerName, 'gh', 'auth', 'login', '--with-token'])

					if (loginProcess.stdin) {
						loginProcess.stdin.write(params.gitConfig.token)
						loginProcess.stdin.end()
					}
					await loginProcess

					// 3. Configure Git to use GitHub CLI as the credential helper
					await execa('docker', [
						'exec',
						containerName,
						'git',
						'config',
						'--global',
						'credential.helper',
						'!gh auth git-credential',
					])
				}
			}

			return { sandboxId, containerName }
		} catch (error: any) {
			throw new Error(`Failed to create Docker sandbox: ${error.message}`)
		}
	}

	/**
	 * Forcefully removes the Docker container.
	 */
	async destroySandbox(params: { sandboxId: string }): Promise<void> {
		const containerName = this.getContainerName(params.sandboxId)
		try {
			await execa('docker', ['rm', '-f', containerName])
		} catch (error: any) {
			if (!error.message.includes('No such container')) {
				throw new Error(`Failed to destroy Docker sandbox: ${error.message}`)
			}
		}
	}

	/**
	 * Executes a command via 'docker exec'.
	 */
	async executeBash(params: {
		sandboxId: string
		command: string
		cwd?: string
	}): Promise<z.infer<typeof BashResultSchema>> {
		const containerName = this.getContainerName(params.sandboxId)
		const args = ['exec']

		if (params.cwd) {
			args.push('-w', params.cwd)
		}

		args.push(containerName, 'bash', '-c', params.command)

		try {
			const { stdout, stderr, exitCode } = await execa('docker', args, { reject: false })
			return {
				stdout: stdout || '',
				stderr: stderr || '',
				exitCode: exitCode ?? 1,
			}
		} catch (error: any) {
			return {
				stdout: '',
				stderr: error.message,
				exitCode: 1,
			}
		}
	}

	/**
	 * Reads a file from the container using 'cat'.
	 */
	async readFile(params: { sandboxId: string; path: string }): Promise<string> {
		const containerName = this.getContainerName(params.sandboxId)
		try {
			const { stdout } = await execa('docker', ['exec', containerName, 'cat', params.path])
			return stdout
		} catch (error: any) {
			throw new Error(`Failed to read file ${params.path} in sandbox ${params.sandboxId}: ${error.message}`)
		}
	}

	/**
	 * Writes files to the container by creating a local temp file and using 'docker cp'.
	 */
	async writeFiles(params: { sandboxId: string; files: Record<string, string> }): Promise<void> {
		const containerName = this.getContainerName(params.sandboxId)
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'purista-sandbox-'))

		try {
			for (const [filePath, content] of Object.entries(params.files)) {
				const localFilePath = path.join(tempDir, 'file.tmp')
				await fs.writeFile(localFilePath, content, 'utf-8')

				const targetDir = path.posix.dirname(filePath)
				if (targetDir !== '.' && targetDir !== '/') {
					await execa('docker', ['exec', containerName, 'mkdir', '-p', targetDir])
				}

				await execa('docker', ['cp', localFilePath, `${containerName}:${filePath}`])
				await execa('docker', ['exec', '-u', 'root', containerName, 'chown', 'agent:agent', filePath])
			}
		} finally {
			await fs.rm(tempDir, { recursive: true, force: true })
		}
	}

	/**
	 * Scans for running containers and recovers metadata from labels.
	 */
	async scanRunningSandboxes(): Promise<Array<SandboxMetadata>> {
		try {
			const { stdout } = await execa('docker', ['ps', '--filter', 'name=purista-', '--format', '{{json .Labels}}'])

			const lines = stdout.split('\n').filter(Boolean)
			const sandboxes: Array<SandboxMetadata> = []

			for (const line of lines) {
				try {
					const labels = JSON.parse(line)

					if (labels['purista.sandboxId']) {
						const parsed = SandboxMetadataSchema.safeParse({
							sandboxId: labels['purista.sandboxId'],
							organizationId: labels['purista.organizationId'] || '',
							projectId: labels['purista.projectId'] || '',
							userId: labels['purista.userId'] || '',
							containerName: this.getContainerName(labels['purista.sandboxId']),
							createdAt: Number.parseInt(labels['purista.createdAt'] || '0', 10),
							gitConfigured: labels['purista.gitConfigured'] === 'true',
						})
						if (parsed.success) {
							sandboxes.push(parsed.data)
						}
					}
				} catch (_e) {
					// Handle cases where label parsing fails
				}
			}
			return sandboxes
		} catch (_error) {
			return []
		}
	}
}

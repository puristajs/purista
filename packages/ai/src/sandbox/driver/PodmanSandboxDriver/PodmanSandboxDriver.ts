import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { execa } from 'execa'
import type { z } from 'zod'
import {
	type BashResultSchema,
	type SandboxDriver,
	type SandboxFileContent,
	type SandboxMetadata,
	SandboxMetadataSchema,
	type SandboxScope,
} from '../../types/SandboxDriver.js'

export interface PodmanSandboxDriverConfig {
	/** The name of the Podman image to use */
	imageName: string
	/** Memory limit */
	memory?: string
	/** CPU limit */
	cpus?: string
	/** Disable network */
	networkDisabled?: boolean
}

/**
 * PodmanSandboxDriver - A driver for Podman (daemonless, rootless containers).
 * Podman is Docker-CLI compatible but has nuances in connection management
 * and user-mode networking.
 */
export class PodmanSandboxDriver implements SandboxDriver {
	public name = 'PodmanSandboxDriver'
	private config: PodmanSandboxDriverConfig

	constructor(config: PodmanSandboxDriverConfig) {
		this.config = config
	}

	private getContainerName(sandboxId: string): string {
		return `purista-${sandboxId}`
	}

	private serializeScope(scope?: SandboxScope): Record<string, string> {
		if (!scope || scope.kind === 'shared-project-user') {
			return {
				'purista.scope.kind': 'shared-project-user',
			}
		}
		return {
			'purista.scope.kind': scope.kind,
			'purista.scope.key': scope.key,
		}
	}

	private deserializeScope(labels: Record<string, string | undefined>): SandboxScope | undefined {
		const kind = labels['purista.scope.kind']
		if (!kind || kind === 'shared-project-user') {
			return kind === 'shared-project-user' ? { kind: 'shared-project-user' } : undefined
		}
		const key = labels['purista.scope.key']
		if (!key) {
			return undefined
		}
		switch (kind) {
			case 'agent-run':
			case 'agent-instance':
			case 'conversation':
			case 'runtime-instance':
			case 'custom':
				return { kind, key }
			default:
				return undefined
		}
	}

	async createSandbox(params: {
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
	}): Promise<{ sandboxId: string; containerName: string }> {
		const sandboxId = params.sandboxId
		const containerName = this.getContainerName(sandboxId)
		const labels = {
			'purista.organizationId': params.organizationId,
			'purista.projectId': params.projectId,
			'purista.userId': params.userId,
			'purista.sandboxId': sandboxId,
			'purista.createdAt': String(Date.now()),
			'purista.gitConfigured': String(!!params.gitConfig),
			...this.serializeScope(params.scope),
		}

		const args = ['run', '-d', '--name', containerName]
		for (const [key, value] of Object.entries(labels)) {
			args.push('--label', `${key}=${value}`)
		}

		if (this.config.memory) args.push('--memory', this.config.memory)
		if (this.config.cpus) args.push('--cpus', this.config.cpus)
		if (this.config.networkDisabled) args.push('--network', 'none')

		args.push(this.config.imageName, 'tail', '-f', '/dev/null')

		try {
			// Podman might need a 'podman machine start' if on Mac,
			// but we assume the environment is ready.
			await execa('podman', args)

			if (params.gitConfig) {
				await execa('podman', [
					'exec',
					containerName,
					'git',
					'config',
					'--global',
					'user.name',
					params.gitConfig.username,
				])
				await execa('podman', [
					'exec',
					containerName,
					'git',
					'config',
					'--global',
					'user.email',
					params.gitConfig.email,
				])

				if (params.gitConfig.token) {
					const loginProc = execa('podman', ['exec', '-i', containerName, 'gh', 'auth', 'login', '--with-token'])
					loginProc.stdin?.write(params.gitConfig.token)
					loginProc.stdin?.end()
					await loginProc

					await execa('podman', [
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
			throw new Error(`Failed to create Podman sandbox: ${error.message}`)
		}
	}

	async destroySandbox(params: { sandboxId: string }): Promise<void> {
		const containerName = this.getContainerName(params.sandboxId)
		try {
			await execa('podman', ['rm', '-f', containerName])
		} catch (error: any) {
			if (!error.message.includes('no such container')) {
				throw new Error(`Failed to destroy Podman sandbox: ${error.message}`)
			}
		}
	}

	async executeBash(params: {
		sandboxId: string
		command: string
		cwd?: string
		timeoutMs?: number
	}): Promise<z.infer<typeof BashResultSchema>> {
		const containerName = this.getContainerName(params.sandboxId)
		try {
			const args = ['exec']
			if (params.cwd) args.push('-w', params.cwd)
			args.push(containerName, 'bash', '-c', params.command)

			const { stdout, stderr, exitCode } = await execa('podman', args, {
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
		const containerName = this.getContainerName(params.sandboxId)
		const { stdout } = await execa('podman', ['exec', containerName, 'cat', params.path], {
			stripFinalNewline: false,
		})
		return stdout
	}

	async writeFiles(params: { sandboxId: string; files: Record<string, SandboxFileContent> }): Promise<void> {
		const containerName = this.getContainerName(params.sandboxId)
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'purista-podman-'))
		try {
			for (const [filePath, encoded] of Object.entries(params.files)) {
				const localFilePath = path.join(tempDir, 'file.tmp')
				const content =
					encoded.encoding === 'base64' ? Buffer.from(encoded.content, 'base64') : Buffer.from(encoded.content, 'utf-8')
				await fs.writeFile(localFilePath, content)
				const targetDir = path.posix.dirname(filePath)
				if (targetDir !== '.' && targetDir !== '/') {
					await execa('podman', ['exec', containerName, 'mkdir', '-p', targetDir])
				}
				await execa('podman', ['cp', localFilePath, `${containerName}:${filePath}`])
			}
		} finally {
			await fs.rm(tempDir, { recursive: true, force: true })
		}
	}

	async scanRunningSandboxes(): Promise<Array<SandboxMetadata>> {
		try {
			const { stdout } = await execa('podman', ['ps', '--filter', 'name=purista-', '--format', '{{json .Labels}}'])
			const lines = stdout.split('\n').filter(Boolean)
			return lines.flatMap(line => {
				const labels = JSON.parse(line)
				const parsed = SandboxMetadataSchema.safeParse({
					sandboxId: labels['purista.sandboxId'] || '',
					organizationId: labels['purista.organizationId'] || '',
					projectId: labels['purista.projectId'] || '',
					userId: labels['purista.userId'] || '',
					scope: this.deserializeScope(labels),
					containerName: this.getContainerName(labels['purista.sandboxId']),
					createdAt: Number.parseInt(labels['purista.createdAt'] || '0', 10),
					gitConfigured: labels['purista.gitConfigured'] === 'true',
				})
				return parsed.success ? [parsed.data] : []
			})
		} catch (_error) {
			return []
		}
	}
}

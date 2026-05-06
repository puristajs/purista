import type { z } from 'zod'
import type { BashResultSchema, SandboxDriver, SandboxFileContent, SandboxMetadata } from '../../types/SandboxDriver.js'
import { DockerSandboxDriver, type DockerSandboxDriverConfig } from '../DockerSandboxDriver/DockerSandboxDriver.js'

/**
 * Configuration for AppleContainerSandboxDriver.
 *
 * This driver is intended for local macOS development setups that use
 * Docker-compatible container runtimes (for example OrbStack or Colima).
 */
export type AppleContainerSandboxDriverConfig = DockerSandboxDriverConfig

/**
 * AppleContainerSandboxDriver - macOS-focused local container driver.
 *
 * It reuses Docker-compatible CLI semantics and is therefore suitable for
 * OrbStack/Colima-based development without changing sandbox command contracts.
 *
 * @group Drivers
 */
export class AppleContainerSandboxDriver implements SandboxDriver {
	public name = 'AppleContainerSandboxDriver'
	private readonly dockerCompatDriver: DockerSandboxDriver

	constructor(config: AppleContainerSandboxDriverConfig) {
		this.dockerCompatDriver = new DockerSandboxDriver(config)
	}

	public getImageName(): string {
		return this.dockerCompatDriver.getImageName()
	}

	async createSandbox(params: {
		organizationId: string
		projectId: string
		userId: string
		scope?: import('../../types/SandboxDriver.js').SandboxScope
		sandboxId: string
		gitConfig?: {
			username: string
			email: string
			token?: string
		}
	}): Promise<{ sandboxId: string; containerName: string }> {
		return await this.dockerCompatDriver.createSandbox(params)
	}

	async destroySandbox(params: { sandboxId: string }): Promise<void> {
		await this.dockerCompatDriver.destroySandbox(params)
	}

	async executeBash(params: {
		sandboxId: string
		command: string
		cwd?: string
		timeoutMs?: number
	}): Promise<z.infer<typeof BashResultSchema>> {
		return await this.dockerCompatDriver.executeBash(params)
	}

	async readFile(params: { sandboxId: string; path: string }): Promise<string> {
		return await this.dockerCompatDriver.readFile(params)
	}

	async writeFiles(params: { sandboxId: string; files: Record<string, SandboxFileContent> }): Promise<void> {
		await this.dockerCompatDriver.writeFiles(params)
	}

	async scanRunningSandboxes(): Promise<Array<SandboxMetadata>> {
		return await this.dockerCompatDriver.scanRunningSandboxes()
	}
}

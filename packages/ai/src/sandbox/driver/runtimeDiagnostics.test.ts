import type { execa as ExecaRunner } from 'execa'
import { describe, expect, it, vi } from 'vitest'
import { AppleContainerSandboxDriver } from './AppleContainerSandboxDriver/AppleContainerSandboxDriver.js'
import { DockerSandboxDriver } from './DockerSandboxDriver/DockerSandboxDriver.js'
import {
	assertSandboxRuntimeAvailable,
	getSandboxRuntimeDiagnostics,
	SandboxRuntimeUnavailableError,
} from './runtimeDiagnostics.js'

type CommandRunner = typeof ExecaRunner

describe('runtime diagnostics', () => {
	it('reports available docker runtime and image', async () => {
		const driver = new DockerSandboxDriver({ imageName: 'voyage-sandbox:latest' })
		const commandRunner = vi
			.fn()
			.mockResolvedValueOnce({ stdout: '27.0.1', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '[]', stderr: '', exitCode: 0 })

		const result = await getSandboxRuntimeDiagnostics(driver, commandRunner as unknown as CommandRunner)

		expect(result.runtimeAvailable).toBe(true)
		expect(result.imageAvailable).toBe(true)
		expect(result.imageName).toBe('voyage-sandbox:latest')
		expect(result.runtimeVersion).toBe('27.0.1')
	})

	it('reports missing local image for apple docker-compatible runtime', async () => {
		const driver = new AppleContainerSandboxDriver({
			imageName: 'voyage-sandbox:latest',
		})
		const commandRunner = vi
			.fn()
			.mockResolvedValueOnce({ stdout: '27.0.1', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '', stderr: 'missing', exitCode: 1 })

		const result = await getSandboxRuntimeDiagnostics(driver, commandRunner as unknown as CommandRunner)

		expect(result.runtimeAvailable).toBe(true)
		expect(result.imageAvailable).toBe(false)
		expect(result.message).toContain('not available locally')
	})

	it('throws a typed error when runtime is not available', async () => {
		const driver = new DockerSandboxDriver({ imageName: 'voyage-sandbox:latest' })
		const commandRunner = vi.fn().mockRejectedValueOnce(new Error('spawn docker ENOENT'))

		await expect(
			assertSandboxRuntimeAvailable(driver, commandRunner as unknown as CommandRunner),
		).rejects.toBeInstanceOf(SandboxRuntimeUnavailableError)
	})
})

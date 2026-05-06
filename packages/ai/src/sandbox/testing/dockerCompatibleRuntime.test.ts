import type { execa as ExecaRunner } from 'execa'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { selectDockerCompatibleSandboxRuntime } from './dockerCompatibleRuntime.js'

type CommandRunner = typeof ExecaRunner

const originalPlatform = process.platform
const originalEnv = { ...process.env }

afterEach(() => {
	vi.restoreAllMocks()
	process.env = { ...originalEnv }
	Object.defineProperty(process, 'platform', {
		value: originalPlatform,
	})
})

describe('docker-compatible runtime selection', () => {
	it('builds the canonical image when the runtime is available and the image is missing', async () => {
		Object.defineProperty(process, 'platform', {
			value: 'darwin',
		})

		const commandRunner = vi
			.fn()
			.mockResolvedValueOnce({ stdout: '28.5.2', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '', stderr: 'missing', exitCode: 1 })
			.mockResolvedValueOnce({ stdout: 'build ok', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '28.5.2', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '[]', stderr: '', exitCode: 0 })

		const selection = await selectDockerCompatibleSandboxRuntime(commandRunner as unknown as CommandRunner)

		expect(selection.available).toBe(true)
		expect(selection.runtimeLabel).toBe('apple-container')
		expect(selection.imageBuilt).toBe(true)
		expect(commandRunner).toHaveBeenNthCalledWith(
			3,
			'docker',
			['build', '-t', 'purista-sandbox-agent:latest', '-f', 'Dockerfile.sandbox', '.'],
			expect.objectContaining({
				cwd: expect.stringMatching(/\/packages\/ai$/),
				reject: false,
			}),
		)
	})

	it('reports a failed automatic build when the docker build command fails', async () => {
		Object.defineProperty(process, 'platform', {
			value: 'darwin',
		})

		const commandRunner = vi
			.fn()
			.mockResolvedValueOnce({ stdout: '28.5.2', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '', stderr: 'missing', exitCode: 1 })
			.mockResolvedValueOnce({ stdout: '', stderr: 'build failed', exitCode: 1 })

		const selection = await selectDockerCompatibleSandboxRuntime(commandRunner as unknown as CommandRunner)

		expect(selection.available).toBe(false)
		expect(selection.imageBuilt).toBe(false)
		expect(selection.reason).toContain('automatic image build failed')
		expect(selection.reason).toContain('build failed')
	})

	it('skips automatic image builds when explicitly disabled', async () => {
		process.env.PURISTA_SANDBOX_TEST_SKIP_IMAGE_BUILD = 'true'

		const commandRunner = vi
			.fn()
			.mockResolvedValueOnce({ stdout: '28.5.2', stderr: '', exitCode: 0 })
			.mockResolvedValueOnce({ stdout: '', stderr: 'missing', exitCode: 1 })

		const selection = await selectDockerCompatibleSandboxRuntime(commandRunner as unknown as CommandRunner)

		expect(selection.available).toBe(false)
		expect(selection.imageBuilt).toBe(false)
		expect(commandRunner).toHaveBeenCalledTimes(2)
		expect(selection.reason).toContain('not available locally')
	})
})

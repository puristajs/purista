import { beforeEach, describe, expect, it, vi } from 'vitest'

const getConfig = vi.fn()
const registryGet = vi.fn()
const executorRun = vi.fn()

vi.mock('../../../../providers/resources/ModelResourceRegistry.js', () => ({
	defaultModelResourceRegistry: {
		get: registryGet,
	},
}))

vi.mock('../../../../runtime/AgentExecutor.js', () => ({
	AgentExecutor: class {
		constructor(private readonly dependencies: { startActiveSpan?: (...args: any[]) => Promise<unknown> | unknown }) {}

		async run(input: unknown) {
			await this.dependencies.startActiveSpan?.('worker-run', {}, undefined, async () => undefined)
			return await executorRun(input)
		}
	},
}))

const loadModule = async () => await import('./executeWorkload.js')

beforeEach(() => {
	vi.clearAllMocks()
})

describe('getUnsupportedWorkerAiSdkReason', () => {
	it('returns null for missing metadata', async () => {
		const { getUnsupportedWorkerAiSdkReason } = await loadModule()

		expect(getUnsupportedWorkerAiSdkReason(undefined)).toBeNull()
		expect(getUnsupportedWorkerAiSdkReason(null)).toBeNull()
		expect(getUnsupportedWorkerAiSdkReason([])).toBeNull()
	})

	it('returns null when aiSdk metadata has no tools', async () => {
		const { getUnsupportedWorkerAiSdkReason } = await loadModule()

		expect(
			getUnsupportedWorkerAiSdkReason({
				aiSdk: {
					maxSteps: 20,
					toolChoice: 'required',
				},
			}),
		).toBeNull()
	})

	it('returns reason for unsupported top-level and nested tool metadata', async () => {
		const { getUnsupportedWorkerAiSdkReason } = await loadModule()

		expect(
			getUnsupportedWorkerAiSdkReason({
				aiSdk: {
					tools: {
						writeSpecFile: { description: 'writes files' },
					},
				},
			}),
		).toContain('only supports external bindings')
		expect(
			getUnsupportedWorkerAiSdkReason({
				aiSdk: {
					generate: {
						tools: {
							writeSpecFile: { description: 'writes files' },
						},
					},
				},
			}),
		).toContain('only supports external bindings')
	})

	it('allows external runtime bindings and rejects malformed entries', async () => {
		const { getUnsupportedWorkerAiSdkReason } = await loadModule()

		expect(
			getUnsupportedWorkerAiSdkReason({
				aiSdk: {
					tools: {
						lookupFaq: {
							externalRuntime: {
								kind: 'command',
								descriptor: {
									serviceName: 'support',
									serviceVersion: '1',
									commandName: 'lookupFaq',
									bindingName: 'support.1.lookupFaq',
								},
							},
						},
					},
				},
			}),
		).toBeNull()
		expect(
			getUnsupportedWorkerAiSdkReason({
				aiSdk: {
					tools: {
						lookupFaq: {
							externalRuntime: {
								kind: 'command',
							},
						},
					},
				},
			}),
		).toContain('only supports external bindings')
	})
})

describe('executeWorkloadQueueWorkerBuilder', () => {
	it('fails queued jobs early for unsupported AI SDK metadata', async () => {
		const { executeWorkloadQueueWorkerBuilder } = await loadModule()
		const { handler } = await executeWorkloadQueueWorkerBuilder.getDefinition()
		const fail = vi.fn()
		const warn = vi.fn()

		await handler(
			{
				logger: { warn, info: vi.fn(), error: vi.fn() },
				job: { fail, complete: vi.fn() },
				configs: { getConfig },
				startActiveSpan: vi.fn(),
			} as never,
			{
				id: 'job-1',
				payload: {
					manifestKey: 'manifest-1',
					sessionId: 'session-1',
					prompt: 'hello',
					metadata: {
						aiSdk: {
							tools: {
								inlineOnly: { description: 'bad tool' },
							},
						},
					},
				},
			} as never,
		)

		expect(fail).toHaveBeenCalledWith(expect.stringContaining('only supports external bindings'), true)
		expect(warn).toHaveBeenCalled()
		expect(getConfig).not.toHaveBeenCalled()
	})

	it('fails when the manifest cannot be resolved', async () => {
		getConfig.mockResolvedValueOnce(undefined)
		const { executeWorkloadQueueWorkerBuilder } = await loadModule()
		const { handler } = await executeWorkloadQueueWorkerBuilder.getDefinition()
		const fail = vi.fn()

		await handler(
			{
				logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
				job: { fail, complete: vi.fn() },
				configs: { getConfig },
				startActiveSpan: vi.fn(),
			} as never,
			{
				id: 'job-2',
				payload: {
					manifestKey: 'missing-manifest',
					sessionId: 'session-2',
					prompt: 'hello',
				},
			} as never,
		)

		expect(fail).toHaveBeenCalledWith('Manifest missing-manifest not found', true)
	})

	it('completes queued work when provider and manifest resolve', async () => {
		getConfig.mockResolvedValueOnce({
			agentName: 'supportAgent',
			modelResource: { resourceName: 'openai' },
		})
		registryGet.mockReturnValueOnce({ name: 'provider' })
		executorRun.mockResolvedValueOnce({ output: 'done' })

		const { executeWorkloadQueueWorkerBuilder } = await loadModule()
		const { handler } = await executeWorkloadQueueWorkerBuilder.getDefinition()
		const complete = vi.fn()
		const fail = vi.fn()

		await handler(
			{
				logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
				job: { fail, complete },
				configs: { getConfig },
				startActiveSpan: vi.fn((_name, _options, _spanContext, fn) => fn?.({})),
			} as never,
			{
				id: 'job-3',
				payload: {
					manifestKey: 'manifest-3',
					sessionId: 'session-3',
					prompt: 'hello',
					context: 'context payload',
					metadata: {
						poolId: 'pool-a',
						maxConcurrencyPerInstance: 2,
					},
					tenantId: 'tenant-1',
					principalId: 'principal-1',
				},
			} as never,
		)

		expect(registryGet).toHaveBeenCalledWith('openai')
		expect(executorRun).toHaveBeenCalledWith({
			sessionId: 'session-3',
			prompt: 'hello',
			context: 'context payload',
			metadata: { poolId: 'pool-a', maxConcurrencyPerInstance: 2 },
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})
		expect(complete).toHaveBeenCalled()
		expect(fail).not.toHaveBeenCalled()
	})

	it('fails when the manifest has no model resource or no registered provider', async () => {
		getConfig
			.mockResolvedValueOnce({
				agentName: 'supportAgent',
				modelResource: {},
			})
			.mockResolvedValueOnce({
				agentName: 'supportAgent',
				modelResource: { resourceName: 'missing-provider' },
			})
		registryGet.mockReturnValueOnce(undefined)
		const { executeWorkloadQueueWorkerBuilder } = await loadModule()
		const { handler } = await executeWorkloadQueueWorkerBuilder.getDefinition()
		const firstFail = vi.fn()
		const secondFail = vi.fn()

		await handler(
			{
				logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
				job: { fail: firstFail, complete: vi.fn() },
				configs: { getConfig },
				startActiveSpan: vi.fn(),
			} as never,
			{
				id: 'job-4',
				payload: {
					manifestKey: 'manifest-4',
					sessionId: 'session-4',
					prompt: 'hello',
				},
			} as never,
		)

		await handler(
			{
				logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
				job: { fail: secondFail, complete: vi.fn() },
				configs: { getConfig },
				startActiveSpan: vi.fn(),
			} as never,
			{
				id: 'job-5',
				payload: {
					manifestKey: 'manifest-5',
					sessionId: 'session-5',
					prompt: 'hello',
				},
			} as never,
		)

		expect(firstFail).toHaveBeenCalledWith('Manifest manifest-4 does not define modelResource.resourceName', true)
		expect(secondFail).toHaveBeenCalledWith('No provider registered under missing-provider', true)
	})
})

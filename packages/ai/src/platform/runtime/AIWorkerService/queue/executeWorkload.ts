import { InMemoryKnowledgeAdapter } from '../../../../knowledge/adapters/inMemoryAdapter.js'
import { InMemorySessionStore } from '../../../../memory/sessionStore.js'
import { PoolManager } from '../../../../pools/PoolManager.js'
import { defaultModelResourceRegistry } from '../../../../providers/resources/ModelResourceRegistry.js'
import { AgentExecutor } from '../../../../runtime/AgentExecutor.js'
import type { AgentManifest } from '../../../../types/AgentManifest.js'
import { aiWorkerServiceBuilder } from '../info/info.js'
import { aiWorkloadsQueueBuilder } from './aiWorkloads/aiWorkloadsQueueBuilder.js'
import { aiWorkloadQueuePayloadSchema } from './aiWorkloads/schema.js'

const sessionStore = new InMemorySessionStore()
const knowledgeAdapter = new InMemoryKnowledgeAdapter()
const poolManager = new PoolManager({ default: 2 })

export const executeWorkloadQueueWorkerBuilder = aiWorkerServiceBuilder
	.getQueueWorkerBuilder('aiWorkloads', 'Executes AI workloads using the registered model providers')
	.setMode('continuous')
	.setHandler(async function (context, message) {
		const payload = aiWorkloadQueuePayloadSchema.parse(message.payload)
		const manifest = (await context.configs.getConfig(payload.manifestKey)) as AgentManifest | undefined

		if (!manifest) {
			await context.job.fail(`Manifest ${payload.manifestKey} not found`, true)
			return undefined
		}

		const poolId = typeof payload.metadata?.poolId === 'string' ? payload.metadata.poolId : 'default'
		const maxWorkers = typeof payload.metadata?.maxWorkers === 'number' ? payload.metadata.maxWorkers : 1
		poolManager.registerPool(poolId, maxWorkers)

		await poolManager.acquire(poolId)

		try {
			const providerName = manifest.modelResource?.resourceName
			if (!providerName) {
				await context.job.fail(`Manifest ${payload.manifestKey} does not define modelResource.resourceName`, true)
				return undefined
			}
			const provider = defaultModelResourceRegistry.get(providerName)
			if (!provider) {
				await context.job.fail(`No provider registered under ${providerName}`, true)
				return undefined
			}

			const executor = new AgentExecutor({
				manifest,
				provider,
				sessionStore,
				knowledgeAdapters: { default: knowledgeAdapter },
				logger: context.logger,
				startActiveSpan: (name, options, spanContext, fn) =>
					context.startActiveSpan(name, options ?? {}, spanContext, span =>
						fn ? fn(span) : Promise.resolve(undefined as never),
					),
			})

			const result = await executor.run({
				sessionId: payload.sessionId,
				prompt: payload.prompt,
				context: payload.context,
				metadata: payload.metadata,
			})

			context.logger.info({ jobId: message.id, manifest: manifest.agentName }, 'AI workload completed', result)
			await context.job.complete()
		} catch (error) {
			context.logger.error({ err: error, jobId: message.id }, 'AI workload failed')
			const reason = error instanceof Error ? error.message : 'unknown error'
			await context.job.fail(reason, true)
		} finally {
			poolManager.release(poolId)
		}

		return undefined
	})

export { aiWorkloadsQueueBuilder }

import { InMemoryKnowledgeAdapter } from '../../../../knowledge/adapters/inMemoryAdapter.js'
import { InMemoryConversationStore } from '../../../../memory/conversationStore.js'
import { PoolManager } from '../../../../pools/PoolManager.js'
import { defaultModelResourceRegistry } from '../../../../providers/resources/ModelResourceRegistry.js'
import { AgentExecutor } from '../../../../runtime/AgentExecutor.js'
import type { AgentManifest } from '../../../../types/AgentManifest.js'
import { aiWorkerServiceBuilder } from '../info/info.js'
import { aiWorkloadsQueueBuilder } from './aiWorkloads/aiWorkloadsQueueBuilder.js'
import { aiWorkloadQueuePayloadSchema } from './aiWorkloads/schema.js'

const conversationStore = new InMemoryConversationStore()
const knowledgeAdapter = new InMemoryKnowledgeAdapter()
const poolManager = new PoolManager({ default: 2 })

/**
 * Worker queue payload metadata must stay JSON-serializable.
 * Function-based AI SDK tools cannot be transported/executed by the worker runtime yet.
 */
export const getUnsupportedWorkerAiSdkReason = (metadata: unknown): string | null => {
	if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
		return null
	}
	const aiSdk = (metadata as { aiSdk?: unknown }).aiSdk
	if (!aiSdk || typeof aiSdk !== 'object' || Array.isArray(aiSdk)) {
		return null
	}
	const aiSdkRecord = aiSdk as Record<string, unknown>
	const generate =
		aiSdkRecord.generate && typeof aiSdkRecord.generate === 'object' && !Array.isArray(aiSdkRecord.generate)
			? (aiSdkRecord.generate as Record<string, unknown>)
			: undefined
	if ('tools' in aiSdkRecord || (generate && 'tools' in generate)) {
		return 'AIWorkerService queue runtime does not support function-based aiSdk.tools yet. Run this agent in-process or use command allowlist tools via context.tools.'
	}
	return null
}

export const executeWorkloadQueueWorkerBuilder = aiWorkerServiceBuilder
	.getQueueWorkerBuilder('aiWorkloads', 'Executes AI workloads using the registered model providers')
	.setMode('continuous')
	.setHandler(async function (context, message) {
		const payload = aiWorkloadQueuePayloadSchema.parse(message.payload)
		const unsupportedReason = getUnsupportedWorkerAiSdkReason(payload.metadata)
		if (unsupportedReason) {
			context.logger.warn({ jobId: message.id, unsupportedReason }, 'AI workload rejected due to unsupported metadata')
			await context.job.fail(unsupportedReason, true)
			return undefined
		}
		const manifest = (await context.configs.getConfig(payload.manifestKey)) as AgentManifest | undefined

		if (!manifest) {
			await context.job.fail(`Manifest ${payload.manifestKey} not found`, true)
			return undefined
		}

		const poolId = typeof payload.metadata?.poolId === 'string' ? payload.metadata.poolId : 'default'
		const maxConcurrencyPerInstance =
			typeof payload.metadata?.maxConcurrencyPerInstance === 'number' ? payload.metadata.maxConcurrencyPerInstance : 1
		poolManager.registerPool(poolId, maxConcurrencyPerInstance)

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
				conversationStore,
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
				tenantId: payload.tenantId,
				principalId: payload.principalId,
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

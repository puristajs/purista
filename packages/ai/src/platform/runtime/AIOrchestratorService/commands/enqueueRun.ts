import { extendApi } from '@purista/core'
import { z } from 'zod/v4'
import {
	aiWorkloadQueueParameterSchema,
	aiWorkloadQueuePayloadSchema,
} from '../../AIWorkerService/queue/aiWorkloads/schema.js'
import { aiOrchestratorServiceBuilder } from '../info/info.js'

const enqueueRunPayloadSchema = extendApi(
	z.object({
		manifestName: extendApi(z.string().min(1), { title: 'Manifest name' }),
		manifestVersion: extendApi(z.string().min(1), { title: 'Manifest version' }),
		prompt: extendApi(z.string().min(1), { title: 'User prompt' }),
		sessionId: extendApi(z.string().optional(), { title: 'Session id' }),
		context: extendApi(z.string().optional(), { title: 'Additional context' }),
		metadata: extendApi(z.record(z.string(), z.unknown()).optional(), { title: 'Provider metadata' }),
	}),
	{ title: 'Enqueue workload input payload' },
)

export const enqueueRunCommandBuilder = aiOrchestratorServiceBuilder
	.getCommandBuilder('enqueueRun', 'Enqueues an AI workload for asynchronous execution')
	.addPayloadSchema(enqueueRunPayloadSchema)
	.canEnqueue('aiWorkloads', aiWorkloadQueuePayloadSchema, aiWorkloadQueueParameterSchema)
	.setCommandFunction(async function (context, payload) {
		const manifestKey = `ai.manifest.${payload.manifestName}.${payload.manifestVersion}`
		const manifest = await context.configs.getConfig(manifestKey)

		if (!manifest) {
			throw new Error(`Manifest ${manifestKey} not found`)
		}

		await context.queue.enqueue.aiWorkloads(
			{
				manifestKey,
				prompt: payload.prompt,
				sessionId: payload.sessionId ?? context.message.id ?? `session-${Date.now()}`,
				context: payload.context,
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				metadata: payload.metadata,
			},
			{},
		)

		return {
			enqueued: true,
			manifestKey,
		}
	})

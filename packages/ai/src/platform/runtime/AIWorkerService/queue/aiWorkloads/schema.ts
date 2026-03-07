import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const aiWorkloadQueuePayloadSchema = extendApi(
	z.object({
		manifestKey: extendApi(z.string().min(1), { title: 'Manifest config key' }),
		prompt: extendApi(z.string().min(1), { title: 'Prompt to process' }),
		sessionId: extendApi(z.string().min(1), { title: 'Session identifier' }),
		context: extendApi(z.string().optional(), { title: 'Additional context' }),
		metadata: extendApi(z.record(z.string(), z.unknown()).optional(), {
			title: 'Provider metadata (e.g., aiSdk overrides)',
		}),
	}),
	{ title: 'AI workload queue payload' },
)

export const aiWorkloadQueueParameterSchema = extendApi(z.object({}), { title: 'AI workload queue parameters' })

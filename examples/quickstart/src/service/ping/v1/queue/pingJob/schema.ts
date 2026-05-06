import { extendApi } from '@purista/core'
import { z } from 'zod'

export const pingV1PingJobQueuePayloadSchema = extendApi(
	z.object({
		ping: extendApi(z.string().min(1), { title: 'Ping message' }),
	}),
	{ title: 'ping job queue payload schema' },
)

export const pingV1PingJobQueueParameterSchema = extendApi(
	z.object({
		requestId: extendApi(z.string().optional(), { title: 'Optional request correlation id' }),
	}),
	{ title: 'ping job queue parameter schema' },
)

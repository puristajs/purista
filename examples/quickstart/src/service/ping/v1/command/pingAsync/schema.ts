import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const pingV1PingAsyncInputParameterSchema = extendApi(
	z.object({
		requestId: extendApi(z.string().optional(), { title: 'Optional request correlation id' }),
	}),
	{ title: 'ping async input parameter schema' },
)

export const pingV1PingAsyncInputPayloadSchema = extendApi(
	z.object({
		ping: extendApi(z.string().min(1), { title: 'Ping input' }),
	}),
	{ title: 'ping async input payload schema' },
)

export const pingV1PingAsyncOutputPayloadSchema = extendApi(
	z.object({
		jobId: extendApi(z.string(), { title: 'Queue job identifier' }),
		queueName: extendApi(z.string(), { title: 'Queue name' }),
		scheduledAt: extendApi(z.number().optional(), { title: 'Scheduled execution timestamp' }),
	}),
	{ title: 'ping async output payload schema' },
)

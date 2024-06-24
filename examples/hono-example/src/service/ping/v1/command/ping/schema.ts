import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const pingV1PingInputParameterSchema = extendApi(
	z.object({
		query: extendApi(z.string().optional(), { title: 'a query parameter' }),
	}),
	{ title: 'ping input parameter schema' },
)

// define the input payload
export const pingV1PingInputPayloadSchema = extendApi(
	z.object({
		ping: extendApi(z.string(), { title: 'Ping input' }),
	}),
	{ title: 'ping input payload schema' },
)

// define the output payload
export const pingV1PingOutputPayloadSchema = extendApi(
	z.object({
		pong: extendApi(z.string(), { title: 'Pong output' }),
	}),
	{ title: 'ping output payload schema' },
)

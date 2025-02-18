import { extendApi } from '@purista/core'
import { z } from 'zod'

export const pingPongV1PongInputParameterSchema = extendApi(z.object({}), { title: 'input parameter schema' })

export const pingPongV1PongInputPayloadSchema = extendApi(
	z.object({
		pongMessage: extendApi(z.string(), { title: 'The pong message' }),
	}),
	{ title: 'input payload schema' },
)

export const pingPongV1PongOutputPayloadSchema = extendApi(z.string(), { title: 'output payload schema' })

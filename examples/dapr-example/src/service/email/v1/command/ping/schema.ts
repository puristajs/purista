import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

// define the input parameters
export const emailV1PingInputParameterSchema = extendApi(z.object({}), {
	title: 'ping input parameter schema',
})

// define the input payload
export const emailV1PingInputPayloadSchema = extendApi(z.unknown(), {
	title: 'ping input payload schema',
})

// define the output payload
export const emailV1PingOutputPayloadSchema = extendApi(z.unknown(), {
	title: 'ping output payload schema',
})

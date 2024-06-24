import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const theServiceV1InvokeFooInputParameterSchema = extendApi(z.any(), {
	title: 'ping input parameter schema',
})

// define the input payload
export const theServiceV1InvokeFooInputPayloadSchema = extendApi(z.any(), { title: 'ping input payload schema' })

// define the output payload
export const theServiceV1InvokeFooOutputPayloadSchema = extendApi(
	z.object({
		payload: z.any(),
		parameter: z.any(),
	}),
	{
		title: 'ping output payload schema',
	},
)

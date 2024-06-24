import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const delayV1FooBarInputParameterSchema = extendApi(
	z.object({
		p: z.string(),
		q: z.string().optional(),
	}),
	{ title: 'fooBar input parameter schema' },
)

// define the input payload
export const delayV1FooBarInputPayloadSchema = extendApi(z.any(), { title: 'fooBar input payload schema' })

// define the output payload
export const delayV1FooBarOutputPayloadSchema = extendApi(z.any(), { title: 'fooBar output payload schema' })

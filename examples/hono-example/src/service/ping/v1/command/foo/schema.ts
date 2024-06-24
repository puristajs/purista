import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const pingV1FooInputParameterSchema = extendApi(z.object({}), { title: 'foo input parameter schema' })

// define the input payload
export const pingV1FooInputPayloadSchema = z.undefined()

// define the output payload
export const pingV1FooOutputPayloadSchema = extendApi(
	z.object({
		foo: z.string(),
	}),
	{ title: 'foo output payload schema' },
)

import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const userV1RegisterInputParameterSchema = extendApi(z.object({}), { title: 'register input parameter schema' })

// define the input payload
export const userV1RegisterInputPayloadSchema = extendApi(
	z.object({
		name: extendApi(z.string(), { title: 'The users name', example: 'John Doe' }),
		email: extendApi(z.string().email().toLowerCase(), { title: 'The users name', example: 'john_doe@example.com' }),
	}),
	{ title: 'register input payload schema' },
)

// define the output payload
export const userV1RegisterOutputPayloadSchema = extendApi(
	z.object({
		workflowId: extendApi(z.string(), { title: 'the workflow id', example: 'some_random_id' }),
	}),
	{ title: 'register output payload schema' },
)

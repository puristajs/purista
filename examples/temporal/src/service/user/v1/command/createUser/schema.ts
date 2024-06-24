import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const userV1CreateUserInputParameterSchema = extendApi(z.object({}), {
	title: 'createUser input parameter schema',
})

// define the input payload
export const userV1CreateUserInputPayloadSchema = extendApi(
	z.object({
		name: extendApi(z.string(), { title: 'The users name', example: 'John Doe' }),
		email: extendApi(z.string().email().toLowerCase(), { title: 'The users name', example: 'john_doe@example.com' }),
	}),
	{ title: 'createUser input payload schema' },
)

// define the output payload
export const userV1CreateUserOutputPayloadSchema = extendApi(
	z.object({
		userId: extendApi(z.string().uuid(), { title: 'the user id', example: 'adda98ce-0f21-45ca-bee8-326126c9943a' }),
	}),
	{ title: 'createUser output payload schema' },
)

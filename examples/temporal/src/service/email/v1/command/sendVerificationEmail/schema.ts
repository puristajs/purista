import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const emailV1SendVerificationEmailInputParameterSchema = extendApi(z.object({}), {
	title: 'sendVerificationEmail input parameter schema',
})

// define the input payload
export const emailV1SendVerificationEmailInputPayloadSchema = extendApi(
	z.object({
		email: extendApi(z.string().email().toLowerCase(), { title: 'The users name', example: 'john_doe@example.com' }),
	}),
	{
		title: 'sendVerificationEmail input payload schema',
	},
)

// define the output payload
export const emailV1SendVerificationEmailOutputPayloadSchema = extendApi(z.any(), {
	title: 'sendVerificationEmail output payload schema',
})

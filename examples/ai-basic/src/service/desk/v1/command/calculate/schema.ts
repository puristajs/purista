import { extendApi } from '@purista/core'
import { z } from 'zod'

export const calculateInputSchema = extendApi(
	z.object({
		expression: z.string().min(1),
	}),
	{ title: 'Calculate input' },
)

export const calculateOutputSchema = extendApi(
	z.object({
		expression: z.string(),
		result: z.number(),
	}),
	{ title: 'Calculate output' },
)

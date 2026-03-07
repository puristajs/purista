import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const lookupFaqInputSchema = extendApi(
	z.object({
		question: z.string().min(1),
	}),
	{ title: 'Lookup FAQ input' },
)

export const lookupFaqOutputSchema = extendApi(
	z.object({
		answer: z.string(),
	}),
	{ title: 'Lookup FAQ output' },
)

export type LookupFaqInput = z.infer<typeof lookupFaqInputSchema>

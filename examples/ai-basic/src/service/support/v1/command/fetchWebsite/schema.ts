import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const fetchWebsiteInputSchema = extendApi(
	z.object({
		url: z.string().url(),
	}),
	{ title: 'Fetch website input' },
)

export const fetchWebsiteOutputSchema = extendApi(
	z.object({
		url: z.string().url(),
		title: z.string().optional(),
		text: z.string(),
	}),
	{ title: 'Fetch website output' },
)

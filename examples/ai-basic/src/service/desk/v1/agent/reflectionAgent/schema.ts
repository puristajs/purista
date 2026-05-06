import { extendApi } from '@purista/core'
import { z } from 'zod'

export const reflectionAgentInputSchema = extendApi(
	z.object({
		prompt: z.string().min(1),
		sessionId: z.string().min(1).optional(),
	}),
	{ title: 'Reflection agent input' },
)

export const reflectionCritiqueSchema = extendApi(
	z.object({
		accepted: z.boolean(),
		score: z.number().min(0).max(10),
		notes: z.array(z.string().min(1)).min(1),
	}),
	{ title: 'Reflection critique' },
)

export const reflectionAgentResponseSchema = extendApi(
	z.object({
		message: z.string().min(1),
		draft: z.string().min(1),
		critique: reflectionCritiqueSchema,
		iterations: z.number().int().positive(),
		accepted: z.boolean(),
	}),
	{ title: 'Reflection agent response' },
)

export type ReflectionAgentInput = z.infer<typeof reflectionAgentInputSchema>
export type ReflectionCritique = z.infer<typeof reflectionCritiqueSchema>
export type ReflectionAgentResponse = z.infer<typeof reflectionAgentResponseSchema>

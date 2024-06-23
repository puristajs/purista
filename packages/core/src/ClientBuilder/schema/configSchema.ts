import { z } from 'zod'

import { eventBridgeClientConfigSchema } from './eventBridgeClientConfigSchema.js'
import { httpClientConfigSchema } from './httpClientConfigSchema.js'

const clientGenerateBaseConfigSchema = z.object({
	version: z.string(),
	definitionPath: z.string(),
	outputPath: z.string(),
	buildAs: z.enum(['esm', 'commonjs', 'both']).default('both'),
	package: z
		.object({
			name: z.string(),
			description: z.string().default('The client library package for a PURISTA based application'),
			private: z.boolean().default(true),
		})
		.optional(),
})

export const configSchema = clientGenerateBaseConfigSchema.merge(
	z.object({
		httpClient: httpClientConfigSchema.optional(),
		eventBridgeClient: eventBridgeClientConfigSchema.optional(),
	}),
)

export const configFullSchema = clientGenerateBaseConfigSchema.merge(
	z.object({
		httpClient: httpClientConfigSchema,
		eventBridgeClient: eventBridgeClientConfigSchema,
	}),
)

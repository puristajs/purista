import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { compileProviderAiSdkSchema, compileProviderJsonSchema } from './providerJsonSchema.js'

describe('compileProviderJsonSchema', () => {
	it('compiles zod object schemas into provider-safe json schema', async () => {
		const schema = z.object({
			nested: z.object({
				name: z.string(),
			}),
		})

		const compiled = await compileProviderJsonSchema(schema)

		expect(compiled).toMatchObject({
			type: 'object',
			properties: {
				nested: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
						},
					},
					required: ['name'],
					additionalProperties: false,
				},
			},
			required: ['nested'],
			additionalProperties: false,
		})
		expect(JSON.stringify(compiled)).not.toContain('propertyNames')
	})

	it('removes unsupported propertyNames nodes from plain json schema objects too', async () => {
		const compiled = await compileProviderJsonSchema({
			type: 'object',
			propertyNames: {
				type: 'string',
			},
			properties: {
				name: { type: 'string' },
			},
		})

		expect(compiled).toMatchObject({
			type: 'object',
			properties: {
				name: {
					type: 'string',
				},
			},
			additionalProperties: false,
		})
		expect(JSON.stringify(compiled)).not.toContain('propertyNames')
	})

	it('wraps sanitized schemas in an ai-sdk schema with validation support', async () => {
		const source = z.object({
			name: z.string(),
		})

		const compiled = await compileProviderAiSdkSchema(source)
		const compiledJsonSchema = await compiled?.jsonSchema

		expect(compiledJsonSchema).toMatchObject({
			type: 'object',
			properties: {
				name: {
					type: 'string',
				},
			},
			required: ['name'],
			additionalProperties: false,
		})
		expect(await compiled?.validate?.({ name: 'ok' })).toMatchObject({
			success: true,
			value: { name: 'ok' },
		})
		expect(JSON.stringify(compiledJsonSchema)).not.toContain('propertyNames')
	})
})

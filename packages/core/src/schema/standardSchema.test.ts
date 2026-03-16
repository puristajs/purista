import type { StandardSchemaV1 } from '@standard-schema/spec'
import { z } from 'zod'
import { toJSONSchema, validate } from './standardSchema.js'

describe('standardSchema.validate', () => {
	it('treats empty issues as successful validation', async () => {
		const schema = {
			'~standard': {
				version: 1,
				vendor: 'test',
				validate: async () => ({ value: 'ok', issues: [] }),
			},
		} as unknown as StandardSchemaV1

		const result = await validate(schema, 'input')
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data).toBe('ok')
		}
	})

	it('returns failed result when issues are present', async () => {
		const schema = {
			'~standard': {
				version: 1,
				vendor: 'test',
				validate: async () => ({
					issues: [{ message: 'invalid' }],
				}),
			},
		} as unknown as StandardSchemaV1

		const result = await validate(schema, 'input')
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.issues).toHaveLength(1)
		}
	})

	it('converts zod schemas to JSON schema', async () => {
		const schema = z.object({
			name: z.string(),
			enabled: z.boolean().optional(),
		})

		const result = await toJSONSchema(schema)

		expect(result).toMatchObject({
			type: 'object',
			properties: {
				name: { type: 'string' },
				enabled: { type: 'boolean' },
			},
		})
	})

	it('converts zod undefined and void schemas to null json schema', async () => {
		await expect(toJSONSchema(z.undefined())).resolves.toStrictEqual({ type: 'null' })
		await expect(toJSONSchema(z.void())).resolves.toStrictEqual({ type: 'null' })
	})
})

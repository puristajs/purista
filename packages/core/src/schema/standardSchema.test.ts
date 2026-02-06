import type { StandardSchemaV1 } from '@standard-schema/spec'
import { validate } from './standardSchema.js'

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
})

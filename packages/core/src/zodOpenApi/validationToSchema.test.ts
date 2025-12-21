import * as yup from 'yup'
import { z } from 'zod/v4'

import { validationToSchema } from './validationToSchema.js'

describe('validateToSchema', () => {
	it('converts zod schema', async () => {
		const schema = z.object({
			one: z.string(),
			two: z.number().optional(),
		})

		const result = await validationToSchema(schema)

		expect(result).toStrictEqual({
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			additionalProperties: false,
			properties: {
				one: {
					type: 'string',
				},
				two: {
					type: 'number',
				},
			},
			required: ['one'],
			type: 'object',
		})
	})

	it('converts yup schema', async () => {
		const schema = yup.object({
			one: yup.string().required(),
			two: yup.number(),
		})

		const result = await validationToSchema(schema)

		expect(result).toStrictEqual({
			default: {
				one: undefined,
				two: undefined,
			},
			properties: {
				one: {
					type: 'string',
				},
				two: {
					type: 'number',
				},
			},
			required: ['one'],
			type: 'object',
		})
	})
})

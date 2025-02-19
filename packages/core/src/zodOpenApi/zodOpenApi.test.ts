import type { SchemaObject } from 'openapi3-ts/oas31'
import { z } from 'zod'

import { extendApi, generateSchema } from './zodOpenApi.impl.js'

/* eslint-disable max-len */
// from http://goo.gl/0ejHHW
const iso8601 =
	/^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
// same as above, except with a strict 'T' separator between date and time
const iso8601StrictSeparator =
	/^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
/* eslint-enable max-len */
const isValidDate = (str: string) => {
	// str must have passed the ISO8601 check
	// this check is meant to catch invalid dates
	// like 2009-02-31
	// first check for ordinal dates
	const ordinalMatch = str.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/)
	if (ordinalMatch) {
		const oYear = Number(ordinalMatch[1])
		const oDay = Number(ordinalMatch[2])
		// if is leap year
		if ((oYear % 4 === 0 && oYear % 100 !== 0) || oYear % 400 === 0) {
			return oDay <= 366
		}
		return oDay <= 365
	}
	const match = (str.match(/(\d{4})-?(\d{0,2})-?(\d*)/) as RegExpMatchArray).map(Number)
	const year = match[1]
	const month = match[2]
	const day = match[3]
	const monthString = month ? `0${month}`.slice(-2) : month
	const dayString = day ? `0${day}`.slice(-2) : day

	// create a date object and compare
	const d = new Date(`${year}-${monthString || '01'}-${dayString || '01'}`)
	if (month && day) {
		return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day
	}
	return true
}

function isISO8601(str: string, options: any = {}) {
	const check = options.strictSeparator ? iso8601StrictSeparator.test(str) : iso8601.test(str)
	if (check && options.strict) {
		return isValidDate(str)
	}
	return check
}

describe('zodOpenapi', () => {
	/**
	 * Primitives
	 */
	it('should support basic primitives', () => {
		const zodSchema = extendApi(
			z.object({
				aString: z.string().describe('A test string').optional(),
				aNumber: z.number().optional(),
				aBigInt: z.bigint(),
				aBoolean: z.boolean(),
				aDate: z.date(),
			}),
			{
				description: `Primitives also testing overwriting of "required"`,
				required: ['aNumber'], // All schema settings "merge"
			},
		)
		const apiSchema = generateSchema(zodSchema)

		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aString: { description: 'A test string', type: 'string' },
				aNumber: { type: 'number' },
				aBigInt: { type: 'integer', format: 'int64' },
				aBoolean: { type: 'boolean' },
				aDate: { type: 'string', format: 'date-time' },
			},
			required: ['aBigInt', 'aBoolean', 'aDate', 'aNumber'],
			description: 'Primitives also testing overwriting of "required"',
		})
	})

	it('should support empty types', () => {
		const zodSchema = extendApi(
			z.object({
				aUndefined: z.undefined(),
				aNull: z.null(),
				aVoid: z.void(),
			}),
			{
				description: 'Empty types in a schema',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aUndefined: {},
				aNull: { type: 'string', format: 'null', nullable: true },
				aVoid: {},
			},
			required: ['aNull'],
			description: 'Empty types in a schema',
		})
	})

	it('should support proper transform input/output', () => {
		const zodTransform = extendApi(
			z.string().transform(val => val.length),
			{ description: 'Will take in a string, returning the length' },
		)
		const schemaIn = generateSchema(zodTransform)
		expect(schemaIn.type).toBe('string')
		const schemaOut = generateSchema(zodTransform, true)
		expect(schemaOut.type).toBe('number')
	})

	it('should support catch-all types', () => {
		const zodSchema = extendApi(
			z.object({
				aAny: z.any(),
				aUnknown: z.unknown(),
			}),
			{
				description: `Empty types don't belong in schema`,
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema.properties).toBeDefined()
		expect((apiSchema.properties?.aAny as any).nullable).toBe(true)
		expect((apiSchema.properties?.aUnknown as any).nullable).toBe(true)
	})

	it('should support never type', () => {
		const zodSchema = extendApi(
			z.object({
				aNever: z.never(),
			}),
			{
				description: 'Never values! Can not use them!',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema.properties).toBeDefined()
		expect((apiSchema.properties?.aNever as SchemaObject).readOnly).toBe(true)
	})

	it('should support string and string constraints', () => {
		const zodSchema = extendApi(
			z
				.object({
					aStringMax: z.string().max(5),
					aStringMin: z.string().min(3),
					aStringLength: z.string().length(10),
					aStringEmail: z.string().email(),
					aStringUrl: z.string().url(),
					aStringUUID: z.string().uuid(),
					aStringDatetime: z.string().datetime(),
					aStringCUID: z.string().cuid(),
					aStringRegex: z.string().regex(/^[a-zA-Z]+$/),
					aStringNonEmpty: z.string().nonempty(),
				})
				.partial(),
			{
				description: 'This is totally unlike String Theory',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aStringMax: { type: 'string', maxLength: 5 },
				aStringMin: { type: 'string', minLength: 3 },
				aStringLength: { maxLength: 10, minLength: 10, type: 'string' },
				aStringEmail: { type: 'string', format: 'email' },
				aStringUrl: { type: 'string', format: 'uri' },
				aStringUUID: { type: 'string', format: 'uuid' },
				aStringCUID: { type: 'string', format: 'cuid' },
				aStringDatetime: { type: 'string', format: 'date-time' },
				aStringRegex: { type: 'string', pattern: '^[a-zA-Z]+$' },
				aStringNonEmpty: { type: 'string', minLength: 1 },
			},
			description: 'This is totally unlike String Theory',
		})
	})

	it('should support numbers and number constraints', () => {
		const zodSchema = extendApi(
			z
				.object({
					aNumberMin: z.number().min(3),
					aNumberMax: z.number().max(8),
					aNumberInt: z.number().int(),
					aNumberPositive: z.number().positive(),
					aNumberNonnegative: z.number().nonnegative(),
					aNumberNegative: z.number().negative(),
					aNumberNonpositive: z.number().nonpositive(),
					aNumberGt: z.number().gt(5),
					aNumberLt: z.number().lt(5),
					aNumberMultipleOf: z.number().multipleOf(2),
				})
				.partial(),
			{
				description: 'Look mah, the horse can count higher than me!',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aNumberMin: { type: 'number', minimum: 3 },
				aNumberMax: { type: 'number', maximum: 8 },
				aNumberInt: { type: 'integer' },
				aNumberPositive: { type: 'number', minimum: 0, exclusiveMinimum: true },
				aNumberNonnegative: { type: 'number', minimum: 0 },
				aNumberNegative: { type: 'number', maximum: 0, exclusiveMaximum: true },
				aNumberNonpositive: { type: 'number', maximum: 0 },
				aNumberGt: { type: 'number', minimum: 5, exclusiveMinimum: true },
				aNumberLt: { type: 'number', maximum: 5, exclusiveMaximum: true },
				aNumberMultipleOf: { type: 'number', multipleOf: 2 },
			},
			description: 'Look mah, the horse can count higher than me!',
		})
	})

	it('should support arrays and array constraints', () => {
		const zodSchema = extendApi(
			z
				.object({
					aArrayMin: z.array(z.string()).min(3),
					aArrayMax: z.array(z.number()).max(8),
					aArrayLength: z.array(z.boolean()).length(10),
					aArrayNonempty: z.array(z.null()).nonempty(),
					aArrayMinAndMax: z.array(z.number()).min(3).max(8),
				})
				.partial(),
			{
				description: 'I need arrays',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aArrayMin: { type: 'array', minItems: 3, items: { type: 'string' } },
				aArrayMax: { type: 'array', maxItems: 8, items: { type: 'number' } },
				aArrayLength: {
					type: 'array',
					minItems: 10,
					maxItems: 10,
					items: { type: 'boolean' },
				},
				aArrayNonempty: {
					type: 'array',
					minItems: 1,
					items: { type: 'string', format: 'null', nullable: true },
				},
				aArrayMinAndMax: {
					type: 'array',
					minItems: 3,
					maxItems: 8,
					items: { type: 'number' },
				},
			},
			description: 'I need arrays',
		})
	})

	describe('record support', () => {
		describe('with a value type', () => {
			it('adds the value type to additionalProperties', () => {
				const zodSchema = extendApi(z.record(z.number().min(2).max(42)), {
					description: 'Record this one for me.',
				})
				const apiSchema = generateSchema(zodSchema)
				expect(apiSchema).toEqual({
					type: 'object',
					additionalProperties: { type: 'number', minimum: 2, maximum: 42 },
					description: 'Record this one for me.',
				})
			})
		})

		describe('with unknown value types', () => {
			it('leaves additionalProperties blank', () => {
				const zodSchema = extendApi(z.record(z.unknown()), {
					description: 'Record this one for me.',
				})
				const apiSchema = generateSchema(zodSchema)
				expect(apiSchema).toEqual({
					type: 'object',
					additionalProperties: {},
					description: 'Record this one for me.',
				})
			})
		})
	})

	it('should support schemas with a default', () => {
		const zodSchema = extendApi(
			z.object({
				aString: z.string().default('hello'),
				aStringWithConstraints: z.string().email().max(100).default('hello'),
				aNumber: z.number().default(42),
				aNumberWithRestrictions: z.number().min(2).max(42).default(42),
				aBoolean: z.boolean().default(false),
				nonDefaulted: z.string(),
			}),
			{
				description: 'I defaulted on my debt',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aString: { type: 'string', default: 'hello' },
				aStringWithConstraints: {
					type: 'string',
					format: 'email',
					maxLength: 100,
					default: 'hello',
				},
				aNumber: { type: 'number', default: 42 },
				aNumberWithRestrictions: {
					type: 'number',
					minimum: 2,
					maximum: 42,
					default: 42,
				},
				aBoolean: { type: 'boolean', default: false },
				nonDefaulted: { type: 'string' },
			},
			required: ['nonDefaulted'],
			description: 'I defaulted on my debt',
		})
	})

	it('should support an object schema that has a default on itself', () => {
		const zodSchema = extendApi(
			z
				.object({
					aString: z.string(),
					aNumber: z.number(),
				})
				.default({
					aString: 'hello',
					aNumber: 42,
				}),
			{
				description: 'I defaulted on my debt',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			properties: {
				aString: { type: 'string' },
				aNumber: { type: 'number' },
			},
			default: {
				aString: 'hello',
				aNumber: 42,
			},
			required: ['aString', 'aNumber'],
			description: 'I defaulted on my debt',
		})
	})

	it('should support `catchall` on an object schema', () => {
		const zodSchema = extendApi(
			z
				.object({
					aString: z.string(),
					aNumber: z.number(),
				})
				.catchall(
					z.object({
						email: z.string().email(),
						available: z.boolean(),
					}),
				),
			{
				description: "Gotta catch 'em all!",
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			required: ['aString', 'aNumber'],
			properties: {
				aString: { type: 'string' },
				aNumber: { type: 'number' },
			},
			additionalProperties: {
				type: 'object',
				properties: {
					email: { type: 'string', format: 'email' },
					available: { type: 'boolean' },
				},
				required: ['email', 'available'],
			},
			description: "Gotta catch 'em all!",
		})
	})

	it('should support `passthrough` on an object schema', () => {
		const zodSchema = extendApi(
			z
				.object({
					aString: z.string(),
					aNumber: z.number(),
				})
				.passthrough(),
			{
				description: "Gotta catch 'em all!",
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			required: ['aString', 'aNumber'],
			properties: {
				aString: { type: 'string' },
				aNumber: { type: 'number' },
			},
			additionalProperties: true,
			description: "Gotta catch 'em all!",
		})
	})

	it('should support `strict` on an object schema', () => {
		const zodSchema = extendApi(
			z
				.object({
					aString: z.string(),
					aNumber: z.number(),
				})
				.strict(),
			{
				description: 'Super strict',
			},
		)
		const apiSchema = generateSchema(zodSchema)
		expect(apiSchema).toEqual({
			type: 'object',
			required: ['aString', 'aNumber'],
			properties: {
				aString: { type: 'string' },
				aNumber: { type: 'number' },
			},
			additionalProperties: false,
			description: 'Super strict',
		})
	})

	it('Testing large mixed schema', () => {
		enum Fruits {
			Apple = 0,
			Banana = 1,
		}

		const MoreFruits = {
			Pear: 'pear',
			Plumb: 'plumb',
			grapes: 3,
		} as const

		const zodSchema = z.object({
			name: extendApi(z.string(), { description: 'User full name' }),
			email: extendApi(z.string().email().min(4), {
				description: 'User email',
			}),
			whatever: z.string().optional(),
			myCollection: extendApi(z.array(z.object({ name: z.string(), count: z.number() })), { maxItems: 10 }),
			timeStamp: z.string().refine(isISO8601),
			literals: z.object({
				wordOne: z.literal('One').nullable(),
				numberTwo: z.literal(2).optional(),
				isThisTheEnd: z.literal(false).optional().nullable(),
			}),
			catchall: z
				.object({
					email: z.string().email(),
					joined: z.date().optional(),
				})
				.catchall(z.object({ name: z.string(), value: z.string() })),
			foodTest: extendApi(
				z.object({
					fishEnum: extendApi(z.enum(['Salmon', 'Tuna', 'Trout']), {
						description: 'Choose your fish',
						default: 'Salmon',
					}),
					fruitEnum: z.nativeEnum(Fruits).default(Fruits.Banana),
					moreFruitsEnum: z.nativeEnum(MoreFruits),
				}),
				{ description: 'Have some lunch' },
			),
			employedPerson: extendApi(
				z.intersection(
					z.object({ name: z.string() }),
					z.object({
						role: z.enum(['manager', 'employee', 'intern', 'hopeful']),
					}),
				),
				{ description: 'Our latest addition' },
			),
			makeAChoice: z.union([z.literal('One'), z.literal(2)]),
			chooseAPet: z.discriminatedUnion('animal', [
				z.object({
					animal: z.literal('dog'),
					theBestQuality: z.literal('fleas'),
				}),
				z.object({
					animal: z.literal('cat'),
					theBestQuality: z.literal('stink'),
				}),
			]),
			openChoice: extendApi(z.union([z.string(), z.string()]), {
				description: 'Odd pattern here',
			}),
			aNullish: z.string().nullish(),
			stringLengthOutput: z.string().transform(val => val.length),
			favourites: z.record(z.object({ name: z.string(), watchCount: z.number() })),
			limit: z.number().default(200),
			freeform: z
				.object({
					name: z.string(),
				})
				.passthrough(),
		})

		const schemaTest = generateSchema(zodSchema, true)

		expect(schemaTest).toEqual({
			type: 'object',
			properties: {
				name: { type: 'string', description: 'User full name' },
				email: {
					type: 'string',
					format: 'email',
					minLength: 4,
					description: 'User email',
				},
				whatever: { type: 'string' },
				myCollection: {
					type: 'array',
					items: {
						type: 'object',
						properties: { name: { type: 'string' }, count: { type: 'number' } },
						required: ['name', 'count'],
					},
					maxItems: 10,
				},
				timeStamp: { type: 'string' },
				literals: {
					type: 'object',
					properties: {
						wordOne: { nullable: true, type: 'string', enum: ['One'] },
						numberTwo: { type: 'number', enum: [2] },
						isThisTheEnd: { nullable: true, type: 'boolean', enum: [false] },
					},
					required: ['wordOne'],
				},
				catchall: {
					type: 'object',
					properties: {
						email: { type: 'string', format: 'email' },
						joined: { type: 'string', format: 'date-time' },
					},
					required: ['email'],
					additionalProperties: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							value: { type: 'string' },
						},
						required: ['name', 'value'],
					},
				},
				foodTest: {
					type: 'object',
					properties: {
						fishEnum: {
							type: 'string',
							enum: ['Salmon', 'Tuna', 'Trout'],
							description: 'Choose your fish',
							default: 'Salmon',
						},
						fruitEnum: {
							type: 'string',
							enum: ['Apple', 'Banana', 0, 1],
							default: 1,
						},
						moreFruitsEnum: { type: 'string', enum: ['pear', 'plumb', 3] },
					},
					required: ['fishEnum', 'moreFruitsEnum'],
					description: 'Have some lunch',
				},
				employedPerson: {
					allOf: [
						{
							type: 'object',
							properties: { name: { type: 'string' } },
							required: ['name'],
						},
						{
							type: 'object',
							properties: {
								role: {
									type: 'string',
									enum: ['manager', 'employee', 'intern', 'hopeful'],
								},
							},
							required: ['role'],
						},
					],
					description: 'Our latest addition',
				},
				makeAChoice: {
					oneOf: [
						{ type: 'string', enum: ['One'] },
						{ type: 'number', enum: [2] },
					],
				},
				chooseAPet: {
					discriminator: {
						propertyName: 'animal',
					},
					oneOf: [
						{
							properties: {
								animal: {
									enum: ['dog'],
									type: 'string',
								},
								theBestQuality: {
									enum: ['fleas'],
									type: 'string',
								},
							},
							required: ['animal', 'theBestQuality'],
							type: 'object',
						},
						{
							properties: {
								animal: {
									enum: ['cat'],
									type: 'string',
								},
								theBestQuality: {
									enum: ['stink'],
									type: 'string',
								},
							},
							required: ['animal', 'theBestQuality'],
							type: 'object',
						},
					],
				},
				openChoice: {
					oneOf: [{ type: 'string' }, { type: 'string' }],
					description: 'Odd pattern here',
				},
				aNullish: { nullable: true, type: 'string' },
				stringLengthOutput: { type: 'number' },
				favourites: {
					type: 'object',
					additionalProperties: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							watchCount: { type: 'number' },
						},
						required: ['name', 'watchCount'],
					},
				},
				limit: { type: 'number', default: 200 },
				freeform: {
					type: 'object',
					properties: {
						name: { type: 'string' },
					},
					additionalProperties: true,
					required: ['name'],
				},
			},
			required: [
				'name',
				'email',
				'myCollection',
				'timeStamp',
				'literals',
				'catchall',
				'foodTest',
				'employedPerson',
				'makeAChoice',
				'chooseAPet',
				'openChoice',
				'stringLengthOutput',
				'favourites',
				'freeform',
			],
		})

		// const builder = OpenApiBuilder.create();
		// builder.addSchema('Users', schemaTest);
		// builder;
	})

	it('Experimentation', () => {
		const UserZ = z.object({
			uid: extendApi(z.string().nonempty(), {
				description: 'A firebase generated UUID',
				format: 'firebase-uuid',
			}),
			theme: extendApi(z.enum(['light', 'dark']), {
				description: 'Defaults to light theme',
				default: 'light',
			}),
			email: z.string().email().optional(),
			phoneNumber: z.string().min(10).optional(),
		})

		const openApiSchema: SchemaObject = generateSchema(UserZ)

		expect(openApiSchema.properties).toBeDefined()
	})

	it('Take any Zod schema and convert it to an OpenAPI JSON object', () => {
		const aZodSchema = z.object({
			uid: z.string().nonempty(),
			firstName: z.string().min(2),
			lastName: z.string().optional(),
			email: z.string().email(),
			phoneNumber: z.string().min(10).optional(),
		})

		const myOpenApiSchema = generateSchema(aZodSchema)

		expect(myOpenApiSchema).toEqual({
			type: 'object',
			properties: {
				uid: { type: 'string', minLength: 1 },
				firstName: { type: 'string', minLength: 2 },
				lastName: { type: 'string' },
				email: { type: 'string', format: 'email' },
				phoneNumber: { type: 'string', minLength: 10 },
			},
			required: ['uid', 'firstName', 'email'],
		})
	})

	it('Extend a Zod schema with additional OpenAPI schema via a function wrapper', () => {
		const aZodExtendedSchema = extendApi(
			z.object({
				uid: extendApi(z.string().nonempty(), {
					title: 'Unique ID',
					description: 'A UUID generated by the server',
				}),
				firstName: z.string().min(2),
				lastName: z.string().optional(),
				email: z.string().email(),
				phoneNumber: extendApi(z.string().min(10), {
					description: 'US Phone numbers only',
					example: '555-555-5555',
				}),
			}),
			{
				title: 'User',
				description: 'A user schema',
			},
		)

		const myOpenApiSchema = generateSchema(aZodExtendedSchema)

		expect(myOpenApiSchema).toEqual({
			type: 'object',
			properties: {
				uid: {
					type: 'string',
					minLength: 1,
					title: 'Unique ID',
					description: 'A UUID generated by the server',
				},
				firstName: { type: 'string', minLength: 2 },
				lastName: { type: 'string' },
				email: { type: 'string', format: 'email' },
				phoneNumber: {
					type: 'string',
					minLength: 10,
					description: 'US Phone numbers only',
					example: '555-555-5555',
				},
			},
			required: ['uid', 'firstName', 'email', 'phoneNumber'],
			title: 'User',
			description: 'A user schema',
		})
	})

	it('merges openapi metadata when extendApi is used more than one', () => {
		const timestampSchema = extendApi(z.string(), {
			format: 'date-time',
			description: 'A timestamp.',
		})

		const newDescription = 'A more specific timestamp.'

		const overriddenSchema = extendApi(timestampSchema, {
			description: newDescription,
		})

		const openapiSchema = generateSchema(overriddenSchema)

		expect(openapiSchema).toMatchObject({
			type: 'string',
			format: 'date-time',
			description: newDescription,
		})
	})

	it('Can cast a string to binary type', () => {
		const binarySchema = extendApi(z.string(), {
			format: 'binary',
		})

		const openapiSchema = generateSchema(binarySchema)

		expect(openapiSchema).toMatchObject({
			type: 'string',
			format: 'binary',
		})
	})
})

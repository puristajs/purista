import { z } from 'zod'

import { HarnessHostToolBuilder } from './hostToolBuilder.js'

describe('HarnessHostToolBuilder', () => {
	it('builds one synchronous immutable capability declaration', () => {
		const outputSchema = z.object({ value: z.string() })
		const payloadSchema = z.object({ id: z.string() })
		const parameterSchema = z.object({ requestId: z.string() })
		const eventSchema = z.object({ id: z.string() })

		const definition = new HarnessHostToolBuilder<{ id: string }, { value: string }>()
			.canInvoke('Records', '1', 'load', outputSchema, payloadSchema, parameterSchema)
			.canConsumeStream('Records', '1', 'watch', z.string(), payloadSchema, parameterSchema, z.string())
			.canEnqueue('records.audit', payloadSchema, parameterSchema)
			.canEmit('record.loaded', eventSchema)
			.setHandler(async (_context, input) => ({ value: input.id }))
			.getDefinition()

		expect(definition).toMatchObject({
			kind: 'purista-host-tool',
			invokes: {
				Records: { '1': { load: { outputSchema, payloadSchema, parameterSchema } } },
			},
			streamInvokes: {
				Records: {
					'1': {
						watch: {
							chunkSchema: expect.anything(),
							finalSchema: expect.anything(),
							payloadSchema,
							parameterSchema,
							validateChunk: true,
							validateFinal: true,
						},
					},
				},
			},
			queueInvokes: { 'records.audit': { payloadSchema, parameterSchema } },
			emitList: { 'record.loaded': eventSchema },
		})
		expect(Object.isFrozen(definition)).toBe(true)
		expect(Object.isFrozen(definition.invokes.Records?.['1']?.load)).toBe(true)
		expect(Object.isFrozen(definition.queueInvokes['records.audit'])).toBe(true)
	})

	it('fails immediately when no handler was set', () => {
		expect(() => new HarnessHostToolBuilder<string, string>().getDefinition()).toThrow(
			'A Harness host tool requires setHandler(...) before getDefinition().',
		)
	})
})

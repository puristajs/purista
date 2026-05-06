import { z } from 'zod'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createStreamContextMock } from './createStreamContextMock.js'
import { createStreamTestHarness } from './createStreamTestHarness.js'

describe('stream testing helpers', () => {
	it('captures chunks and final payloads in the stream context mock', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'StreamService',
			serviceVersion: '1',
			serviceDescription: 'stream test service',
		})

		const streamBuilder = serviceBuilder
			.getStreamBuilder('searchUsers', 'search users')
			.addPayloadSchema(z.object({ query: z.string() }))
			.addParameterSchema(z.object({}))
			.addChunkSchema(z.object({ id: z.string() }))
			.addFinalSchema(z.object({ total: z.number() }))
			.setStreamFunction(async function (_context, payload, _parameter, writer) {
				await writer.write({ id: `${payload.query}-1` })
				await writer.close({ total: 1 })
			})

		const mock = createStreamContextMock(streamBuilder, {
			payload: { query: 'ada' },
			parameter: {},
		})

		await streamBuilder.getStreamFunction().call({} as never, mock.context, { query: 'ada' }, {}, mock.writer)

		expect(mock.chunks).toStrictEqual([{ id: 'ada-1' }])
		expect(mock.finalValue).toStrictEqual({ total: 1 })
	})

	it('executes one stream through the runtime harness', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'HarnessStreamService',
			serviceVersion: '1',
			serviceDescription: 'stream harness service',
		})

		const streamBuilder = serviceBuilder
			.getStreamBuilder('progress', 'progress stream')
			.addPayloadSchema(z.object({ task: z.string() }))
			.addParameterSchema(z.object({}))
			.addChunkSchema(z.object({ step: z.string() }))
			.addFinalSchema(z.object({ done: z.boolean() }))
			.setStreamFunction(async function (_context, payload, _parameter, writer) {
				await writer.write({ step: `${payload.task}:started` })
				await writer.close({ done: true })
			})

		serviceBuilder.addStreamDefinition(streamBuilder.getDefinition())

		const harness = await createStreamTestHarness(serviceBuilder, streamBuilder)

		try {
			const result = await harness.run({
				payload: { task: 'sync' },
				parameter: {},
			})

			expect(result.chunks).toStrictEqual([{ step: 'sync:started' }])
			expect(result.final).toStrictEqual({ done: true })
		} finally {
			await harness.destroy()
		}
	})
})

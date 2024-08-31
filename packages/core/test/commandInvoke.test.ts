import { createSandbox } from 'sinon'

import { theServiceV1Service } from '../../../test/service/theService/v1/index.js'
import { type Command, type CommandErrorResponse, DefaultEventBridge, EBMessageType } from '../src/index.js'

describe('command invoke test', () => {
	const sandbox = createSandbox()
	const eventBridge = new DefaultEventBridge({})

	let service: Awaited<ReturnType<typeof theServiceV1Service.getInstance>>

	beforeAll(async () => {
		await eventBridge.start()
		service = await theServiceV1Service.getInstance(eventBridge, {})
		await service.start()
	})

	afterAll(async () => {
		await eventBridge.destroy()
		await service.destroy()
		sandbox.restore()
	})

	it('does not fail if schema is matching', async () => {
		const payload = 'the payload'
		const parameter = 'the parameter'

		const result = await service.executeCommand({
			receiver: {
				serviceName: 'theService',
				serviceVersion: 'v1',
				serviceTarget: 'invokeFoo',
			},
			correlationId: '1',
			payload: {
				payload,
				parameter,
			},
		} as Readonly<Command>)

		expect(result.payload).toStrictEqual({
			payload,
			parameter,
		})
	})

	it('does fail if schema is not matching', async () => {
		const payload = 'the payload'
		const parameter = 'the parameter'

		const result = (await service.executeCommand({
			receiver: {
				serviceTarget: 'invokeFooFailed',
			},
			correlationId: '1',
			payload: {
				payload,
				parameter,
			},
		} as Readonly<Command>)) as CommandErrorResponse

		expect(result.isHandledError).toBeFalsy()
		expect(result.messageType).toStrictEqual(EBMessageType.CommandErrorResponse)
		expect(result.payload.status).toBe(500)
	})
})

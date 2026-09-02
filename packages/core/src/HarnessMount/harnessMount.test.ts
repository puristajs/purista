import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { z } from 'zod'

import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { commandAsHarnessTool } from './types.js'

const echoHarness = defineHarness({ name: 'echo' })
	.agent('echo', {
		input: z.object({ value: z.string() }),
		output: z.object({ value: z.string() }),
		handler: async ({ input }) => ({ value: input.value }),
	})
	.agent('private_agent', {
		input: z.string(),
		output: z.string(),
		handler: async ({ input }) => input,
	})
	.define()

describe('ServiceBuilder.mountHarness', () => {
	it('publishes an explicitly selected agent at its versioned EventBridge address', async () => {
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()

		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		}).mountHarness(echoHarness, { publish: { agents: ['echo'] } })

		const service = await builder.getInstance(eventBridge, { ai: { models: {} } })
		await service.start()

		expect(builder.getCommandDefinitions()).toEqual([])

		const command = getCommandMessageMock({
			tenantId: 'tenant-a',
			principalId: 'principal-a',
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'echo' },
			payload: {
				payload: { value: 'through-the-bridge' },
				parameter: { sessionId: 'conversation-1' },
			},
		})
		const {
			id: _id,
			messageType: _messageType,
			timestamp: _timestamp,
			correlationId: _correlationId,
			...request
		} = command

		await expect(eventBridge.invoke(request)).resolves.toMatchObject({
			status: 'completed',
			output: { value: 'through-the-bridge' },
		})

		await service.destroy()
	})

	it('keeps unpublished agents unavailable through the EventBridge', async () => {
		const eventBridge = new DefaultEventBridge({ defaultCommandTimeout: 250 })
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		}).mountHarness(echoHarness, { publish: { agents: ['echo'] } })
		const service = await builder.getInstance(eventBridge, { ai: { models: {} } })
		await service.start()

		const command = getCommandMessageMock({
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'private_agent' },
			payload: { payload: 'hidden', parameter: {} },
		})
		const {
			id: _id,
			messageType: _messageType,
			timestamp: _timestamp,
			correlationId: _correlationId,
			...request
		} = command

		await expect(eventBridge.invoke(request)).rejects.toMatchObject({ errorCode: 502 })
		await service.destroy()
	})

	it('streams portable execution events and the same terminal outcome through the EventBridge', async () => {
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		}).mountHarness(echoHarness, { publish: { agents: ['echo'] } })
		const service = await builder.getInstance(eventBridge, { ai: { models: {} } })
		await service.start()

		const seed = getCommandMessageMock()
		const stream = await eventBridge.openStream({
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: seed.traceId,
			principalId: 'principal-a',
			tenantId: 'tenant-a',
			sender: seed.sender,
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'echo' },
			payload: {
				frameType: 'open',
				payload: { value: 'streamed' },
				parameter: { sessionId: 'conversation-2' },
			},
		})

		const frames = []
		for await (const frame of stream) frames.push(frame.payload)

		expect(frames).toEqual([
			expect.objectContaining({ frameType: 'start', sequence: 0 }),
			expect.objectContaining({
				frameType: 'chunk',
				sequence: 1,
				chunk: expect.objectContaining({ type: 'run.started' }),
			}),
			expect.objectContaining({
				frameType: 'complete',
				sequence: 2,
				final: expect.objectContaining({ status: 'completed', output: { value: 'streamed' } }),
			}),
		])

		await service.destroy()
	})

	it('invokes a mounted agent from a command through the typed address-first client', async () => {
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const knowledgeBuilder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		}).mountHarness(echoHarness, { publish: { agents: ['echo'] } })

		const apiBuilder = new ServiceBuilder({
			serviceName: 'Api',
			serviceVersion: '1',
			serviceDescription: 'Typed Harness caller',
		})
		const ask = apiBuilder
			.getCommandBuilder('ask', 'Invoke the echo agent')
			.addPayloadSchema(z.object({ value: z.string() }))
			.canInvokeAgent('Knowledge', '1', 'echo', echoHarness.contracts.agents.echo)
			.setCommandFunction(async function ({ agent }, payload) {
				return agent.Knowledge['1'].echo.run(payload, { sessionId: 'conversation-3' })
			})
		apiBuilder.addCommandDefinition(ask.getDefinition())

		const knowledge = await knowledgeBuilder.getInstance(eventBridge, { ai: { models: {} } })
		const api = await apiBuilder.getInstance(eventBridge)
		await knowledge.start()
		await api.start()

		const command = getCommandMessageMock({
			receiver: { serviceName: 'Api', serviceVersion: '1', serviceTarget: 'ask' },
			payload: { payload: { value: 'typed-address' }, parameter: {} },
		})
		const {
			id: _id,
			messageType: _messageType,
			timestamp: _timestamp,
			correlationId: _correlationId,
			...request
		} = command

		await expect(eventBridge.invoke(request)).resolves.toMatchObject({
			status: 'completed',
			output: { value: 'typed-address' },
		})

		await api.destroy()
		await knowledge.destroy()
	})

	it('adapts a declared host tool to an address-first PURISTA command with trusted identity', async () => {
		const provider = new FakeModelProvider()
		provider.enqueue({
			object: {},
			toolCalls: [{ id: 'lookup-1', name: 'lookup_account', arguments: { accountId: 'account-1' } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		provider.enqueue({
			object: { decision: 'approved' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const reviewHarness = defineHarness({ name: 'review' })
			.requireModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.hostTool('lookup_account', {
				kind: 'host',
				description: 'Look up an account.',
				input: z.object({ accountId: z.string() }),
				output: z.object({ owner: z.string() }),
			})
			.agent('review', {
				model: 'primary',
				input: z.object({ accountId: z.string() }),
				output: z.object({ decision: z.string() }),
				instructions: 'Use lookup_account before deciding.',
				tools: ['lookup_account'],
			})
			.define()

		const identities: unknown[] = []
		const accountBuilder = new ServiceBuilder({
			serviceName: 'Account',
			serviceVersion: '1',
			serviceDescription: 'Account lookup service',
		})
		const lookupCommand = accountBuilder
			.getCommandBuilder('lookupAccount', 'Look up an account')
			.addPayloadSchema(z.object({ accountId: z.string() }))
			.addOutputSchema(z.object({ owner: z.string() }))
			.setCommandFunction(async function (context) {
				identities.push({ tenantId: context.message.tenantId, principalId: context.message.principalId })
				return { owner: 'Ada' }
			})
		accountBuilder.addCommandDefinition(lookupCommand.getDefinition())

		const knowledgeBuilder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		}).mountHarness(reviewHarness, {
			publish: { agents: ['review'] },
			hostTools: {
				lookup_account: commandAsHarnessTool('Account', '1', 'lookupAccount'),
			},
		})

		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const accountService = await accountBuilder.getInstance(eventBridge)
		const knowledgeService = await knowledgeBuilder.getInstance(eventBridge, {
			ai: { models: { primary: { provider, model: 'fake' } } },
		})
		await accountService.start()
		await knowledgeService.start()

		const command = getCommandMessageMock({
			tenantId: 'tenant-a',
			principalId: 'principal-a',
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'review' },
			payload: { payload: { accountId: 'account-1' }, parameter: {} },
		})
		const {
			id: _id,
			messageType: _messageType,
			timestamp: _timestamp,
			correlationId: _correlationId,
			...request
		} = command

		await expect(eventBridge.invoke(request)).resolves.toMatchObject({
			status: 'completed',
			output: { decision: 'approved' },
		})
		expect(identities).toEqual([{ tenantId: 'tenant-a', principalId: 'principal-a' }])

		await knowledgeService.destroy()
		await accountService.destroy()
	})

	it('types publish targets from the native Harness catalog', () => {
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		})

		// @ts-expect-error unknown agent names cannot be published
		builder.mountHarness(echoHarness, { publish: { agents: ['missing'] } })
	})
})

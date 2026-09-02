import type { RunOutcome, ToolApprovalInterrupt } from '@purista/harness'
import { defineHarness, ModelAdmissionRejectedError } from '@purista/harness'
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

const embeddingHarness = defineHarness({ name: 'embedding' })
	.requireModel('embedding', { capabilities: ['embeddings'] })
	.define()

const admittedHarness = defineHarness({ name: 'admitted' })
	.requireModel('primary', { capabilities: ['object'] })
	.agent('answer', {
		model: 'primary',
		input: z.string(),
		output: z.string(),
		instructions: 'Answer the request.',
	})
	.define()

const hostToolHarness = defineHarness({ name: 'host-tool' })
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

	it('exposes provider admission backpressure as a retryable 429 response', async () => {
		const provider = new FakeModelProvider()
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Admission-controlled Harness service',
		}).mountHarness(admittedHarness, { publish: { agents: ['answer'] } })
		const service = await builder.getInstance(eventBridge, {
			ai: {
				models: { primary: { provider, model: 'fake' } },
				admission: {
					acquire: async request => {
						throw new ModelAdmissionRejectedError(2_500, {
							providerId: request.providerId,
							model: request.model,
							credentialScope: request.credentialScope,
							operation: request.operation,
						})
					},
				},
			},
		})
		await service.start()

		const command = getCommandMessageMock({
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'answer' },
			payload: { payload: 'hello', parameter: {} },
		})
		const { id: _id, messageType: _type, timestamp: _timestamp, correlationId: _correlation, ...request } = command
		await expect(eventBridge.invoke(request)).rejects.toMatchObject({
			errorCode: 429,
			data: { code: 'MODEL_ADMISSION_REJECTED', retriable: true, retryAfterMs: 2_500 },
		})
		await service.destroy()
	})

	it('exposes only explicitly declared mounted model handles to native handlers', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1, 0.2] }],
			usage: { inputTokens: 1, outputTokens: 0, totalTokens: 1 },
		})
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted model test service',
		}).mountHarness(embeddingHarness, { publish: {} })
		const command = builder
			.getCommandBuilder('embedText', 'Embed text')
			.addPayloadSchema(z.object({ text: z.string() }))
			.addOutputSchema(z.object({ vector: z.array(z.number()) }))
			.canUseHarnessModel(embeddingHarness, 'embedding')
			.setCommandFunction(async function ({ model }, payload) {
				const result = await model.embedding.embed({ input: payload.text }, new AbortController().signal)
				// @ts-expect-error the alias declares embeddings, not text generation
				void model.embedding.text
				const embedding = result.embeddings[0]
				if (!embedding) throw new Error('The model returned no embedding.')
				return { vector: [...embedding.vector] }
			})
		builder.addCommandDefinition(command.getDefinition())

		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { embedding: { provider, model: 'fake-embedding' } } },
		})
		await service.start()

		const request = getCommandMessageMock({
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'embedText' },
			payload: { payload: { text: 'hello' }, parameter: {} },
		})
		const { id: _id, messageType: _type, timestamp: _timestamp, correlationId: _correlation, ...message } = request
		await expect(eventBridge.invoke(message)).resolves.toEqual({ vector: [0.1, 0.2] })
		provider.assertExhausted()
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
				frameType: 'chunk',
				sequence: 2,
				chunk: expect.objectContaining({
					type: 'run.finished',
					outcome: expect.objectContaining({ status: 'completed', output: { value: 'streamed' } }),
				}),
			}),
			expect.objectContaining({
				frameType: 'complete',
				sequence: 3,
				final: expect.objectContaining({ status: 'completed', output: { value: 'streamed' } }),
			}),
		])

		await service.destroy()
	})

	it('resumes a tool approval over the same address-first EventBridge stream', async () => {
		const provider = new FakeModelProvider()
		provider.enqueue({
			object: {},
			toolCalls: [{ id: 'transfer-1', name: 'transfer', arguments: { amount: 250 } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		let transfers = 0
		const approvalHarness = defineHarness({ name: 'approval' })
			.requireModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.tool('transfer', {
				description: 'Transfer money.',
				input: z.object({ amount: z.number() }),
				output: z.object({ transferred: z.number() }),
				handler: async (_context, input) => {
					transfers += 1
					return { transferred: input.amount }
				},
			})
			.agent('approve_transfer', {
				model: 'primary',
				input: z.string(),
				output: z.string(),
				instructions: 'Use the transfer tool.',
				tools: ['transfer'],
				builtinTools: false,
			})
			.governance(({ native, rule }) => ({
				defaultEffect: 'allow',
				policies: [
					native({
						id: 'transfer-approval',
						rules: [rule({ id: 'review-transfer', effect: 'require_approval', tools: ['transfer'] })],
					}),
				],
			}))
			.define()

		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted approval Harness test service',
		}).mountHarness(approvalHarness, { publish: { agents: ['approve_transfer'] } })
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { primary: { provider, model: 'fake' } } },
		})
		await service.start()

		const command = getCommandMessageMock({
			tenantId: 'tenant-a',
			principalId: 'principal-a',
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'approve_transfer' },
			payload: { payload: 'transfer', parameter: { sessionId: 'approval-session' } },
		})
		const {
			id: _id,
			messageType: _messageType,
			timestamp: _timestamp,
			correlationId: _correlationId,
			...request
		} = command
		const first = (await eventBridge.invoke(request)) as RunOutcome<string, ToolApprovalInterrupt>
		expect(first).toMatchObject({ status: 'interrupted', interrupt: { type: 'tool-approval' } })
		if (first.status !== 'interrupted') {
			throw new Error('Expected a tool approval interruption.')
		}
		const approval = first.interrupt.requests[0]
		if (!approval) throw new Error('Expected one approval request.')
		expect(transfers).toBe(0)

		provider.enqueue({
			object: 'done',
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const seed = getCommandMessageMock()
		const stream = await eventBridge.openStream({
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: seed.traceId,
			principalId: 'principal-a',
			tenantId: 'tenant-a',
			sender: seed.sender,
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'approve_transfer' },
			payload: {
				frameType: 'open',
				payload: 'transfer',
				parameter: {
					sessionId: 'approval-session',
					resume: {
						type: 'tool-approval',
						runId: first.runId,
						interruptId: first.interrupt.id,
						revision: first.interrupt.revision,
						eventId: 'approval-decision-1',
						decisions: [{ approvalId: approval.approvalId, approved: true }],
					},
				},
			},
		})
		const frames = []
		for await (const frame of stream) frames.push(frame.payload)

		expect(frames).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					frameType: 'chunk',
					chunk: expect.objectContaining({ type: 'approval.responded', approved: true }),
				}),
				expect.objectContaining({
					frameType: 'complete',
					final: expect.objectContaining({ status: 'completed', output: 'done' }),
				}),
			]),
		)
		expect(transfers).toBe(1)
		expect(provider.requests).toHaveLength(2)
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

	it('runs resource-backed business guards and publishes a completed outcome as a fact', async () => {
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const guardCalls: string[] = []
		const receivedFacts: unknown[] = []
		await eventBridge.registerSubscription(
			{
				sender: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'echo' },
				eventName: 'knowledge.answerCompleted',
				subscriber: { serviceName: 'Audit', serviceVersion: '1', serviceTarget: 'recordAnswer' },
				eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
			},
			async message => {
				receivedFacts.push(message.payload)
				return undefined
			},
		)

		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Guarded mounted Harness service',
		})
			.defineResource<'accountAccess', { canUseAccount(principalId: string, accountId: string): boolean }>()
			.mountHarness(echoHarness, {
				publish: { agents: ['echo'] },
				targets: {
					agents: {
						echo: {
							beforeGuards: {
								accountAccess: async (context, input) => {
									if (
										!context.identity.principalId ||
										!context.resources.accountAccess.canUseAccount(context.identity.principalId, input.value)
									) {
										throw new Error('Account access denied')
									}
									guardCalls.push(`before:${input.value}`)
								},
							},
							afterGuards: {
								completed: async (_context, outcome) => {
									guardCalls.push(`after:${outcome.status}`)
								},
							},
							successEvent: 'knowledge.answerCompleted',
						},
					},
				},
			})
		const service = await builder.getInstance(eventBridge, {
			ai: { models: {} },
			resources: {
				accountAccess: {
					canUseAccount: (principalId, accountId) => principalId === 'principal-a' && accountId === 'allowed',
				},
			},
		})
		await service.start()

		const command = getCommandMessageMock({
			principalId: 'principal-a',
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'echo' },
			payload: { payload: { value: 'allowed' }, parameter: {} },
		})
		const {
			id: _id,
			messageType: _messageType,
			timestamp: _timestamp,
			correlationId: _correlationId,
			...request
		} = command
		await eventBridge.invoke(request)
		await new Promise(resolve => process.nextTick(resolve))

		expect(guardCalls).toEqual(['before:allowed', 'after:completed'])
		expect(receivedFacts).toEqual([expect.objectContaining({ status: 'completed', output: { value: 'allowed' } })])
		await service.destroy()
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

		const commandCalls: unknown[] = []
		const resourceCurrencies: string[] = []
		const accountBuilder = new ServiceBuilder({
			serviceName: 'Account',
			serviceVersion: '1',
			serviceDescription: 'Account lookup service',
		})
		const lookupCommand = accountBuilder
			.getCommandBuilder('lookupAccount', 'Look up an account')
			.addPayloadSchema(z.object({ accountId: z.string() }))
			.addParameterSchema(z.object({ idempotencyKey: z.string() }))
			.addOutputSchema(z.object({ owner: z.string() }))
			.setCommandFunction(async function (context) {
				const parameter = context.message.payload.parameter as { idempotencyKey: string }
				commandCalls.push({
					tenantId: context.message.tenantId,
					principalId: context.message.principalId,
					idempotencyKey: parameter.idempotencyKey,
				})
				return { owner: 'Ada' }
			})
		accountBuilder.addCommandDefinition(lookupCommand.getDefinition())

		const knowledgeBuilder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted Harness test service',
		})
			.defineResource<'accountPolicy', { currency: string }>()
			.mountHarness(reviewHarness, {
				publish: { agents: ['review'] },
				hostTools: {
					lookup_account: commandAsHarnessTool<{ accountPolicy: { currency: string } }>(
						'Account',
						'1',
						'lookupAccount',
						{
							mapInput: (input, context) => {
								resourceCurrencies.push(context.host.resources.accountPolicy.currency)
								return {
									payload: input,
									parameter: { idempotencyKey: context.idempotencyKey },
								}
							},
						},
					),
				},
			})

		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const accountService = await accountBuilder.getInstance(eventBridge)
		const knowledgeService = await knowledgeBuilder.getInstance(eventBridge, {
			ai: { models: { primary: { provider, model: 'fake' } } },
			resources: { accountPolicy: { currency: 'EUR' } },
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
		expect(commandCalls).toEqual([
			{
				tenantId: 'tenant-a',
				principalId: 'principal-a',
				idempotencyKey: expect.stringMatching(/^tool_[a-f0-9]{64}$/),
			},
		])
		expect(resourceCurrencies).toEqual(['EUR'])

		await knowledgeService.destroy()
		await accountService.destroy()
	})

	it('runs function host tools with declared command, event, identity, and resource capabilities', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueue({
			object: {},
			toolCalls: [{ id: 'call-1', name: 'lookup_account', arguments: { accountId: 'account-1' } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		provider.enqueue({
			object: { decision: 'approved' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})

		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const commandCalls: unknown[] = []
		const emitted: unknown[] = []
		await eventBridge.registerSubscription(
			{
				sender: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'lookup_account' },
				eventName: 'account.lookedUp',
				subscriber: { serviceName: 'Audit', serviceVersion: '1', serviceTarget: 'recordLookup' },
				eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
			},
			async message => {
				emitted.push({
					payload: message.payload,
					tenantId: message.tenantId,
					principalId: message.principalId,
				})
				return undefined
			},
		)

		const accountBuilder = new ServiceBuilder({
			serviceName: 'Account',
			serviceVersion: '1',
			serviceDescription: 'Account lookup service',
		})
		const lookupCommand = accountBuilder
			.getCommandBuilder('lookupAccount', 'Look up an account')
			.addPayloadSchema(z.object({ accountId: z.string() }))
			.addParameterSchema(z.object({ idempotencyKey: z.string() }))
			.addOutputSchema(z.object({ owner: z.string() }))
			.setCommandFunction(async function (context, payload, parameter) {
				commandCalls.push({
					payload,
					parameter,
					tenantId: context.message.tenantId,
					principalId: context.message.principalId,
				})
				return { owner: 'Ada' }
			})
		accountBuilder.addCommandDefinition(lookupCommand.getDefinition())

		const knowledgeBase = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Function host-tool service',
		}).defineResource<'accountPolicy', { currency: string }>()
		const lookupTool = knowledgeBase
			.getHarnessHostToolBuilder(hostToolHarness.catalog.hostTools.lookup_account)
			.canInvoke(
				'Account',
				'1',
				'lookupAccount',
				z.object({ owner: z.string() }),
				z.object({ accountId: z.string() }),
				z.object({ idempotencyKey: z.string() }),
			)
			.canEmit('account.lookedUp', z.object({ accountId: z.string(), currency: z.string() }))
			.setHandler(async (context, input) => {
				const account = await context.service.Account['1'].lookupAccount(input, {
					idempotencyKey: context.idempotencyKey,
				})
				await context.emit('account.lookedUp', {
					accountId: input.accountId,
					currency: context.resources.accountPolicy.currency,
				})
				return account
			})
			.getDefinition()
		const knowledgeBuilder = knowledgeBase.mountHarness(hostToolHarness, {
			publish: { agents: ['review'] },
			hostTools: { lookup_account: lookupTool },
		})

		const accountService = await accountBuilder.getInstance(eventBridge)
		const knowledgeService = await knowledgeBuilder.getInstance(eventBridge, {
			ai: { models: { primary: { provider, model: 'fake' } } },
			resources: { accountPolicy: { currency: 'EUR' } },
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
		await new Promise(resolve => process.nextTick(resolve))
		expect(commandCalls).toEqual([
			{
				payload: { accountId: 'account-1' },
				parameter: { idempotencyKey: expect.stringMatching(/^tool_[a-f0-9]{64}$/) },
				tenantId: 'tenant-a',
				principalId: 'principal-a',
			},
		])
		expect(emitted).toEqual([
			{
				payload: { accountId: 'account-1', currency: 'EUR' },
				tenantId: 'tenant-a',
				principalId: 'principal-a',
			},
		])

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

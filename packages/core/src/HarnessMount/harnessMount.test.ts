import type { ModelProvider, RunOutcome, ToolApprovalInterrupt } from '@purista/harness'
import {
	createDecisionEvidence,
	DecisionBlockedError,
	defineHarness,
	InMemoryHarnessStorage,
	ModelAdmissionRejectedError,
} from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { z } from 'zod'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { DefaultQueueBridge } from '../DefaultQueueBridge/DefaultQueueBridge.impl.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { defineHarnessQueueBinding } from './queueBinding.js'
import { createHarnessSessionStorageId } from './runtime.js'
import { commandAsHarnessTool } from './types.js'

describe('createHarnessSessionStorageId', () => {
	it('is stable for one caller and isolates tenants, principals, and logical sessions', () => {
		const identity = { tenantId: 'tenant-a', principalId: 'principal-a' }
		const sessionId = createHarnessSessionStorageId(identity, 'support:case-1')

		expect(sessionId).toBe(createHarnessSessionStorageId(identity, 'support:case-1'))
		expect(sessionId).not.toBe(createHarnessSessionStorageId({ ...identity, tenantId: 'tenant-b' }, 'support:case-1'))
		expect(sessionId).not.toBe(
			createHarnessSessionStorageId({ ...identity, principalId: 'principal-b' }, 'support:case-1'),
		)
		expect(sessionId).not.toBe(createHarnessSessionStorageId(identity, 'support:case-2'))
		expect(sessionId).not.toContain('tenant-a')
		expect(sessionId).not.toContain('principal-a')
	})
})

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

const blockedHarness = defineHarness({ name: 'blocked' })
	.agent('blocked', {
		input: z.string(),
		output: z.string(),
		handler: async () => {
			throw new DecisionBlockedError(
				createDecisionEvidence({
					occurrence: {
						invocationId: 'invocation-1',
						runId: 'run-1',
						agentId: 'blocked',
						sessionId: 'session-1',
						step: 0,
					},
					source: { kind: 'interceptor', id: 'content-policy', version: '1' },
					phase: 'input',
					ordinal: 0,
					reasonCode: 'unsafe_input',
				}),
			)
		},
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

const artifactReferenceSchema = z.object({
	id: z.string(),
	url: z.string(),
	mediaType: z.string(),
})

const mediaHarness = defineHarness({ name: 'media' })
	.requireModel('image', { capabilities: ['image_generation'] })
	.agent('create_image', {
		input: z.object({ prompt: z.string() }),
		output: artifactReferenceSchema,
		handler: async ({ input, models, signal }) => {
			const response = await models.image.image({ prompt: input.prompt }, signal, {
				emitRunEvents: true,
				artifactIdempotencyKey: input.prompt,
			})
			const artifact = response.artifacts[0]
			if (!artifact) throw new Error('The image model returned no artifact.')
			return artifact
		},
	})
	.define()

const durableReviewHarness = defineHarness({ name: 'durable-review' })
	.workflow('review_action', {
		input: z.object({ waitId: z.string(), deadline: z.string() }),
		output: z.object({ status: z.enum(['approved', 'rejected', 'expired', 'cancelled']) }),
		handler: async context => ({
			status: (
				await context.externalWait.wait({
					waitId: context.input.waitId,
					kind: 'human_review',
					schemaVersion: 'review-v1',
					definitionVersion: 'review-v1',
					deadline: context.input.deadline,
				})
			).status,
		}),
	})
	.define()

describe('ServiceBuilder.mountHarness', () => {
	it('can preserve a durable run owner for an explicitly enabled cross-principal review resume', async () => {
		const storage = new InMemoryHarnessStorage()
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Review',
			serviceVersion: '1',
			serviceDescription: 'Durable review service',
		}).mountHarness(durableReviewHarness, {
			publish: { workflows: ['review_action'] },
			targets: { workflows: { review_action: { durableResume: { identity: 'run-owner' } } } },
		})
		const service = await builder.getInstance(eventBridge, { ai: { models: {}, storage } })
		await service.start()
		const input = { waitId: 'wait-1', deadline: '2099-01-01T00:00:00.000Z' }
		const receiver = { serviceName: 'Review', serviceVersion: '1', serviceTarget: 'review_action' }

		try {
			const first = (await eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-a',
					principalId: 'requester',
					receiver,
					payload: {
						payload: input,
						parameter: { sessionId: 'review-1', durable: { runId: 'review-run-1' } },
					},
				}),
			)) as RunOutcome<{ status: 'approved' | 'rejected' }>
			expect(first).toMatchObject({ status: 'interrupted', interrupt: { type: 'external-wait', id: 'wait-1' } })
			await storage.signalWait({ waitId: 'wait-1', eventId: 'decision-1', outcome: 'approved' })

			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-a',
						principalId: 'reviewer',
						receiver,
						payload: {
							payload: input,
							parameter: { sessionId: 'review-1', durable: { runId: 'review-run-1' } },
						},
					}),
				),
			).resolves.toMatchObject({ status: 'completed', output: { status: 'approved' } })

			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-b',
						principalId: 'reviewer',
						receiver,
						payload: {
							payload: input,
							parameter: { sessionId: 'review-1', durable: { runId: 'review-run-1' } },
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

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

	it('exposes an explicit Harness decision block as a handled 403 response', async () => {
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Policy',
			serviceVersion: '1',
			serviceDescription: 'Decision mapping test service',
		}).mountHarness(blockedHarness, { publish: { agents: ['blocked'] } })
		const service = await builder.getInstance(eventBridge, { ai: { models: {} } })
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						receiver: { serviceName: 'Policy', serviceVersion: '1', serviceTarget: 'blocked' },
						payload: { payload: 'unsafe', parameter: {} },
					}),
				),
			).rejects.toMatchObject({
				errorCode: 403,
				data: { code: 'DECISION_BLOCKED', retriable: false },
			})
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
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

	it('publishes generated media through the configured artifact store and streams a safe file reference', async () => {
		const provider: ModelProvider = {
			id: 'image-provider',
			genAiSystem: 'test',
			image: async () => ({
				artifacts: [{ body: new Uint8Array([1, 2, 3]), mediaType: 'image/png', filename: 'result.png' }],
			}),
		}
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Mounted media Harness test service',
		}).mountHarness(mediaHarness, { publish: { agents: ['create_image'] } })
		const service = await builder.getInstance(eventBridge, {
			ai: {
				models: { image: { provider, model: 'image-model' } },
				artifacts: {
					publish: async request => ({
						id: 'artifact-1',
						url: '/artifacts/artifact-1',
						mediaType: request.mediaType,
					}),
				},
			},
		})
		await service.start()

		const seed = getCommandMessageMock()
		const stream = await eventBridge.openStream({
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: seed.traceId,
			principalId: 'principal-a',
			tenantId: 'tenant-a',
			sender: seed.sender,
			receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'create_image' },
			payload: {
				frameType: 'open',
				payload: { prompt: 'A red square' },
				parameter: { sessionId: 'media-session' },
			},
		})
		const events = []
		for await (const event of stream) events.push(event)

		expect(events).toContainEqual(
			expect.objectContaining({
				payload: expect.objectContaining({
					frameType: 'chunk',
					chunk: expect.objectContaining({
						type: 'output.file',
						artifact: { id: 'artifact-1', url: '/artifacts/artifact-1', mediaType: 'image/png' },
					}),
				}),
			}),
		)
		expect(events.at(-1)).toMatchObject({
			payload: {
				frameType: 'complete',
				final: {
					status: 'completed',
					output: { id: 'artifact-1', url: '/artifacts/artifact-1', mediaType: 'image/png' },
				},
			},
		})
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

		const resume = {
			type: 'tool-approval' as const,
			runId: first.runId,
			interruptId: first.interrupt.id,
			revision: first.interrupt.revision,
			eventId: 'approval-decision-1',
			decisions: [{ approvalId: approval.approvalId, approved: true }],
		}
		await expect(
			eventBridge.invoke({
				...request,
				principalId: 'principal-b',
				payload: { payload: 'transfer', parameter: { sessionId: 'approval-session', resume } },
			}),
		).rejects.toBeInstanceOf(HandledError)
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
					resume,
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
		await expect(
			eventBridge.invoke({
				...request,
				payload: { payload: 'transfer', parameter: { sessionId: 'approval-session', resume } },
			}),
		).resolves.toMatchObject({ status: 'completed', output: 'done' })
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

	it('adds enqueue only for an explicit native queue binding and executes through EventBridge', async () => {
		const eventBridge = new DefaultEventBridge()
		const queueBridge = new DefaultQueueBridge()
		await eventBridge.start()
		const received: Array<{ value: string; tenantId?: string; principalId?: string }> = []
		const knowledgeBase = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Queued Harness target',
		})
		const queuedEcho = defineHarnessQueueBinding(
			echoHarness.contracts.agents.echo,
			knowledgeBase.getQueueBuilder('knowledge.echo', 'Queue echo runs'),
			knowledgeBase.getQueueWorkerBuilder('knowledge.echo', 'echo-worker').setMaxParallelHandlers(2),
		)
		const knowledgeBuilder = knowledgeBase.mountHarness(echoHarness, {
			publish: { agents: ['echo'] },
			targets: {
				agents: {
					echo: {
						queue: queuedEcho,
						beforeGuards: {
							record: context => {
								received.push({
									value: 'queued',
									tenantId: context.identity.tenantId,
									principalId: context.identity.principalId,
								})
							},
						},
					},
				},
			},
		})

		const apiBuilder = new ServiceBuilder({
			serviceName: 'Api',
			serviceVersion: '1',
			serviceDescription: 'Queued Harness caller',
		})
		const enqueueEcho = apiBuilder
			.getCommandBuilder('enqueueEcho', 'Enqueue an echo run')
			.addPayloadSchema(z.object({ value: z.string() }))
			.canInvokeAgent('Knowledge', '1', 'echo', queuedEcho.contract)
			.setCommandFunction(async function ({ agent }, payload) {
				return agent.Knowledge['1'].echo.enqueue(
					payload,
					{ sessionId: 'queued-session' },
					{
						idempotencyKey: 'job-1',
						headers: {
							'purista.principalId': 'spoofed-principal',
							'purista.tenantId': 'spoofed-tenant',
						},
					},
				)
			})
		apiBuilder.addCommandDefinition(enqueueEcho.getDefinition())

		const directOnly = apiBuilder
			.getCommandBuilder('directOnly', 'Compile-time direct-only target')
			.canInvokeAgent('Knowledge', '1', 'echo', echoHarness.contracts.agents.echo)
			.setCommandFunction(async function ({ agent }) {
				// @ts-expect-error enqueue is absent unless the declared contract carries a queue binding
				void agent.Knowledge['1'].echo.enqueue
				return undefined
			})
		void directOnly

		const knowledge = await knowledgeBuilder.getInstance(eventBridge, { ai: { models: {} }, queueBridge })
		const api = await apiBuilder.getInstance(eventBridge, { queueBridge })
		await knowledge.start()
		await api.start()

		expect(knowledgeBuilder.getQueueDefinitions()).toHaveLength(1)
		expect(knowledgeBuilder.getQueueWorkerDefinitions()).toHaveLength(1)
		const command = getCommandMessageMock({
			tenantId: 'tenant-a',
			principalId: 'principal-a',
			receiver: { serviceName: 'Api', serviceVersion: '1', serviceTarget: 'enqueueEcho' },
			payload: { payload: { value: 'queued' }, parameter: {} },
		})
		const { id: _id, messageType: _type, timestamp: _timestamp, correlationId: _correlation, ...request } = command
		await expect(eventBridge.invoke(request)).resolves.toMatchObject({ queueName: 'knowledge.echo' })

		for (let attempt = 0; attempt < 50 && received.length === 0; attempt += 1) {
			await new Promise(resolve => setTimeout(resolve, 10))
		}
		expect(received).toEqual([{ value: 'queued', tenantId: 'tenant-a', principalId: 'principal-a' }])

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

	it('allows exactly one composed Harness definition per service', () => {
		const builder = new ServiceBuilder({
			serviceName: 'Knowledge',
			serviceVersion: '1',
			serviceDescription: 'Single mounted Harness service',
		})
		const mounted = builder.mountHarness(echoHarness, { publish: { agents: ['echo'] } })

		expect(() => builder.mountHarness(embeddingHarness, { publish: {} })).toThrow(
			'Only one Harness definition can be mounted on a service',
		)
		const assertSecondMountIsRejectedByTypeSystem = () => {
			// @ts-expect-error compose additional agents and workflows with native Harness modules
			mounted.mountHarness(embeddingHarness, { publish: {} })
		}
		expect(assertSecondMountIsRejectedByTypeSystem).toBeTypeOf('function')
	})
})

import { defineHarness } from '@purista/harness'
import { createSandbox } from 'sinon'
import { z } from 'zod'
import { safeBind } from '../helper/safeBind.impl.js'
import { getEventBridgeMock } from '../mocks/getEventBridge.mock.js'
import { getLoggerMock } from '../mocks/getLogger.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createCommandContextMock } from './createCommandContextMock.js'
import { createCommandTestHarness } from './createCommandTestHarness.js'

describe('command testing helpers', () => {
	it('stubs a declared deterministic Harness model without starting a runtime', async () => {
		const sandbox = createSandbox()
		try {
			const definition = defineHarness({ name: 'embedding-test' })
				.requireModel('embedding', { capabilities: ['embeddings'] })
				.define()
			const serviceBuilder = new ServiceBuilder({
				serviceName: 'Knowledge',
				serviceVersion: '1',
				serviceDescription: 'model caller test',
			})
			const commandBuilder = serviceBuilder
				.getCommandBuilder('embed', 'embed text')
				.addPayloadSchema(z.object({ text: z.string() }))
				.canUseHarnessModel(definition, 'embedding')
				.setCommandFunction(async function ({ model }, payload) {
					return model.embedding.embed({ input: payload.text }, new AbortController().signal)
				})
			const { context, stubs } = createCommandContextMock(commandBuilder, {
				payload: { text: 'PURISTA' },
				parameter: {},
				sandbox,
			})
			const expected = {
				embeddings: [{ index: 0, vector: [0.1, 0.2] }],
				usage: { inputTokens: 1, outputTokens: 0, totalTokens: 1 },
			}
			const embed = stubs.model.embedding?.embed
			if (!embed) throw new Error('The embedding model stub was not created.')
			embed.resolves(expected)

			await expect(
				commandBuilder.getCommandFunction().call({} as never, context, { text: 'PURISTA' }, {}),
			).resolves.toEqual(expected)
			expect(embed.calledOnce).toBe(true)
		} finally {
			sandbox.restore()
		}
	})

	it('stubs a declared address-first Harness agent without starting a runtime', async () => {
		const sandbox = createSandbox()
		try {
			const definition = defineHarness({ name: 'test-agent' })
				.agent('answer', {
					input: z.object({ question: z.string() }),
					output: z.object({ answer: z.string() }),
					handler: async ({ input }) => ({ answer: input.question }),
				})
				.define()
			const serviceBuilder = new ServiceBuilder({
				serviceName: 'Api',
				serviceVersion: '1',
				serviceDescription: 'agent caller test',
			})
			const commandBuilder = serviceBuilder
				.getCommandBuilder('ask', 'ask an agent')
				.addPayloadSchema(z.object({ question: z.string() }))
				.canInvokeAgent('Knowledge', '1', 'answer', definition.contracts.agents.answer)
				.setCommandFunction(async function ({ agent }, payload) {
					return agent.Knowledge['1'].answer.run(payload)
				})
			const { context, stubs } = createCommandContextMock(commandBuilder, {
				payload: { question: 'What is PURISTA?' },
				parameter: {},
				sandbox,
			})
			const expected = { status: 'completed' as const, runId: 'run-1', output: { answer: 'A framework' } }
			;(stubs.agent as any).Knowledge['1'].answer.run.resolves(expected)

			await expect(
				commandBuilder.getCommandFunction().call({} as never, context, { question: 'What is PURISTA?' }, {}),
			).resolves.toEqual(expected)
			expect((stubs.agent as any).Knowledge['1'].answer.run.calledOnce).toBe(true)
		} finally {
			sandbox.restore()
		}
	})

	it('creates a typed command context mock for handler-level tests', async () => {
		const sandbox = createSandbox()

		try {
			const serviceBuilder = new ServiceBuilder({
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'test service',
			}).defineResource<'repo', { name: string }>()

			const commandBuilder = serviceBuilder
				.getCommandBuilder('echo', 'echo input')
				.addPayloadSchema(z.object({ value: z.string() }))
				.addParameterSchema(z.object({}))
				.addOutputSchema(z.object({ echoed: z.string() }))
				.canEmit('echoed', z.object({ value: z.string() }))
				.setCommandFunction(async function (context, payload) {
					await context.emit('echoed', { value: payload.value })

					return {
						echoed: `${context.resources.repo.name}:${payload.value}`,
					}
				})

			const service = await serviceBuilder
				.addCommandDefinition(commandBuilder.getDefinition())
				.getInstance(getEventBridgeMock(sandbox).mock, {
					logger: getLoggerMock(sandbox).mock,
					resources: {
						repo: { name: 'workspace' },
					},
				})

			const handler = safeBind(commandBuilder.getCommandFunction(), service)
			const { context, stubs } = createCommandContextMock(commandBuilder, {
				payload: { value: 'hello' },
				parameter: {},
				sandbox,
				resources: {
					repo: { name: 'workspace' },
				},
			})

			const result = await handler(context, { value: 'hello' }, {})

			expect(result).toStrictEqual({ echoed: 'workspace:hello' })
			expect(stubs.emit.echoed.calledOnce).toBe(true)
		} finally {
			sandbox.restore()
		}
	})

	it('executes one command through the runtime harness', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'HarnessService',
			serviceVersion: '1',
			serviceDescription: 'runtime command harness',
		})

		const commandBuilder = serviceBuilder
			.getCommandBuilder('greet', 'greet a user')
			.addPayloadSchema(z.object({ name: z.string() }))
			.addParameterSchema(z.object({}))
			.addOutputSchema(z.object({ greeting: z.string() }))
			.setCommandFunction(async function (_context, payload) {
				return { greeting: `Hello ${payload.name}` }
			})

		serviceBuilder.addCommandDefinition(commandBuilder.getDefinition())

		const harness = await createCommandTestHarness(serviceBuilder, commandBuilder)

		try {
			const result = await harness.run({
				payload: { name: 'Ada' },
				parameter: {},
			})

			expect(result.result).toStrictEqual({ greeting: 'Hello Ada' })
		} finally {
			await harness.destroy()
		}
	})

	it('types and executes the received and returned transform representations', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'TransformHarnessService',
			serviceVersion: '1',
			serviceDescription: 'runtime transform harness',
		})

		const commandBuilder = serviceBuilder
			.getCommandBuilder('greetLegacy', 'greet a user from a legacy request')
			.addPayloadSchema(z.object({ name: z.string() }))
			.addParameterSchema(z.object({ enthusiastic: z.boolean() }))
			.addOutputSchema(z.object({ greeting: z.string() }))
			.setTransformInput(
				z.string(),
				z.object({ enthusiastic: z.stringbool() }),
				async function (_context, name, parameter) {
					return {
						payload: { name },
						parameter,
					}
				},
			)
			.setTransformOutput(z.string(), async function (_context, result) {
				return result.greeting
			})
			.setCommandFunction(async function (_context, payload, parameter) {
				return { greeting: `${parameter.enthusiastic ? 'Hello' : 'Hi'} ${payload.name}` }
			})

		serviceBuilder.addCommandDefinition(commandBuilder.getDefinition())

		const harness = await createCommandTestHarness(serviceBuilder, commandBuilder)

		try {
			const received = {
				payload: 'Ada',
				parameter: { enthusiastic: 'true' },
			}
			const response = await harness.run(received)

			expectTypeOf(received).toMatchTypeOf<Parameters<typeof harness.run>[0]>()
			expectTypeOf(response.result).toEqualTypeOf<string | undefined>()
			expect(response.result).toBe('Hello Ada')
		} finally {
			await harness.destroy()
		}
	})
})

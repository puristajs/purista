import { defineAgent, defineWorkflow, harnessExecutionEventTypesV1 } from '@purista/harness'
import { createSandbox } from 'sinon'
import { z } from 'zod'

import { Service } from '../core/index.js'
import { createHarnessInvocationProxy } from '../HarnessMount/invocation.js'
import { defineHarnessQueueBinding } from '../HarnessMount/queueBinding.js'
import {
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from '../HarnessMount/remoteTargetContract.js'
import { safeBind } from '../helper/index.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { createCommandContextMock } from '../testing/createCommandContextMock.js'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl.js'

function createRemoteTarget<const Kind extends 'agent' | 'workflow', const Id extends string>(kind: Kind, id: Id) {
	const schema = { type: 'string' } as const
	const address = { serviceName: 'RemoteAi', serviceVersion: '2', serviceTarget: id } as const
	const target = {
		targetName: id,
		kind,
		inputSchema: schema,
		validatedInputSchema: schema,
		outputSchema: schema,
		updateSchema: false as const,
		interruptSchema: false as const,
		invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
		stream: {
			protocol: 'harness-execution-events-v1' as const,
			eventTypes: harnessExecutionEventTypesV1,
			outputUpdates: [] as const,
		},
	}
	return createRemoteHarnessTargetContract({
		schemaVersion: 1,
		address,
		target: { ...target, exportDigest: computeHarnessTargetExportDigest({ address, target }) },
		schemas: {
			input: createGeneratedHarnessSchema<string>(schema),
			validatedInput: createGeneratedHarnessSchema<string>(schema),
			output: createGeneratedHarnessSchema<string>(schema),
		},
	})
}

describe('CommandDefinitionBuilder', () => {
	const sandbox = createSandbox()
	const service = new Service({
		info: {
			serviceName: 'TestService',
			serviceVersion: '1',
			serviceDescription: 'A service',
		},
		commandDefinitionList: [],
		subscriptionDefinitionList: [],
		logger: getLoggerMock(sandbox).mock,
		eventBridge: getEventBridgeMock(sandbox).mock,
		config: {},
	})

	const functionPayloadSchema = z.object({
		foo: z.string(),
		bar: z.number(),
		def: z.string().default('default_value'),
	})
	const functionParameterSchema = z.object({
		paramOne: z.string(),
		paramTwo: z.number(),
		def: z.string().default('default_param'),
	})
	const functionOutputSchema = z.object({
		result: z.object({
			payload: z.object({
				foo: z.string(),
				bar: z.number(),
				other: z.string(),
				def: z.string(),
			}),
			parameter: z.object({
				paramOne: z.string(),
				paramTwo: z.number(),
				def: z.string(),
			}),
		}),
	})
	const transformPayloudSchema = z.string()
	const transformParameterSchema = z.string()
	const transformOutputSchema = z.string()

	const beforeOneStub = sandbox.stub()
	const afterOneStub = sandbox.stub()

	const builder = new CommandDefinitionBuilder('testCommand', 'a unit test command')
		.addPayloadSchema(functionPayloadSchema)
		.addParameterSchema(functionParameterSchema)
		.addOutputSchema(functionOutputSchema)
		.setTransformInput(transformPayloudSchema, transformParameterSchema, async function (context, payload, parameter) {
			void context
			expect(typeof payload).toBe('string')
			expect(typeof parameter).toBe('string')

			const pay: {
				foo: string
				bar: number
			} = JSON.parse(payload)
			const param: {
				paramOne: string
				paramTwo: number
			} = JSON.parse(parameter)

			return {
				payload: pay,
				parameter: param,
			}
		})
		.setTransformOutput(transformOutputSchema, async function (context, payload, parameter) {
			void context
			void parameter
			const p: Readonly<{
				result: {
					payload: {
						foo: string
						bar: number
						def: string
						other: string
					}
					parameter: {
						paramOne: string
						paramTwo: number
					}
				}
			}> = payload
			return JSON.stringify(p)
		})
		.setBeforeGuardHooks({
			beforeOne: async function (context, payload, parameter) {
				void context
				const pay: {
					foo: string
					bar: number
					def: string
				} = payload

				const param: {
					def: string
					paramOne: string
					paramTwo: number
				} = parameter
				beforeOneStub(pay, param)
			},
		})
		.setAfterGuardHooks({
			afterOne: async function (context, fnOutputPayload, input, parameter) {
				void context
				const pay: {
					foo: string
					bar: number
					def: string
				} = input

				const param: {
					def: string
					paramOne: string
					paramTwo: number
				} = parameter

				const fnRes: {
					result: {
						payload: {
							foo: string
							bar: number
							def: string
							other: string
						}
						parameter: {
							def: string
							paramOne: string
							paramTwo: number
						}
					}
				} = fnOutputPayload

				afterOneStub(fnRes, pay, param)
			},
		})
		.canInvoke(
			'OtherService',
			'2',
			'testCommand',
			functionOutputSchema.merge(z.object({ toBeRemovedInResponse: z.string() })),
			functionPayloadSchema,
			functionParameterSchema,
		)
		.canEmit('some', z.object({ example: z.string() }))
		.setCommandFunction(async function (context, payload, parameter) {
			const result = await context.service.OtherService['2'].testCommand(payload, parameter)

			const response: {
				result: {
					payload: {
						foo: string
						bar: number
						def: string
						other: string
					}
					parameter: {
						def: string
						paramOne: string
						paramTwo: number
					}
				}
				toBeRemovedInResponse: string
			} = result

			context.emit('some', { example: 'test' })

			return response
		})

	const payload = {
		foo: 'foo',
		bar: 1,
	}
	const parameter = {
		paramOne: 'Parameter 1',
		paramTwo: 2,
	}

	beforeEach(() => {
		sandbox.reset()
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('can build a command with schemas', async () => {
		const commandFunction = safeBind(builder.getCommandFunction(), service)
		const { context, stubs } = createCommandContextMock(builder, {
			payload: JSON.stringify(payload),
			parameter: JSON.stringify(parameter),
		})
		stubs.service.OtherService[2].testCommand.callsFake(async (payload: any, parameter: any) => {
			return {
				result: {
					payload: { ...payload, other: 'added by invoke' },
					parameter,
				},
			}
		})

		const result = await commandFunction(context, payload, parameter)

		expect(result).toStrictEqual({
			result: {
				payload: { ...payload, other: 'added by invoke', def: 'default_value' },
				parameter: { ...parameter, def: 'default_param' },
			},
		})

		expect(stubs.emit.some.called).toBeTruthy()
		expect(beforeOneStub.callCount).toBe(1)
	})

	it('executes the plain function without hooks and schema validation', async () => {
		const commandFunction = safeBind(builder.getCommandFunctionPlain(), service)
		const { context, stubs } = createCommandContextMock(builder, {
			payload: JSON.stringify(payload),
			parameter: JSON.stringify(parameter),
		})
		stubs.service.OtherService[2].testCommand.callsFake(async (payload: any, parameter: any) => {
			return {
				result: {
					payload: { ...payload, other: 'added by invoke' },
					parameter,
					toBeRemovedInResponse: 'removed by output schema',
				},
			}
		})

		const result = await commandFunction(
			context,
			{ ...payload, def: 'default_value' },
			{ ...parameter, def: 'default_param' },
		)

		expect(result).toStrictEqual({
			result: {
				payload: { ...payload, other: 'added by invoke', def: 'default_value' },
				parameter: { ...parameter, def: 'default_param' },
				toBeRemovedInResponse: 'removed by output schema',
			},
		})

		expect(stubs.emit.some.called).toBeTruthy()
		expect(beforeOneStub.callCount).toBe(0)
	})

	it('returns configured before/after guard hooks by name', () => {
		const beforeHook = builder.getBeforeGuardHook('beforeOne')
		const afterHook = builder.getAfterGuardHook('afterOne')

		expect(typeof beforeHook).toBe('function')
		expect(typeof afterHook).toBe('function')
	})

	it('does not throw on transform input', async () => {
		const fn = builder.getTransformInputFunction()

		if (!fn) {
			expect(fn).toBeDefined()
			return
		}

		const transformFunction = safeBind(fn, service)

		const context = builder.getCommandTransformContextMock({
			payload: JSON.stringify(payload),
			parameter: JSON.stringify(parameter),
			sandbox,
		})

		const result = await transformFunction(context.mock, JSON.stringify(payload), JSON.stringify(parameter))

		expect(result).toStrictEqual({ payload, parameter })
	})

	it('does not throw on transform output', async () => {
		const fn = builder.getTransformOutputFunction()

		if (!fn) {
			expect(fn).toBeDefined()
			return
		}

		const transformFunction = safeBind(fn, service)

		const context = builder.getCommandTransformContextMock({
			payload: JSON.stringify(payload),
			parameter: JSON.stringify(parameter),
			sandbox,
		})

		const result = await transformFunction(
			context.mock,
			{
				result: {
					payload: {
						...payload,
						other: 'added by invoke',
						def: 'default_value',
					},
					parameter: { ...parameter, def: 'default_param' },
				},
			},
			{ ...parameter, def: 'default_param' },
		)

		expect(result).toStrictEqual(
			JSON.stringify({
				result: {
					payload: {
						...payload,
						other: 'added by invoke',
						def: 'default_value',
					},
					parameter: { ...parameter, def: 'default_param' },
				},
			}),
		)
	})

	it('works with without schema', async () => {
		const b = new CommandDefinitionBuilder('testCommand', 'a unit test command').setCommandFunction(
			async function (context, payload, parameter) {
				void context
				return { payload, parameter }
			},
		)

		const fn = b.getCommandFunction()

		const theFunction = safeBind(fn, service)

		const { context } = createCommandContextMock(b, {
			payload: '',
			parameter: {},
			sandbox,
		})

		const result = await theFunction(context, 'y', 'x')

		expect(result).toStrictEqual({
			payload: 'y',
			parameter: 'x',
		})
	})

	it('merges repeated canInvoke calls for the same service and version', async () => {
		const b = new CommandDefinitionBuilder('mergeInvokes', 'merge invokes')
			.addOutputSchema(z.object({ ok: z.boolean() }))
			.canInvoke('OtherService', '1', 'first', z.object({ first: z.string() }))
			.canInvoke('OtherService', '1', 'second', z.object({ second: z.string() }))
			.setCommandFunction(async function (context) {
				void context
				return { ok: true }
			})

		const definition = await b.getDefinition()

		expect(Object.keys(definition.invokes.OtherService[1]).sort()).toStrictEqual(['first', 'second'])
	})

	it('derives local Harness addresses from authentic targets and keeps them fail-closed until resolution', async () => {
		const cleanBuilder = new CommandDefinitionBuilder('cleanSurface', 'No direct model capability')
		// @ts-expect-error Model providers belong to mounted Harness runtime configuration.
		void cleanBuilder.canUseHarnessModel
		expect((cleanBuilder as any).canUseHarnessModel).toBeUndefined()
		const localAgent = defineAgent('localAgent', { instructions: 'Answer.' })
		const localWorkflow = defineWorkflow('localWorkflow', {
			async handler({ input }) {
				return input
			},
		})
		const queueBinding = defineHarnessQueueBinding(
			localAgent.contract,
			new QueueDefinitionBuilder('local-agent-jobs', 'Local agent jobs'),
			new QueueWorkerBuilder('local-agent-jobs', 'local-agent-worker'),
		)
		const localBuilder = new CommandDefinitionBuilder('localCaller', 'Call local Harness targets')
			.canInvokeAgent('LocalAi', '1', queueBinding.reference)
			.canInvokeWorkflow('LocalAi', '1', localWorkflow.contract)
			.setCommandFunction(async function (context) {
				// @ts-expect-error Providers are configured on the mounted Harness, not exposed to handlers.
				void context.model
				expectTypeOf(context.agent.LocalAi['1'].localAgent.run).toBeFunction()
				expectTypeOf(context.agent.LocalAi['1'].localAgent.stream).toBeFunction()
				expectTypeOf(context.agent.LocalAi['1'].localAgent.enqueue).toBeFunction()
				expectTypeOf(context.workflow.LocalAi['1'].localWorkflow.run).toBeFunction()
				expectTypeOf(context.workflow.LocalAi['1'].localWorkflow.stream).toBeFunction()
				return undefined
			})

		const definition = await localBuilder.getDefinition()
		new CommandDefinitionBuilder('wrongKind', 'Reject wrong kind').canInvokeAgent(
			'LocalAi',
			'1',
			// @ts-expect-error An agent declaration rejects workflow contracts.
			localWorkflow.contract,
		)
		expect(Object.keys(definition.invokes.LocalAi['1']).sort()).toEqual(['localAgent', 'localWorkflow'])
		expect(Object.keys(definition.streamInvokes.LocalAi['1']).sort()).toEqual(['localAgent', 'localWorkflow'])

		const invoke = vi.fn()
		const client = createHarnessInvocationProxy<any>('agent', invoke, vi.fn(), vi.fn(), definition.invokes)
		await expect(client.LocalAi['1'].localAgent.run('question')).rejects.toThrow('incomplete')
		expect(invoke).not.toHaveBeenCalled()

		expect(() =>
			new CommandDefinitionBuilder('copied', 'Reject copied target').canInvokeAgent('LocalAi', '1', {
				...localAgent.contract,
			} as never),
		).toThrow('authentic')
	})

	it('runs and streams generated remote agents and workflows through a real command context', async () => {
		const remoteAgent = createRemoteTarget('agent', 'remoteAgent')
		const remoteWorkflow = createRemoteTarget('workflow', 'remoteWorkflow')
		// @ts-expect-error A workflow declaration rejects generated agent contracts.
		new CommandDefinitionBuilder('wrongRemoteKind', 'Reject wrong remote kind').canInvokeWorkflow(remoteAgent)
		expect(() =>
			new CommandDefinitionBuilder('copiedRemote', 'Reject copied remote target').canInvokeAgent({
				...remoteAgent,
			} as never),
		).toThrow('authentic')
		const remoteBuilder = new CommandDefinitionBuilder('remoteCaller', 'Call generated remote Harness targets')
			.canInvokeAgent(remoteAgent)
			.canInvokeWorkflow(remoteWorkflow)
			.setCommandFunction(async function (context) {
				const agentRun = await context.agent.RemoteAi['2'].remoteAgent.run('agent-run', {
					sessionId: 'agent-run-session',
				})
				const agentStream = await context.agent.RemoteAi['2'].remoteAgent.stream('agent-stream', {
					sessionId: 'agent-stream-session',
				})
				const workflowRun = await context.workflow.RemoteAi['2'].remoteWorkflow.run('workflow-run', {
					sessionId: 'workflow-run-session',
				})
				const workflowStream = await context.workflow.RemoteAi['2'].remoteWorkflow.stream('workflow-stream', {
					sessionId: 'workflow-stream-session',
				})
				expectTypeOf(agentRun.outcome).not.toBeAny()
				expectTypeOf(workflowRun.outcome).not.toBeAny()
				return {
					runSessions: [agentRun.sessionId, workflowRun.sessionId],
					streamSessions: [agentStream.sessionId, workflowStream.sessionId],
				}
			})
		const definition = await remoteBuilder.getDefinition()
		const eventBridge = getEventBridgeMock(sandbox)
		eventBridge.stubs.invoke.callsFake(async message => ({
			sessionId: message.harness.root.sessionId,
			outcome: { status: 'completed', runId: `${message.receiver.serviceTarget}-run`, output: 'done' },
		}))
		eventBridge.stubs.openStream.callsFake(async () => ({
			sessionId: 'transport-session',
			cancel: vi.fn(),
			async *[Symbol.asyncIterator]() {},
		}))
		const runtime = new Service({
			info: {
				serviceName: 'Caller',
				serviceVersion: '1',
				serviceDescription: 'Command builder Harness test',
			},
			commandDefinitionList: [definition],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			logger: getLoggerMock(sandbox).mock,
			eventBridge: eventBridge.mock,
			config: {},
		})
		await runtime.registerCommand(definition)

		const response = await runtime.executeCommand(
			getCommandMessageMock({
				receiver: { serviceName: 'Caller', serviceVersion: '1', serviceTarget: 'remoteCaller' },
				payload: { payload: {}, parameter: {} },
			}),
		)

		expect(response.payload).toEqual({
			runSessions: ['agent-run-session', 'workflow-run-session'],
			streamSessions: ['agent-stream-session', 'workflow-stream-session'],
		})
		expect(eventBridge.stubs.invoke.callCount).toBe(2)
		expect(eventBridge.stubs.openStream.callCount).toBe(2)
	})
})

import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { createHostOwnerToken, defineHostTool } from '@purista/harness/integrator'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSandbox } from 'sinon'
import { z } from 'zod'

import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import type { QueueJobContext, ServiceInfoType } from '../core/index.js'
import { Service } from '../core/index.js'
import type { PuristaMetricContext } from '../core/types/PuristaMetrics.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { ScheduleDefinitionBuilder } from '../ScheduleDefinitionBuilder/index.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/index.js'
import { ServiceBuilder } from './ServiceBuilder.impl.js'

describe('ServiceBuilder', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'test-service',
		serviceVersion: '1',
		serviceDescription: 'the description of the service',
	}

	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.reset()
	})

	it('returns a CommandBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getCommandBuilder('command-name', 'command description')).toBeInstanceOf(CommandDefinitionBuilder)
	})

	it('returns a SubscriptionBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getSubscriptionBuilder('command-name', 'command description')).toBeInstanceOf(
			SubscriptionDefinitionBuilder,
		)
	})

	it('returns a ScheduleBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getScheduleBuilder('schedule-name', 'schedule description')).toBeInstanceOf(
			ScheduleDefinitionBuilder,
		)
	})

	it('can use a custom service class', async () => {
		class CustomClass extends Service {
			customFunction() {
				return 'custom'
			}
		}

		const service = new ServiceBuilder(serviceInfo).setCustomClass(CustomClass)

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)

		const serviceInstance = await service.getInstance(eventBridge.mock, { logger: logger.mock })

		expect(serviceInstance.customFunction()).toBe('custom')
		expect(serviceInstance).toBeInstanceOf(CustomClass)
	})

	it('can add resources', async () => {
		class ExampleClass {
			method() {
				return 'hello'
			}
		}

		const service = new ServiceBuilder(serviceInfo).defineResource<'x', ExampleClass>()

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)
		const _serviceInstance = await service.getInstance(eventBridge.mock, {
			logger: logger.mock,
			resources: { x: new ExampleClass() },
		})
	})

	it('creates an exact trusted context with declared helpers and injected nested targets', async () => {
		const childAgent = defineAgent('contextChildAgent', { instructions: 'Answer.' })
		const childWorkflow = defineWorkflow('contextChildWorkflow', {
			input: z.string(),
			output: z.string(),
			handler: async ({ input }) => input,
		})
		const interruption = new Error('child interrupted')
		const nestedRun = sandbox.stub()
		const checkpointStep = sandbox.stub().callsFake(async (_stepId, handler: () => Promise<unknown>) => handler())
		const controller = new AbortController()
		const identity = Object.freeze({ tenantId: 'tenant-1', principalId: 'principal-1' })
		const trace = Object.freeze({ traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' })
		let observedContext: Record<string, unknown> | undefined

		const builder = new ServiceBuilder(serviceInfo).defineResource<'records', { prefix: string }>()
		const tool = builder
			.defineTool('scopedLookup', {
				description: 'Look up within the trusted scope.',
				input: z.string(),
				output: z.string(),
			})
			.canInvoke('Records', '1', 'load', z.string(), z.string(), z.object({}))
			.canConsumeStream('Records', '1', 'watch', z.string(), z.string(), z.object({}), z.string())
			.canEnqueue('records.audit', z.string(), z.object({}))
			.canEmit('record.loaded', z.string())
			.canInvokeAgent('test-service', '1', childAgent.contract)
			.canInvokeWorkflow('test-service', '1', childWorkflow.contract)
			.setHandler(async (context, input) => {
				observedContext = context
				await context.step('before-child', async () => 'saved')
				const agentOutput = await context.agent['test-service']['1'].contextChildAgent.run(input, {
					callId: 'stable-agent-call',
				})
				return context.workflow['test-service']['1'].contextChildWorkflow.run(agentOutput, {
					callId: 'stable-workflow-call',
				})
			})

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)
		const mountedBuilder = builder.mountHarness(
			defineHarness({ name: 'hostToolNestedTargets', revision: '1' }).addAgent(childAgent).addWorkflow(childWorkflow),
		)
		const service = await mountedBuilder.getInstance(eventBridge.mock, {
			logger: logger.mock,
			resources: { records: { prefix: 'record:' } },
			ai: { model: { provider: new FakeModelProvider(), model: 'fake' } },
		})
		const message = getCommandMessageMock()
		const request = {
			hostInvocation: { message, identity, trace, idempotencyKey: 'tool-effect-1' },
			target: { kind: 'agent' as const, id: 'rootAgent' },
			tool: { id: 'scopedLookup', callId: 'tool-call-1' },
			caller: { kind: 'agent' as const, agentId: 'rootAgent' },
			sessionId: 'session-1',
			runId: 'run-1',
			rootRunId: 'run-1',
			invocationId: 'invocation-1',
			hostToolInvocationId: 'host-tool-invocation-1',
			depth: 0,
			remainingDepth: 4,
			signal: controller.signal,
			nestedTargets: {
				run: nestedRun.callsFake(async contract => {
					if (contract === childAgent.contract) return 'agent output'
					if (contract === childWorkflow.contract) throw interruption
					return 'unexpected target'
				}),
			},
			checkpointStep,
		}

		const context = service.createHarnessHostToolContext(request)
		await expect(tool.handler(context as never, 'question')).rejects.toBe(interruption)
		expect(checkpointStep.calledOnce).toBe(true)
		expect(nestedRun.calledWith(childAgent.contract, 'question', { callId: 'stable-agent-call' })).toBe(true)
		expect(nestedRun.calledWith(childWorkflow.contract, 'agent output', { callId: 'stable-workflow-call' })).toBe(true)
		expect(context.step).toBe(checkpointStep)
		expect(context.signal).toBe(controller.signal)
		expect(context.identity).toBe(identity)
		expect(context.trace).toBe(trace)
		expect(context.resources).toEqual({ records: { prefix: 'record:' } })
		expect(Object.keys(context).sort()).toEqual([
			'agent',
			'emit',
			'identity',
			'logger',
			'message',
			'metrics',
			'queue',
			'resources',
			'service',
			'signal',
			'step',
			'stream',
			'tool',
			'trace',
			'workflow',
		])
		expect(context.tool).toEqual({
			sessionId: 'session-1',
			runId: 'run-1',
			toolId: 'scopedLookup',
			callId: 'tool-call-1',
			idempotencyKey: 'tool-effect-1',
			caller: { kind: 'agent', agentId: 'rootAgent' },
		})
		expect(Object.keys(context.agent)).toEqual(['test-service'])
		expect(Object.keys(context.workflow)).toEqual(['test-service'])
		expect((context.service as Record<string, unknown>).Undeclared).toBeUndefined()
		expect((context.stream as Record<string, unknown>).Undeclared).toBeUndefined()
		expect('records.audit' in context.queue.enqueue).toBe(true)
		expect(observedContext).toBe(context)
		const runtimeAgent = context.agent as unknown as {
			'test-service': {
				'1': { contextChildAgent: { run(input: string, options: { callId: string }): Promise<string> } }
			}
		}
		expect(() => runtimeAgent['test-service']['1'].contextChildAgent.run('invalid call', { callId: '' })).toThrow(
			'non-empty callId',
		)
		expect(nestedRun.callCount).toBe(2)

		const workflowContext = service.createHarnessHostToolContext({
			...request,
			target: { kind: 'workflow', id: 'rootWorkflow' },
			caller: { kind: 'workflow', workflowId: 'rootWorkflow' },
		})
		expect(workflowContext.tool.caller).toEqual({ kind: 'workflow', workflowId: 'rootWorkflow' })
		expect('agentId' in workflowContext.tool.caller).toBe(false)
		controller.abort()
		expect(context.signal.aborted).toBe(true)
	})

	it('rejects a host tool owned by another ServiceBuilder lineage before mounting', () => {
		const foreignBuilder = new ServiceBuilder(serviceInfo)
		const foreignTool = foreignBuilder
			.defineTool('sameLookup', {
				description: 'Foreign.',
				input: z.string(),
				output: z.string(),
			})
			.setHandler(async (_context, input) => input)
		const agent = defineAgent('foreignToolAgent', { instructions: 'Use the tool.', tools: [foreignTool] })
		const definition = defineHarness({ name: 'foreignToolHarness', revision: 'v1' }).addAgent(agent)
		const sameIdBuilder = new ServiceBuilder(serviceInfo)
		sameIdBuilder
			.defineTool('sameLookup', { description: 'Locally owned.', input: z.string(), output: z.string() })
			.setHandler(async (_context, input) => input)

		expect(() => sameIdBuilder.mountHarness(definition)).toThrow('Host tool owner does not match')
		expect(foreignBuilder.mountHarness(definition)).toBe(foreignBuilder)

		const privateBuilder = new ServiceBuilder(serviceInfo)
		privateBuilder
			.defineTool('directLookup', { description: 'Owned.', input: z.string(), output: z.string() })
			.setHandler(async (_context, input) => input)
		const reflectedValues = Reflect.ownKeys(privateBuilder).flatMap(key => {
			const descriptor = Object.getOwnPropertyDescriptor(privateBuilder, key)
			return descriptor && 'value' in descriptor ? [descriptor.value] : []
		})
		const recoveredOwner = reflectedValues.find(value => {
			try {
				defineHostTool(value as never, 'reflectedOwnerProbe', {
					description: 'Probe.',
					input: z.string(),
					output: z.string(),
					async handler(_context, input) {
						return input
					},
				})
				return true
			} catch {
				return false
			}
		})
		expect(recoveredOwner).toBeUndefined()
		const directTool = defineHostTool(createHostOwnerToken<object>(), 'directLookup', {
			description: 'Direct.',
			input: z.string(),
			output: z.string(),
			async handler(_context, input) {
				return input
			},
		})
		const directDefinition = defineHarness({ name: 'directToolHarness', revision: 'v1' }).addAgent(
			defineAgent('directToolAgent', {
				instructions: 'Use.',
				tools: [directTool],
			}),
		)
		expect(() => privateBuilder.mountHarness(directDefinition)).toThrow('Host tool owner does not match')
	})

	it('throws when definitions are not resolved', () => {
		const service = new ServiceBuilder(serviceInfo)

		expect(() => {
			service.getCommandDefinitions()
		}).toThrow('Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions')

		expect(() => {
			service.getSubscriptionDefinitions()
		}).toThrow('Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions')
	})

	it('returns definitions after resolving', async () => {
		const service = new ServiceBuilder(serviceInfo)

		await service.resolveDefinitions()

		expect(service.getCommandDefinitions()).toEqual([])
		expect(service.getSubscriptionDefinitions()).toEqual([])
		expect(service.getScheduleDefinitions()).toEqual([])
		expect(service.getEventToQueueBindings()).toEqual([])
	})

	it('stores event-to-queue binding definitions', async () => {
		const service = new ServiceBuilder(serviceInfo).bindEventToQueue(
			'billing.monthlyCycleDue',
			'billing.monthlyClosing',
			{
				idempotencyKey: event => `billing-cycle:${event.cycleId}`,
			},
		)

		await service.resolveDefinitions()

		expect(service.getEventToQueueBindings()).toEqual([
			expect.objectContaining({
				eventName: 'billing.monthlyCycleDue',
				queueName: 'billing.monthlyClosing',
				idempotencyMode: 'advisory',
			}),
		])
	})

	it('cascades service metrics to command, subscription, stream, and queue context types', () => {
		const orderMetricAttributesSchema = z.object({ channel: z.enum(['web', 'api']) })
		const service = new ServiceBuilder(serviceInfo).defineMetric('app.orders.created', {
			kind: 'counter',
			unit: '{order}',
			description: 'Created orders',
			attributes: orderMetricAttributesSchema,
		})

		service.getCommandBuilder('createOrder', 'Create order').setCommandFunction(async function (context) {
			context.metrics['app.orders.created'].add(1, { channel: 'web' })
			expectTypeOf(context.metrics).toEqualTypeOf<
				PuristaMetricContext<{
					'app.orders.created': {
						kind: 'counter'
						unit: '{order}'
						description: 'Created orders'
						attributes: typeof orderMetricAttributesSchema
					}
				}>
			>()
			// @ts-expect-error unknown metrics are not exposed
			context.metrics['app.unknown'].add(1)
			// @ts-expect-error counters do not expose histogram record
			context.metrics['app.orders.created'].record(1)
			// @ts-expect-error attributes must match the declaration schema
			context.metrics['app.orders.created'].add(1, { unknown: 'value' })
			return undefined
		})

		service
			.getSubscriptionBuilder('orderSubscription', 'React to order')
			.setSubscriptionFunction(async function (context) {
				context.metrics['app.orders.created'].add(1, { channel: 'api' })
				return undefined
			})

		service
			.getStreamBuilder('orderStream', 'Stream order')
			.setStreamFunction(async function (context, _payload, _parameter, writer) {
				context.metrics['app.orders.created'].add(1, { channel: 'web' })
				await writer.close()
			})

		type Metrics = {
			'app.orders.created': {
				kind: 'counter'
				unit: '{order}'
				description: 'Created orders'
				attributes: typeof orderMetricAttributesSchema
			}
		}
		type Empty = Record<string, never>
		type QueueContext = QueueJobContext<unknown, unknown, Empty, Empty, Empty, Empty, Empty, Metrics>
		expectTypeOf<QueueContext['metrics']>().toEqualTypeOf<PuristaMetricContext<Metrics>>()
		// @ts-expect-error queue contexts reject undeclared metrics
		expectTypeOf<QueueContext['metrics']['app.unknown']>()
	})
})

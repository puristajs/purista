import { defineAgent, defineHarness, defineWorkflow, harnessExecutionEventTypesV1 } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { expectTypeOf, vi } from 'vitest'
import { z } from 'zod'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { DefaultQueueBridge } from '../DefaultQueueBridge/DefaultQueueBridge.impl.js'
import { createHarnessInvocationProxy } from '../HarnessMount/invocation.js'
import {
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from '../HarnessMount/remoteTargetContract.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { QueueWorkerBuilder } from './QueueWorkerBuilder.impl.js'

function generatedAgentTarget() {
	const inputSchema = { type: 'string' } as const
	const validatedInputSchema = { type: 'string' } as const
	const outputSchema = { type: 'string' } as const
	const source = {
		schemaVersion: 1 as const,
		address: { serviceName: 'Remote', serviceVersion: '1', serviceTarget: 'answer' } as const,
		target: {
			targetName: 'answer' as const,
			kind: 'agent' as const,
			inputSchema,
			validatedInputSchema,
			outputSchema,
			updateSchema: false as const,
			interruptSchema: false as const,
			invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
			stream: {
				protocol: 'harness-execution-events-v1' as const,
				eventTypes: harnessExecutionEventTypesV1,
				outputUpdates: [] as const,
			},
			queue: { name: 'remote.answers' } as const,
		},
		schemas: {
			input: createGeneratedHarnessSchema<string>(inputSchema),
			validatedInput: createGeneratedHarnessSchema<string>(validatedInputSchema),
			output: createGeneratedHarnessSchema<string>(outputSchema),
		},
	}
	return createRemoteHarnessTargetContract({
		...source,
		target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
	})
}

function generatedWorkflowTarget() {
	const inputSchema = { type: 'string' } as const
	const validatedInputSchema = { type: 'string' } as const
	const outputSchema = { type: 'string' } as const
	const source = {
		schemaVersion: 1 as const,
		address: { serviceName: 'Remote', serviceVersion: '1', serviceTarget: 'summarize' } as const,
		target: {
			targetName: 'summarize' as const,
			kind: 'workflow' as const,
			inputSchema,
			validatedInputSchema,
			outputSchema,
			updateSchema: false as const,
			interruptSchema: false as const,
			invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
			stream: {
				protocol: 'harness-execution-events-v1' as const,
				eventTypes: harnessExecutionEventTypesV1,
				outputUpdates: [] as const,
			},
		},
		schemas: {
			input: createGeneratedHarnessSchema<string>(inputSchema),
			validatedInput: createGeneratedHarnessSchema<string>(validatedInputSchema),
			output: createGeneratedHarnessSchema<string>(outputSchema),
		},
	}
	return createRemoteHarnessTargetContract({
		...source,
		target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
	})
}

describe('QueueWorkerBuilder', () => {
	it('retains the exact queue name through every fluent type transition', () => {
		const builder = new QueueWorkerBuilder('supportQueue', 'execute')
			.canInvoke('TicketService', '1', 'loadTicket', z.string(), z.string(), z.string())
			.canConsumeStream('ReportService', '1', 'streamReport', z.string(), z.string(), z.string(), z.string())
			.canEnqueue('auditQueue', z.string(), z.string())
			.canEmit('worker.done', z.string())
			.setBeforeGuardHooks({ async auth() {} })
			.setAfterGuardHooks({ async audit() {} })

		expectTypeOf(builder.queueName).toEqualTypeOf<'supportQueue'>()
	})

	it('stores and exposes before and after guard hooks by name', () => {
		const beforeGuard = async function beforeGuard() {}
		const afterGuard = async function afterGuard() {}

		const builder = new QueueWorkerBuilder('supportQueue', 'execute')
			.setBeforeGuardHooks({ auth: beforeGuard })
			.setAfterGuardHooks({ audit: afterGuard })

		expect(builder.getBeforeGuardHook('auth')).toBe(beforeGuard)
		expect(builder.getAfterGuardHook('audit')).toBe(afterGuard)
	})

	it('includes registered guard hooks in the worker definition', async () => {
		const beforeGuard = async function beforeGuard() {}
		const afterGuard = async function afterGuard() {}

		const definition = await new QueueWorkerBuilder('supportQueue', 'execute')
			.setBeforeGuardHooks({ auth: beforeGuard })
			.setAfterGuardHooks({ audit: afterGuard })
			.setHandler(async function handler() {
				return { status: 'success' as const }
			})
			.getDefinition()

		expect(definition.beforeGuards?.auth).toBe(beforeGuard)
		expect(definition.afterGuards?.audit).toBe(afterGuard)
	})

	it('includes declared handler capabilities in the worker definition', async () => {
		const payloadSchema = z.object({ id: z.string() })
		const parameterSchema = z.object({ tenantId: z.string() })
		const outputSchema = z.object({ status: z.enum(['ok', 'failed']) })
		const chunkSchema = z.object({ chunk: z.string() })
		const finalSchema = z.object({ done: z.boolean() })
		const eventSchema = z.object({ jobId: z.string() })

		const definition = await new QueueWorkerBuilder('supportQueue', 'execute')
			.canInvoke('TicketService', '1', 'loadTicket', outputSchema, payloadSchema, parameterSchema)
			.canConsumeStream('ReportService', '1', 'streamReport', chunkSchema, payloadSchema, parameterSchema, finalSchema)
			.canEnqueue('auditQueue', payloadSchema, parameterSchema)
			.canEmit('worker.done', eventSchema)
			.setHandler(async function handler() {
				return { status: 'success' as const }
			})
			.getDefinition()

		expect(definition.invokes.TicketService['1'].loadTicket).toMatchObject({
			outputSchema,
			payloadSchema,
			parameterSchema,
		})
		expect(definition.streamInvokes.ReportService['1'].streamReport).toMatchObject({
			chunkSchema,
			finalSchema,
			payloadSchema,
			parameterSchema,
			validateChunk: true,
			validateFinal: true,
		})
		expect(definition.queueInvokes.auditQueue).toMatchObject({
			payloadSchema,
			parameterSchema,
		})
		expect(definition.emitList['worker.done']).toBe(eventSchema)
	})

	it('uses hydrated remote contracts as address-first capabilities and preserves their queue grant', async () => {
		const agent = generatedAgentTarget()
		const workflow = generatedWorkflowTarget()
		const builder = new QueueWorkerBuilder('worker', 'invoke-harness')
			.canInvokeAgent(agent)
			.canInvokeWorkflow(workflow)
			.setHandler(async function (context) {
				const agentRun = context.agent.Remote['1'].answer.run('question')
				const agentStream = context.agent.Remote['1'].answer.stream('question')
				const agentEnqueue = context.agent.Remote['1'].answer.enqueue('question')
				const workflowRun = context.workflow.Remote['1'].summarize.run('question')
				const workflowStream = context.workflow.Remote['1'].summarize.stream('question')
				void [agentRun, agentStream, agentEnqueue, workflowRun, workflowStream]
				return { status: 'success' as const }
			})

		const definition = await builder.getDefinition()
		expect(definition.invokes.Remote['1'].answer).toHaveProperty('harnessBinding')
		expect(definition.invokes.Remote['1'].summarize).toHaveProperty('harnessBinding')

		const invoke = vi.fn(async (_address, _payload, _parameter, harness) => ({
			sessionId: harness.root.sessionId,
			outcome: { status: 'completed' as const, runId: 'remote-run', output: 'done' },
		}))
		const open = vi.fn(async () => streamHandle('done'))
		const enqueue = vi.fn(async () => ({ jobId: 'job-1', queueName: 'remote.answers' }))
		const proxy = createHarnessInvocationProxy<any>(
			'agent',
			invoke as any,
			open as any,
			enqueue as any,
			definition.invokes,
		)

		await expect(proxy.Remote['1'].answer.run('question')).resolves.toMatchObject({
			outcome: { status: 'completed', output: 'done' },
		})
		await expect((await proxy.Remote['1'].answer.stream('question')).result).resolves.toMatchObject({
			status: 'completed',
			output: 'done',
		})
		await expect(proxy.Remote['1'].answer.enqueue('question')).resolves.toMatchObject({
			jobId: 'job-1',
			queueName: 'remote.answers',
		})
		expect(enqueue).toHaveBeenCalledWith('remote.answers', 'question', expect.any(Object), undefined)
		const workflowProxy = createHarnessInvocationProxy<any>(
			'workflow',
			invoke as any,
			open as any,
			undefined,
			definition.invokes,
		)
		await expect(workflowProxy.Remote['1'].summarize.run('question')).resolves.toMatchObject({
			outcome: { status: 'completed', output: 'done' },
		})
		await expect((await workflowProxy.Remote['1'].summarize.stream('question')).result).resolves.toMatchObject({
			status: 'completed',
			output: 'done',
		})

		expect(() =>
			new QueueWorkerBuilder('worker', 'copied').canInvokeAgent('Remote', '1', { ...agent } as never),
		).toThrow('exact factory-created binding')
		// biome-ignore lint/correctness/noConstantCondition: Compile-only target-kind proof.
		if (false) {
			// @ts-expect-error Workflow declarations cannot accept agent targets.
			new QueueWorkerBuilder('worker', 'wrong-kind').canInvokeWorkflow(agent)
		}
	})

	it('finalizes local agent and workflow declarations for a real queue-worker service context', async () => {
		const valueSchema = z.object({ value: z.string() })
		const agent = defineAgent('classify', {
			input: valueSchema,
			output: valueSchema,
			instructions: 'Return the classified value.',
			prompt: input => ({ role: 'user', content: input.value }),
		})
		const workflow = defineWorkflow('echo', {
			input: valueSchema,
			output: valueSchema,
			async handler({ input }) {
				return input
			},
		})
		const harness = defineHarness({ name: 'workerInvocation' }).addAgent(agent).addWorkflow(workflow)
		let resolveCompletion: (value: unknown) => void = () => undefined
		const completion = new Promise<unknown>(resolve => {
			resolveCompletion = resolve
		})
		const builder = new ServiceBuilder({
			serviceName: 'WorkerInvocation',
			serviceVersion: '1',
			serviceDescription: 'finalized worker invocation test',
		})
		const worker = builder
			.getQueueWorkerBuilder('worker.invocation', 'invoke-harness')
			.canInvokeAgent('WorkerInvocation', '1', agent.contract)
			.canInvokeWorkflow('WorkerInvocation', '1', workflow.contract)
			.setHandler(async function (context, message) {
				const payload = message.payload as { value: string }
				const agentResult = await context.agent.WorkerInvocation['1'].classify.run(payload)
				const stream = await context.workflow.WorkerInvocation['1'].echo.stream(payload)
				for await (const _event of stream) {
					// Consume the complete provider-neutral execution stream.
				}
				resolveCompletion({ agentResult, workflowOutcome: await stream.result })
				return { status: 'success' as const }
			})
		const queue = new QueueDefinitionBuilder('worker.invocation', 'Invoke mounted Harness roots').addPayloadSchema(
			valueSchema,
		)
		builder
			.addQueueDefinition(queue.getDefinition())
			.addQueueWorkerDefinition(worker.getDefinition())
			.mountHarness(harness)
		const eventBridge = new DefaultEventBridge()
		const queueBridge = new DefaultQueueBridge()
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { value: 'classified' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, {
			ai: { model: { provider, model: 'fake' } },
			queueBridge,
		} as never)
		await service.start()
		try {
			await queueBridge.enqueue({ queueName: 'worker.invocation', payload: { value: 'source' } })
			await expect(completion).resolves.toMatchObject({
				agentResult: { outcome: { status: 'completed', output: { value: 'classified' } } },
				workflowOutcome: { status: 'completed', output: { value: 'source' } },
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})

function streamHandle(output: string) {
	const outcome = { status: 'completed' as const, runId: 'remote-run', output }
	return {
		sessionId: 'transport-session',
		cancel: vi.fn(async () => undefined),
		async *[Symbol.asyncIterator]() {
			yield {
				payload: {
					frameType: 'chunk' as const,
					sequence: 1,
					chunk: {
						type: 'run.started' as const,
						eventId: 'start',
						sequence: 1,
						runId: outcome.runId,
						at: '2026-09-08T00:00:00.000Z',
					},
				},
			}
			yield {
				payload: {
					frameType: 'chunk' as const,
					sequence: 2,
					chunk: {
						type: 'run.finished' as const,
						eventId: 'finished',
						sequence: 2,
						runId: outcome.runId,
						at: '2026-09-08T00:00:01.000Z',
						outcome,
					},
				},
			}
			yield { payload: { frameType: 'complete' as const, sequence: 3, final: outcome } }
		},
	}
}

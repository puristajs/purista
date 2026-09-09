import {
	defineAgent,
	defineTool,
	defineWorkflow,
	type HarnessTargetExecutionEvent,
	type HarnessTargetExecutionTerminalOutcome,
	harnessExecutionEventTypesV1,
	type JsonValue,
	type ModelSchema,
} from '@purista/harness'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'

import type { CorrelationId } from '../core/types/CorrelationId.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import {
	createHarnessInvocationProxy,
	finalizeHarnessInvocationBinding,
	type HarnessTargetClient,
	type HarnessTargetQueueEnqueueResult,
	type HarnessTargetRunResult,
	registerHarnessInvocation,
} from './invocation.js'
import {
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from './remoteTargetContract.js'

const answerAgent = defineAgent('answer', { instructions: 'Answer.' })
const target = answerAgent.contract
const workflowTarget = defineWorkflow('answer', {
	durable: true,
	async handler({ input }) {
		return input
	},
}).contract
const approvalTool = defineTool('bash', {
	description: 'Perform an approved action.',
	input: z.string(),
	output: z.string(),
	async handler(_context, input) {
		return input
	},
})
const approvalTarget = defineAgent('approval', {
	instructions: 'Use the action.',
	tools: [approvalTool],
	permissions: { bash: 'require_approval' },
}).contract
const digest = `sha256:${'a'.repeat(64)}` as const
const agentDeclaration = registerHarnessInvocation({}, {}, 'Knowledge', '1', target)
const invokes = finalizeHarnessInvocationBinding(
	agentDeclaration.invokes,
	agentDeclaration.streamInvokes,
	'Knowledge',
	'1',
	'answer',
	digest,
).invokes as any
const workflowDeclaration = registerHarnessInvocation({}, {}, 'Knowledge', '1', workflowTarget)
const workflowInvokes = finalizeHarnessInvocationBinding(
	workflowDeclaration.invokes,
	workflowDeclaration.streamInvokes,
	'Knowledge',
	'1',
	'answer',
	digest,
).invokes as any
const approvalDeclaration = registerHarnessInvocation({}, {}, 'Knowledge', '1', approvalTarget)
const approvalInvokes = finalizeHarnessInvocationBinding(
	approvalDeclaration.invokes,
	approvalDeclaration.streamInvokes,
	'Knowledge',
	'1',
	'approval',
	digest,
).invokes as any
const queuedTarget = remoteQueuedTarget()
const queuedDeclaration = registerHarnessInvocation({}, {}, queuedTarget)
const queuedInvokes = finalizeHarnessInvocationBinding(
	queuedDeclaration.invokes,
	queuedDeclaration.streamInvokes,
	'QueueService',
	'1',
	'queued',
	queuedTarget.exportDigest,
).invokes as any

type Client = {
	Knowledge: {
		'1': {
			answer: {
				run(
					input: string,
					options?: { sessionId?: string; idempotencyKey?: string },
				): Promise<HarnessTargetRunResult<typeof target>>
				stream(
					input: string,
					options?: { sessionId?: string },
				): Promise<import('./invocation.js').HarnessExecutionStream<typeof target>>
			}
		}
	}
}

type QueuedClient = {
	QueueService: { '1': { queued: HarnessTargetClient<typeof queuedTarget> } }
}

describe('address-first Harness invocations', () => {
	it.each(['completed', 'interrupted'] as const)(
		'returns Framework-owned session and %s outcome wrappers',
		async status => {
			const invoke = vi.fn(async (_address, _payload, _parameter, harness) => ({
				sessionId: harness.root.sessionId,
				outcome:
					status === 'completed'
						? { status, runId: 'harness-run', output: 'done' }
						: {
								status,
								runId: 'harness-run',
								interrupt: {
									type: 'external-wait',
									id: 'wait',
									revision: '1',
									kind: 'review',
									schemaVersion: '1',
									definitionVersion: '1',
									deadline: '2026-09-08T00:00:00.000Z',
								},
							},
			}))
			const proxy = createHarnessInvocationProxy<Client>(
				status === 'interrupted' ? 'workflow' : 'agent',
				invoke as any,
				vi.fn() as any,
				undefined,
				status === 'interrupted' ? workflowInvokes : invokes,
			)
			const result = await proxy.Knowledge['1'].answer.run('question', {
				sessionId: 'supplied',
				idempotencyKey: 'stable',
			})
			expect(result.sessionId).toBe('supplied')
			expect(result.outcome.status).toBe(status)
			const [address, payload, parameter, harness] = invoke.mock.calls[0] ?? []
			expect(address).toEqual({ serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'answer' })
			expect(payload).toBe('question')
			expect(parameter).toEqual({ idempotencyKey: 'stable' })
			expect(parameter).not.toHaveProperty('sessionId')
			expect(harness).toEqual({
				contract: { schemaVersion: 1, exportDigest: digest },
				root: { invocationId: expect.any(String), sessionId: 'supplied' },
			})
			expect(Object.isFrozen(harness)).toBe(true)
		},
	)

	it('derives an omitted session from a private stable invocation id', async () => {
		let generatedSessionId: string | undefined
		let rootKeys: string[] | undefined
		const invoke = vi.fn(async (_address, _payload, _parameter, harness) => {
			generatedSessionId = harness.root.sessionId
			rootKeys = Object.keys(harness.root)
			return {
				sessionId: harness.root.sessionId,
				outcome: { status: 'completed', runId: 'harness-run', output: 'done' },
			}
		})
		const proxy = createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, invokes)
		const result = await proxy.Knowledge['1'].answer.run('question')
		expect(result.sessionId).toBe(generatedSessionId)
		expect(result.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u)
		expect(result.sessionId).not.toBe(result.outcome.runId)
		expect(rootKeys).toEqual(['invocationId', 'sessionId'])
	})

	it('reserves queue session identity and returns the closed queue acceptance wrapper', async () => {
		const enqueue = vi.fn(async (_queueName: string, _input: unknown, _parameter: unknown, _options?: unknown) => ({
			jobId: 'job-1',
			queueName: 'target-jobs',
			scheduledAt: 123,
		}))
		const proxy = createHarnessInvocationProxy<QueuedClient>(
			'agent',
			vi.fn() as any,
			vi.fn() as any,
			enqueue,
			queuedInvokes,
		)
		const supplied = await proxy.QueueService['1'].queued.enqueue(
			'question',
			{ sessionId: 'queue-session', metadata: { source: 'test' } },
			{ idempotencyKey: 'queue-dedup' },
		)

		expectTypeOf(supplied).toEqualTypeOf<HarnessTargetQueueEnqueueResult>()
		expect(supplied).toEqual({
			jobId: 'job-1',
			queueName: 'target-jobs',
			scheduledAt: 123,
			sessionId: 'queue-session',
		})
		expect(Object.isFrozen(supplied)).toBe(true)
		expect(enqueue).toHaveBeenCalledWith(
			'target-jobs',
			'question',
			{
				schemaVersion: 1,
				invocationId: expect.any(String),
				sessionId: 'queue-session',
				parameter: { metadata: { source: 'test' } },
			},
			{ idempotencyKey: 'queue-dedup' },
		)

		const generated = await proxy.QueueService['1'].queued.enqueue('next')
		expect(generated.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u)
		expect(enqueue.mock.calls[1]?.[2]).toEqual({
			schemaVersion: 1,
			invocationId: generated.sessionId,
			sessionId: generated.sessionId,
			parameter: {},
		})

		enqueue.mockImplementationOnce(
			async () => ({ jobId: 'job-2', queueName: 'target-jobs', scheduledAt: 456, extra: 'not-allowed' }) as never,
		)
		await expect(proxy.QueueService['1'].queued.enqueue('invalid')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
			message: 'Harness target queue returned an invalid acceptance receipt.',
		})
	})

	it('keeps the accepted queue identity stable for strict idempotent enqueue across client instances', async () => {
		const accepted = new Map<string, { receipt: { jobId: string; queueName: string }; parameter: unknown }>()
		const enqueue = vi.fn(
			async (queueName: string, _input: unknown, parameter: unknown, options?: { idempotencyKey?: string }) => {
				const key = options?.idempotencyKey ?? `job-${accepted.size}`
				const existing = accepted.get(key)
				if (existing) return existing.receipt
				const receipt = { jobId: `job-${accepted.size + 1}`, queueName }
				accepted.set(key, { receipt, parameter })
				return receipt
			},
		)
		const first = createHarnessInvocationProxy<QueuedClient>(
			'agent',
			vi.fn() as any,
			vi.fn() as any,
			enqueue,
			queuedInvokes,
		)
		const second = createHarnessInvocationProxy<QueuedClient>(
			'agent',
			vi.fn() as any,
			vi.fn() as any,
			enqueue,
			queuedInvokes,
		)

		const original = await first.QueueService['1'].queued.enqueue('question', {}, { idempotencyKey: 'same-job' })
		const duplicate = await second.QueueService['1'].queued.enqueue('question', {}, { idempotencyKey: 'same-job' })
		const distinct = await second.QueueService['1'].queued.enqueue('question', {}, { idempotencyKey: 'other-job' })

		expect(duplicate.jobId).toBe(original.jobId)
		expect(duplicate.sessionId).toBe(original.sessionId)
		expect(enqueue.mock.calls[1]?.[2]).toEqual(accepted.get('same-job')?.parameter)
		expect(distinct.sessionId).not.toBe(original.sessionId)
	})

	it.each([
		['failed', StatusCode.InternalServerError],
		['cancelled', StatusCode.GatewayTimeout],
	] as const)('rejects an operational %s aggregate outcome locally', async (status, errorCode) => {
		const invoke = vi.fn(async (_address, _payload, _parameter, harness) => ({
			sessionId: harness.root.sessionId,
			outcome: { status, runId: 'harness-run', error: { code: 'REMOTE', message: `secret remote ${status}` } },
		}))
		const proxy = createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, invokes)
		const rejection = await proxy.Knowledge['1'].answer.run('question').catch(error => error)
		expect(rejection).toMatchObject({ errorCode })
		expect(JSON.stringify(rejection)).not.toContain('secret')
	})

	it('validates and freezes the complete tool-approval interruption boundary', async () => {
		const request = {
			approvalId: 'approval-1',
			runId: 'harness-run',
			agentRunId: 'agent-run',
			parentRunId: 'parent-run',
			parentInvocationId: 'parent-call',
			agentId: 'approval',
			workflowId: 'workflow-1',
			invocationId: 'agent-call',
			step: 0,
			toolId: 'bash',
			callId: 'tool-call',
			input: { value: 'safe' },
			demands: [
				{
					decisionId: `decision_${'a'.repeat(64)}`,
					source: { kind: 'policy', id: 'payments', version: '1', ruleId: 'approval_required' },
					phase: 'approval',
					reasonCode: 'review_required',
				},
			],
		}
		const invoke = vi.fn(async (_address, _payload, _parameter, harness) => ({
			sessionId: harness.root.sessionId,
			outcome: {
				status: 'interrupted',
				runId: 'harness-run',
				interrupt: { type: 'tool-approval', id: 'approval-batch', revision: '1', requests: [request] },
			},
		}))
		const proxy = createHarnessInvocationProxy<any>('agent', invoke as any, vi.fn() as any, undefined, approvalInvokes)
		const result = await proxy.Knowledge['1'].approval.run('question')

		expect(result.outcome).toMatchObject({ status: 'interrupted' })
		expect(Object.isFrozen(result.outcome)).toBe(true)
		if (result.outcome.status !== 'interrupted' || result.outcome.interrupt.type !== 'tool-approval') {
			throw new Error('Expected a tool-approval interruption.')
		}
		expect(Object.isFrozen(result.outcome.interrupt.requests[0]?.demands[0]?.source)).toBe(true)

		for (const malformed of [
			{ ...request, workflowId: '' },
			{ ...request, parentInvocationId: undefined },
			{ ...request, demands: [{ ...request.demands[0], phase: 'invented' }] },
			{ ...request, demands: [{ ...request.demands[0], source: { kind: 'invented', id: 'payments' } }] },
			{ ...request, demands: [{ ...request.demands[0], reasonCode: 'INVALID-CODE' }] },
		]) {
			;(invoke as any).mockImplementationOnce(
				async (_address: unknown, _payload: unknown, _parameter: unknown, harness: any) => ({
					sessionId: harness.root.sessionId,
					outcome: {
						status: 'interrupted',
						runId: 'harness-run',
						interrupt: { type: 'tool-approval', id: 'approval-batch', revision: '1', requests: [malformed] },
					},
				}),
			)
			await expect(proxy.Knowledge['1'].approval.run('question')).rejects.toThrow('malformed')
		}
	})

	it.each([
		[
			'extra wrapper key',
			(sessionId: string) => ({
				sessionId,
				outcome: { status: 'completed', runId: 'run', output: 'done' },
				extra: true,
			}),
		],
		[
			'extra outcome key',
			(sessionId: string) => ({
				sessionId,
				outcome: { status: 'completed', runId: 'run', output: 'done', extra: true },
			}),
		],
		[
			'non-JSON output',
			(sessionId: string) => ({ sessionId, outcome: { status: 'completed', runId: 'run', output: new Date() } }),
		],
	] as const)('rejects %s aggregate responses as protocol failures', async (_label, response) => {
		const invoke = vi.fn(async (_address, _payload, _parameter, harness) => response(harness.root.sessionId))
		const proxy = createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, invokes)
		await expect(proxy.Knowledge['1'].answer.run('question')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('exposes exact events and producer-owned terminal result without transport frames', async () => {
		const open = vi.fn(async (_address, _payload, parameter, harness) => {
			expect(parameter).toEqual({})
			const outcome = { status: 'completed' as const, runId: 'harness-run', output: 'done' }
			expect(harness.root).toEqual({ invocationId: expect.any(String), sessionId: 'stream-session' })
			return streamHandle(outcome)
		})
		const proxy = createHarnessInvocationProxy<Client>('agent', vi.fn() as any, open as any, undefined, invokes)
		const stream = await proxy.Knowledge['1'].answer.stream('question', { sessionId: 'stream-session' })
		expectTypeOf(stream.result).toEqualTypeOf<Promise<HarnessTargetExecutionTerminalOutcome<typeof target>>>()
		await expect(stream.result).resolves.toMatchObject({ status: 'completed', output: 'done' })
		expect(stream.sessionId).toBe('stream-session')
		const events: HarnessTargetExecutionEvent<typeof target>[] = []
		for await (const event of stream) events.push(event)
		expect(events.map(event => event.type)).toEqual(['run.started', 'run.finished'])
	})

	it('rejects identity and canonical terminal mismatches', async () => {
		const badInvoke = vi.fn(async () => ({
			sessionId: 'other',
			outcome: { status: 'completed', runId: 'harness-run', output: 'done' },
		}))
		const proxy = createHarnessInvocationProxy<Client>('agent', badInvoke as any, vi.fn() as any, undefined, invokes)
		await expect(proxy.Knowledge['1'].answer.run('question')).rejects.toThrow('identity')
		const open = vi.fn(async () =>
			streamHandle(
				{ status: 'completed', runId: 'harness-run', output: 'first' },
				{ status: 'completed', runId: 'harness-run', output: 'second' },
			),
		)
		const streamed = createHarnessInvocationProxy<Client>('agent', vi.fn() as any, open as any, undefined, invokes)
		await expect((await streamed.Knowledge['1'].answer.stream('question')).result).rejects.toThrow('terminal')
	})

	it('rejects unauthentic, misaddressed, and incomplete bindings before transport', async () => {
		expect(() => registerHarnessInvocation({}, {}, '', '1', target)).toThrow('non-empty')
		expect(() => registerHarnessInvocation({}, {}, 'Knowledge', '1', { ...target } as never)).toThrow('authentic')
		expect(() =>
			finalizeHarnessInvocationBinding(
				agentDeclaration.invokes,
				agentDeclaration.streamInvokes,
				'Knowledge',
				'1',
				'answer',
				undefined as never,
			),
		).toThrow('digest')

		const invoke = vi.fn()
		const forged = {
			Knowledge: { '1': { answer: { harnessTarget: { ...target }, harnessExportDigest: digest } } },
		} as any
		const proxy = createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, forged)
		await expect(proxy.Knowledge['1'].answer.run('question')).rejects.toThrow('incomplete')
		expect(invoke).not.toHaveBeenCalled()

		const unfinalized = agentDeclaration.invokes as any
		const unfinalizedProxy = createHarnessInvocationProxy<Client>(
			'agent',
			invoke as any,
			vi.fn() as any,
			undefined,
			unfinalized,
		)
		await expect(unfinalizedProxy.Knowledge['1'].answer.run('question')).rejects.toThrow('incomplete')

		const definition = {
			Knowledge: { '1': { answer: { harnessTarget: answerAgent, harnessExportDigest: digest } } },
		} as any
		await expect(
			createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, definition).Knowledge[
				'1'
			].answer.run('question'),
		).rejects.toThrow('incomplete')
		await expect(
			createHarnessInvocationProxy<Client>(
				'agent',
				invoke as any,
				vi.fn() as any,
				undefined,
				workflowInvokes,
			).Knowledge['1'].answer.run('question'),
		).rejects.toThrow('agent invocation received a workflow')

		const authenticDescriptor = (invokes as any).Knowledge['1'].answer
		const relocatedService = createHarnessInvocationProxy<any>('agent', invoke as any, vi.fn() as any, undefined, {
			Other: { '1': { answer: authenticDescriptor } },
		})
		await expect(relocatedService.Other['1'].answer.run('question')).rejects.toThrow('finalized binding')
		const relocatedVersion = createHarnessInvocationProxy<any>('agent', invoke as any, vi.fn() as any, undefined, {
			Knowledge: { '2': { answer: authenticDescriptor } },
		})
		await expect(relocatedVersion.Knowledge['2'].answer.run('question')).rejects.toThrow('finalized binding')
		expect(invoke).not.toHaveBeenCalled()
	})

	it('rejects a contract created by a foreign Harness package instance before transport', async () => {
		vi.resetModules()
		const foreignHarness = await import('@purista/harness')
		const foreignTarget = foreignHarness.defineAgent('answer', { instructions: 'Answer.' }).contract
		const invoke = vi.fn()

		expect(() => registerHarnessInvocation({}, {}, 'Knowledge', '1', foreignTarget)).toThrow('authentic')
		const forged = {
			Knowledge: { '1': { answer: { harnessTarget: foreignTarget, harnessExportDigest: digest } } },
		} as any
		await expect(
			createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, forged).Knowledge[
				'1'
			].answer.run('question'),
		).rejects.toThrow('incomplete')
		expect(invoke).not.toHaveBeenCalled()
	})

	it('rejects resume with an idempotency key before transport', async () => {
		const invoke = vi.fn()
		const proxy = createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, invokes)
		await expect(
			proxy.Knowledge['1'].answer.run('question', {
				idempotencyKey: 'duplicate-intent',
				resume: {
					type: 'tool-approval',
					runId: 'run-1',
					interruptId: 'approval',
					revision: '1',
					eventId: 'resume-1',
					decisions: [],
				},
			} as never),
		).rejects.toMatchObject({ errorCode: StatusCode.BadRequest })
		expect(invoke).not.toHaveBeenCalled()
	})

	it.each([
		[
			'resume',
			{
				resume: {
					type: 'tool-approval',
					runId: 'resume-run',
					interruptId: 'approval',
					revision: '1',
					eventId: 'resume-1',
					decisions: [],
				},
			},
			'resume-run',
		],
		['durable', { durable: { runId: 'durable-run' } }, 'durable-run'],
	] as const)(
		'passes %s options unchanged and authenticates the returned Harness run id',
		async (_label, options, runId) => {
			const invoke = vi.fn(async (_address, _payload, _parameter, harness) => ({
				sessionId: harness.root.sessionId,
				outcome: { status: 'completed', runId, output: 'done' },
			}))
			const proxy = createHarnessInvocationProxy<Client>('agent', invoke as any, vi.fn() as any, undefined, invokes)
			await expect(proxy.Knowledge['1'].answer.run('question', options as never)).resolves.toMatchObject({
				outcome: { runId },
			})
			expect(invoke.mock.calls[0]?.[2]).toEqual(options)

			invoke.mockImplementationOnce(async (_address, _payload, _parameter, harness) => ({
				sessionId: harness.root.sessionId,
				outcome: { status: 'completed', runId: 'different-run' as typeof runId, output: 'done' },
			}))
			await expect(proxy.Knowledge['1'].answer.run('question', options as never)).rejects.toThrow(
				'requested run identity',
			)
		},
	)

	it('does not validate or transform asymmetric wire input on the sender side', async () => {
		const validate = vi.fn((value: unknown) => ({ value: { parsed: String(value) } }))
		const input = generatedSchema<string, { parsed: string }>(validate)
		const asymmetric = defineAgent('asymmetric', {
			input,
			instructions: 'Answer.',
			prompt: value => ({ role: 'user', content: value.parsed }),
		}).contract
		validate.mockClear()
		const declaration = registerHarnessInvocation({}, {}, 'Knowledge', '1', asymmetric)
		const registered = finalizeHarnessInvocationBinding(
			declaration.invokes,
			declaration.streamInvokes,
			'Knowledge',
			'1',
			'asymmetric',
			digest,
		)
		const invoke = vi.fn(async (_address, _payload, _parameter, harness) => ({
			sessionId: harness.root.sessionId,
			outcome: { status: 'completed', runId: 'harness-run', output: 'done' },
		}))
		const open = vi.fn(async (_address, _payload) =>
			streamHandle({ status: 'completed', runId: 'harness-run', output: 'done' }),
		)
		const proxy = createHarnessInvocationProxy<any>(
			'agent',
			invoke as any,
			open as any,
			undefined,
			registered.invokes as any,
		)
		await proxy.Knowledge['1'].asymmetric.run('wire')
		await (await proxy.Knowledge['1'].asymmetric.stream('stream-wire')).result
		expect(invoke.mock.calls[0]?.[1]).toBe('wire')
		expect(open.mock.calls[0]?.[1]).toBe('stream-wire')
		expect(validate).not.toHaveBeenCalled()
	})
})

function streamHandle(
	candidate: HarnessTargetExecutionTerminalOutcome<typeof target>,
	final: HarnessTargetExecutionTerminalOutcome<typeof target> = candidate,
): StreamHandle<HarnessTargetExecutionEvent<typeof target>, HarnessTargetExecutionTerminalOutcome<typeof target>> {
	const frames: StreamFrame<
		HarnessTargetExecutionEvent<typeof target>,
		HarnessTargetExecutionTerminalOutcome<typeof target>
	>[] = [
		frame({ frameType: 'start', sequence: 0 }),
		frame({
			frameType: 'chunk',
			sequence: 1,
			chunk: {
				type: 'run.started',
				eventId: 'start',
				sequence: 1,
				runId: candidate.runId,
				at: '2026-09-08T00:00:00.000Z',
			},
		}),
		frame({
			frameType: 'chunk',
			sequence: 2,
			chunk: {
				type: 'run.finished',
				eventId: 'finish',
				sequence: 2,
				runId: candidate.runId,
				at: '2026-09-08T00:00:01.000Z',
				outcome: candidate,
			},
		}),
		frame({ frameType: 'complete', sequence: 3, final }),
	]
	return {
		sessionId: 'transport-session' as CorrelationId,
		cancel: vi.fn(async () => undefined),
		async *[Symbol.asyncIterator]() {
			yield* frames
		},
	}
}

function frame(
	payload: StreamFrame<
		HarnessTargetExecutionEvent<typeof target>,
		HarnessTargetExecutionTerminalOutcome<typeof target>
	>['payload'],
): StreamFrame<HarnessTargetExecutionEvent<typeof target>, HarnessTargetExecutionTerminalOutcome<typeof target>> {
	return { payload } as StreamFrame<
		HarnessTargetExecutionEvent<typeof target>,
		HarnessTargetExecutionTerminalOutcome<typeof target>
	>
}

function generatedSchema<Input extends JsonValue, Output extends JsonValue>(
	validate: (value: unknown) => { value: Output },
): ModelSchema<Input, Output> {
	const schema = {}
	Object.defineProperty(schema, '~standard', {
		value: Object.freeze({
			version: 1,
			vendor: 'test',
			validate,
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: Object.freeze({
				input: () => ({ type: 'string' }),
				output: () => ({ type: 'object' }),
			}),
		}),
	})
	return Object.freeze(schema) as ModelSchema<Input, Output>
}

function remoteQueuedTarget() {
	const inputSchema = { type: 'string' } as const
	const validatedInputSchema = { type: 'string' } as const
	const outputSchema = { type: 'string' } as const
	const source = {
		schemaVersion: 1 as const,
		address: { serviceName: 'QueueService', serviceVersion: '1', serviceTarget: 'queued' } as const,
		target: {
			targetName: 'queued' as const,
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
			queue: { name: 'target-jobs' } as const,
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

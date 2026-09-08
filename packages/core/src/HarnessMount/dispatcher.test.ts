import type { ExecutionEvent, JsonValue, ModelSchema, RunOutcome } from '@purista/harness'
import { defineAgent, harnessExecutionEventTypesV1 } from '@purista/harness'
import type { HarnessNestedTargetDispatchInvocation, HarnessTargetDispatchStream } from '@purista/harness/integrator'
import { describe, expect, it, vi } from 'vitest'

import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { CorrelationId } from '../core/types/CorrelationId.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import { createEventBridgeHarnessTargetDispatcher, createHarnessTargetRouteBinding } from './dispatcher.js'
import { computeHarnessTargetExportDigest, createRemoteHarnessTargetContract } from './remoteTargetContract.js'

const support = defineAgent('support', { instructions: 'Answer clearly.' }).contract
const digest = `sha256:${'a'.repeat(64)}` as const

describe('EventBridge Harness target dispatcher', () => {
	it('routes direct and dependency-only targets through EventBridge with trusted transport context', async () => {
		const outcome = { status: 'completed', runId: 'child-run', output: 'answer' } as const
		const raw = completedHandle(outcome)
		const openStream = vi.fn(async () => raw)
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(openStream),
			sender: { serviceName: 'Parent', serviceVersion: '1', serviceTarget: 'command', instanceId: 'bridge-1' },
			bindings: [
				createHarnessTargetRouteBinding({
					target: support,
					address: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
					exportDigest: digest,
					routeBindingRevision: 'revision-1',
					visibility: 'dependency',
				}),
			],
		})
		const invocation = nestedInvocation()
		const stream = await dispatcher.open({ target: support, input: 'question', invocation })

		const authoritative = await stream.result
		expect(authoritative).toEqual(outcome)
		const events = await collect(stream)
		expect(events).toEqual([
			expect.objectContaining({ type: 'run.started', runId: 'child-run' }),
			expect.objectContaining({ type: 'run.finished', runId: 'child-run', outcome }),
		])
		const terminal = events.at(-1)
		expect(terminal?.type).toBe('run.finished')
		if (terminal?.type !== 'run.finished') throw new Error('Expected terminal event.')
		expect(terminal.outcome).toBe(authoritative)
		expect(Object.isFrozen(terminal)).toBe(true)
		expect(Object.isFrozen(terminal.outcome)).toBe(true)
		expect(openStream).toHaveBeenCalledTimes(1)
		const [request, ttl] = (openStream.mock.calls as any[][])[0] ?? []
		expect(request).toMatchObject({
			receiver: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
			principalId: 'principal-a',
			tenantId: 'tenant-a',
			payload: { payload: 'question', parameter: {} },
			harness: {
				contract: { schemaVersion: 1, exportDigest: digest },
				dispatch: {
					sessionId: 'session-1',
					invocationId: 'child-run',
					rootRunId: 'root-run',
					parentRunId: 'parent-run',
					parentAgentId: 'parent-agent',
					depth: 1,
					remainingDepth: 3,
				},
			},
		})
		expect(request.harness.dispatch).not.toHaveProperty('identity')
		expect(request.harness.dispatch).not.toHaveProperty('trace')
		expect(request.harness.dispatch).not.toHaveProperty('signal')
		expect(request.otp).toBe(JSON.stringify(invocation.trace))
		expect(request.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736')
		expect(ttl).toBeGreaterThan(0)
	})

	it('rejects unknown and structurally copied contracts before EventBridge effects', async () => {
		const openStream = vi.fn()
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(openStream),
			sender: { serviceName: 'Parent', serviceVersion: '1', serviceTarget: 'command', instanceId: 'bridge-1' },
			bindings: [
				createHarnessTargetRouteBinding({
					target: support,
					address: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
					exportDigest: digest,
					routeBindingRevision: 'revision-1',
					visibility: 'root',
				}),
			],
		})

		expect(() => dispatcher.assertTarget({ ...support })).toThrow()
		await expect(
			dispatcher.open({ target: { ...support }, input: 'question', invocation: nestedInvocation() }),
		).rejects.toThrow()
		expect(openStream).not.toHaveBeenCalled()
	})

	it.each([
		{ parentAgentId: undefined, parentWorkflowId: undefined },
		{ parentAgentId: 'agent', parentWorkflowId: 'workflow' },
		{ parentAgentId: '', parentWorkflowId: 'workflow' },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, remainingDepth: 0 },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, depth: 1.5 },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, sessionId: '' },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, deadline: Number.POSITIVE_INFINITY },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, idempotencyKey: 'contains whitespace' },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, identity: { principalId: '' } },
		{ parentAgentId: 'agent', parentWorkflowId: undefined, identity: { principalId: 'principal', extra: true } },
		{
			parentAgentId: 'agent',
			parentWorkflowId: undefined,
			trace: { traceparent: '00-00000000000000000000000000000000-00f067aa0ba902b7-01' },
		},
		{
			parentAgentId: 'agent',
			parentWorkflowId: undefined,
			trace: { traceparent: '00-4BF92F3577B34DA6A3CE929D0E0E4736-00f067aa0ba902b7-01' },
		},
		{
			parentAgentId: 'agent',
			parentWorkflowId: undefined,
			trace: {
				traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
				tracestate: 'vendor=opaque\nsecret',
			},
		},
	])('rejects invalid parent ancestry before transport', async ancestry => {
		const openStream = vi.fn()
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(openStream),
			sender: { serviceName: 'Parent', serviceVersion: '1', serviceTarget: 'command', instanceId: 'bridge-1' },
			bindings: [
				createHarnessTargetRouteBinding({
					target: support,
					address: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
					exportDigest: digest,
					routeBindingRevision: 'revision-1',
					visibility: 'dependency',
				}),
			],
		})
		const invocation = { ...nestedInvocation(), ...ancestry } as unknown as HarnessNestedTargetDispatchInvocation

		await expect(dispatcher.open({ target: support, input: 'question', invocation })).rejects.toThrow()
		expect(openStream).not.toHaveBeenCalled()
	})

	it('propagates explicit cancellation without tying it to iterator return', async () => {
		const raw = completedHandle({ status: 'completed', runId: 'child-run', output: 'answer' })
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(vi.fn(async () => raw)),
			sender: { serviceName: 'Parent', serviceVersion: '1', serviceTarget: 'command', instanceId: 'bridge-1' },
			bindings: [
				createHarnessTargetRouteBinding({
					target: support,
					address: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
					exportDigest: digest,
					routeBindingRevision: 'revision-1',
					visibility: 'dependency',
				}),
			],
		})
		const stream = await dispatcher.open({ target: support, input: 'question', invocation: nestedInvocation() })

		const iterator = stream[Symbol.asyncIterator]()
		await iterator.next()
		await iterator.return?.()
		expect(raw.cancel).not.toHaveBeenCalled()
		await stream.cancel('parent_cancelled')
		expect(raw.cancel).toHaveBeenCalledWith('parent_cancelled')
	})

	it('rejects unequal terminal representations instead of accepting run/status equality', async () => {
		const candidate = { status: 'completed', runId: 'child-run', output: 'first' } as const
		const final = { status: 'completed', runId: 'child-run', output: 'second' } as const
		const raw = completedHandle(candidate, final)
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(vi.fn(async () => raw)),
			sender: { serviceName: 'Parent', serviceVersion: '1', serviceTarget: 'command', instanceId: 'bridge-1' },
			bindings: [
				createHarnessTargetRouteBinding({
					target: support,
					address: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
					exportDigest: digest,
					routeBindingRevision: 'revision-1',
					visibility: 'dependency',
				}),
			],
		})
		const stream = await dispatcher.open({ target: support, input: 'question', invocation: nestedInvocation() })

		await expect(stream.result).rejects.toThrow('terminal')
		await expect(collect(stream)).rejects.toThrow('terminal')
	})

	it.each([
		['parent run', 'wrong-parent-run', 'child-run'],
		['parent invocation', 'parent-run', 'wrong-parent-invocation'],
	] as const)(
		'rejects a direct terminal with mismatched %s correlation',
		async (_label, parentRunId, parentInvocationId) => {
			const outcome = { status: 'completed', runId: 'child-run', output: 'answer' } as const
			const frames = [
				frame<string>({ frameType: 'start', sequence: 0 }),
				frame<string>({
					frameType: 'chunk',
					sequence: 1,
					chunk: {
						type: 'run.started',
						eventId: 'event-1',
						sequence: 1,
						runId: 'child-run',
						parentRunId,
						parentInvocationId,
						at: '2026-09-08T00:00:00.000Z',
					},
				}),
				frame<string>({
					frameType: 'chunk',
					sequence: 2,
					chunk: {
						type: 'run.finished',
						eventId: 'event-2',
						sequence: 2,
						runId: 'child-run',
						parentRunId,
						parentInvocationId,
						at: '2026-09-08T00:00:01.000Z',
						outcome,
					},
				}),
				frame<string>({ frameType: 'complete', sequence: 3, final: outcome }),
			]
			const stream = await dispatcherWith(streamHandle(frames)).open({
				target: support,
				input: 'question',
				invocation: nestedInvocation(),
			})
			const observed: ExecutionEvent<string>[] = []
			const iteration = (async () => {
				for await (const event of stream) observed.push(event)
			})()

			await expect(stream.result).rejects.toThrow('parent correlation')
			await expect(iteration).rejects.toThrow('parent correlation')
			expect(observed).toEqual([])
		},
	)

	it('requires exact branded remote address and digest at binding construction', () => {
		const remote = remoteSupport()
		const openStream = vi.fn()
		const base = {
			target: remote,
			address: remote.address,
			exportDigest: remote.exportDigest,
			routeBindingRevision: 'revision-1',
			visibility: 'root' as const,
		}
		expect(() =>
			createHarnessTargetRouteBinding({ ...base, address: { ...remote.address, serviceName: 'Other' } }),
		).toThrow()
		expect(() => createHarnessTargetRouteBinding({ ...base, exportDigest: digest })).toThrow()
		expect(createHarnessTargetRouteBinding({ ...base, routeBindingRevision: '   ' }).receipt.bindingDigest).toMatch(
			/^sha256:[0-9a-f]{64}$/,
		)
		expect(() => createHarnessTargetRouteBinding({ ...base, routeBindingRevision: 'revision\u0000hidden' })).toThrow(
			'revision',
		)
		const reflected = {}
		for (const key of Reflect.ownKeys(support)) {
			const descriptor = Object.getOwnPropertyDescriptor(support, key)
			if (descriptor) Object.defineProperty(reflected, key, descriptor)
		}
		expect(() => createHarnessTargetRouteBinding({ ...base, target: Object.freeze(reflected) as never })).toThrow()
		expect(openStream).not.toHaveBeenCalled()
	})

	it('rejects a structurally forged finalized route binding at dispatcher construction', () => {
		const binding = createHarnessTargetRouteBinding({
			target: support,
			address: { serviceName: 'Child', serviceVersion: '2', serviceTarget: 'support' },
			exportDigest: digest,
			routeBindingRevision: 'revision-1',
			visibility: 'root',
		})
		expect(() =>
			createEventBridgeHarnessTargetDispatcher({
				eventBridge: bridge(vi.fn()),
				sender: {
					serviceName: 'Parent',
					serviceVersion: '1',
					serviceTarget: 'command',
					instanceId: 'bridge-1',
				},
				bindings: [{ ...binding, address: { ...binding.address, serviceName: 'Forged' } }],
			}),
		).toThrow('authentic finalized')
	})

	it('keeps result observation independent beyond 256 events and relays descendant terminals', async () => {
		const outcome = { status: 'completed', runId: 'child-run', output: 'answer' } as const
		const updates = Array.from({ length: 300 }, (_, index) =>
			frame<string>({
				frameType: 'chunk',
				sequence: index + 3,
				chunk: {
					type: 'output.text.delta',
					eventId: `u-${index}`,
					sequence: index + 3,
					runId: 'child-run',
					parentRunId: 'parent-run',
					parentInvocationId: 'child-run',
					id: 'text',
					delta: 'x',
					caller: { kind: 'agent', agentId: 'support' },
				},
			}),
		)
		const descendant = frame<string>({
			frameType: 'chunk',
			sequence: 2,
			chunk: {
				type: 'run.finished',
				eventId: 'nested',
				sequence: 2,
				runId: 'nested-run',
				parentRunId: 'child-run',
				parentInvocationId: 'nested-call',
				at: '2026-09-08T00:00:00.000Z',
				outcome: { status: 'completed', runId: 'nested-run', output: 'nested' },
			},
		})
		const raw = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame({
				frameType: 'chunk',
				sequence: 1,
				chunk: {
					type: 'run.started',
					eventId: 'start',
					sequence: 1,
					runId: 'child-run',
					parentRunId: 'parent-run',
					parentInvocationId: 'child-run',
					at: '2026-09-08T00:00:00.000Z',
				},
			}),
			descendant,
			...updates,
			frame({
				frameType: 'chunk',
				sequence: 303,
				chunk: {
					type: 'run.finished',
					eventId: 'terminal',
					sequence: 303,
					runId: 'child-run',
					parentRunId: 'parent-run',
					parentInvocationId: 'child-run',
					at: '2026-09-08T00:00:01.000Z',
					outcome,
				},
			}),
			frame({ frameType: 'complete', sequence: 304, final: outcome }),
		])
		const dispatcher = dispatcherWith(raw)
		const stream = await dispatcher.open({ target: support, input: 'question', invocation: nestedInvocation() })
		await expect(stream.result).resolves.toEqual(outcome)
		const events = await collect(stream)
		expect(events).toHaveLength(303)
		expect(events[1]).toMatchObject({ runId: 'nested-run', parentRunId: 'child-run' })
	})

	it('cancels an opened handle when abort wins during the transport handshake', async () => {
		const raw = completedHandle({ status: 'completed', runId: 'child-run', output: 'answer' })
		let release!: () => void
		const opened = new Promise<void>(resolve => {
			release = resolve
		})
		const controller = new AbortController()
		const openStream = vi.fn(async () => {
			await opened
			return raw
		})
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(openStream),
			sender: {
				serviceName: 'Parent',
				serviceVersion: '1',
				serviceTarget: 'command',
				instanceId: 'bridge-1',
			},
			bindings: [
				createHarnessTargetRouteBinding({
					target: support,
					address: {
						serviceName: 'Child',
						serviceVersion: '2',
						serviceTarget: 'support',
					},
					exportDigest: digest,
					routeBindingRevision: 'revision-1',
					visibility: 'dependency',
				}),
			],
		})
		const pending = dispatcher.open({
			target: support,
			input: 'question',
			invocation: { ...nestedInvocation(), signal: controller.signal },
		})
		controller.abort()
		release()
		await expect(pending).rejects.toMatchObject({ errorCode: StatusCode.RequestTimeout })
		expect(raw.cancel).toHaveBeenCalledWith('caller_cancelled')
	})

	it('propagates cancellation after transport setup and rejects pre-aborted calls before I/O', async () => {
		const raw = completedHandle({ status: 'completed', runId: 'child-run', output: 'answer' })
		const controller = new AbortController()
		const openStream = vi.fn(async () => raw)
		const dispatcher = dispatcherWith(raw, openStream)
		await dispatcher.open({
			target: support,
			input: 'question',
			invocation: { ...nestedInvocation(), signal: controller.signal },
		})
		controller.abort()
		await vi.waitFor(() => expect(raw.cancel).toHaveBeenCalledWith('caller_cancelled'))

		const alreadyAborted = new AbortController()
		alreadyAborted.abort()
		await expect(
			dispatcher.open({
				target: support,
				input: 'question',
				invocation: {
					...nestedInvocation(),
					signal: alreadyAborted.signal,
				},
			}),
		).rejects.toMatchObject({ errorCode: StatusCode.RequestTimeout })
		expect(openStream).toHaveBeenCalledTimes(1)
	})

	it.each([
		[
			'one-sided parent correlation',
			[
				frame({ frameType: 'start', sequence: 0 }),
				frame({
					frameType: 'chunk',
					sequence: 1,
					chunk: {
						type: 'run.started',
						eventId: 'start',
						sequence: 1,
						runId: 'child-run',
						parentInvocationId: 'child-run',
						at: '2026-09-08T00:00:00.000Z',
					},
				}),
			],
		],
		[
			'missing terminal',
			[
				frame({ frameType: 'start', sequence: 0 }),
				frame({
					frameType: 'chunk',
					sequence: 1,
					chunk: {
						type: 'run.started',
						eventId: 'start',
						sequence: 1,
						runId: 'child-run',
						parentRunId: 'parent-run',
						parentInvocationId: 'child-run',
						at: '2026-09-08T00:00:00.000Z',
					},
				}),
				frame({
					frameType: 'complete',
					sequence: 2,
					final: { status: 'completed', runId: 'child-run', output: 'answer' },
				}),
			],
		],
		[
			'duplicate terminal',
			[
				...completedFrames({ status: 'completed', runId: 'child-run', output: 'answer' }).slice(0, -1),
				frame({
					frameType: 'chunk',
					sequence: 3,
					chunk: {
						type: 'run.finished',
						eventId: 'finish-2',
						sequence: 3,
						runId: 'child-run',
						parentRunId: 'parent-run',
						parentInvocationId: 'child-run',
						at: '2026-09-08T00:00:02.000Z',
						outcome: { status: 'completed', runId: 'child-run', output: 'answer' },
					},
				}),
				frame({
					frameType: 'complete',
					sequence: 4,
					final: { status: 'completed', runId: 'child-run', output: 'answer' },
				}),
			],
		],
		[
			'post-terminal event',
			[
				...completedFrames({ status: 'completed', runId: 'child-run', output: 'answer' }).slice(0, -1),
				frame({
					frameType: 'chunk',
					sequence: 3,
					chunk: {
						type: 'output.text.delta',
						eventId: 'late',
						sequence: 3,
						runId: 'child-run',
						caller: { kind: 'agent', agentId: 'support' },
						id: 'text',
						delta: 'late',
					},
				}),
				frame({
					frameType: 'complete',
					sequence: 4,
					final: { status: 'completed', runId: 'child-run', output: 'answer' },
				}),
			],
		],
	] as const)('rejects %s direct-target protocol streams', async (_label, frames) => {
		const stream = await dispatcherWith(streamHandle(frames)).open({
			target: support,
			input: 'question',
			invocation: nestedInvocation(),
		})
		await expect(stream.result).rejects.toThrow()
		await expect(collect(stream)).rejects.toThrow()
	})

	it.each([
		frame<string>({
			frameType: 'error',
			sequence: 1,
			error: { status: StatusCode.ServiceUnavailable, message: 'bridge failed', isHandledError: true },
		}),
		frame<string>({ frameType: 'cancel', sequence: 1, reason: 'transport cancelled' }),
	])('maps transport error and cancel frames to rejected stream results', async terminalFrame => {
		const raw = streamHandle([frame({ frameType: 'start', sequence: 0 }), terminalFrame])
		const stream = await dispatcherWith(raw).open({
			target: support,
			input: 'question',
			invocation: nestedInvocation(),
		})
		await expect(stream.result).rejects.toBeInstanceOf(Error)
	})

	it('preserves handled stream errors and sanitizes unhandled receiver failures', async () => {
		const handled = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame<string>({
				frameType: 'error',
				sequence: 1,
				error: {
					status: StatusCode.Forbidden,
					message: 'safe denial',
					isHandledError: true,
					data: { policy: 'tenant' },
				},
			}),
		])
		const handledStream = await dispatcherWith(handled).open({
			target: support,
			input: 'question',
			invocation: nestedInvocation(),
		})
		await expect(handledStream.result).rejects.toMatchObject({
			errorCode: StatusCode.Forbidden,
			message: 'safe denial',
			data: { policy: 'tenant' },
		})

		const unhandled = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame<string>({
				frameType: 'error',
				sequence: 1,
				error: {
					status: StatusCode.InternalServerError,
					message: 'secret-provider-detail',
					isHandledError: false,
					data: { credential: 'secret-token' },
				},
			}),
		])
		const unhandledStream = await dispatcherWith(unhandled).open({
			target: support,
			input: 'question',
			invocation: nestedInvocation(),
		})
		const rejection = await unhandledStream.result.catch(error => error)
		expect(rejection).toMatchObject({
			errorCode: StatusCode.InternalServerError,
			message: 'Harness EventBridge stream failed.',
		})
		expect(JSON.stringify(rejection)).not.toContain('secret')

		const malformed = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame<string>({
				frameType: 'error',
				sequence: 1,
				error: {
					status: 999 as StatusCode,
					message: 'secret-malformed-detail',
					isHandledError: true,
					data: { credential: 'secret-token' },
				},
			}),
		])
		const malformedStream = await dispatcherWith(malformed).open({
			target: support,
			input: 'question',
			invocation: nestedInvocation(),
		})
		const malformedRejection = await malformedStream.result.catch(error => error)
		expect(malformedRejection).toMatchObject({
			errorCode: StatusCode.InternalServerError,
			message: 'Harness EventBridge stream failed.',
		})
		expect(JSON.stringify(malformedRejection)).not.toContain('secret')
	})

	it('sanitizes errors thrown by the transport iterator', async () => {
		const raw = {
			sessionId: 'transport-session' as CorrelationId,
			cancel: vi.fn(async () => undefined),
			[Symbol.asyncIterator]() {
				return {
					next: async () => {
						throw new Error('secret-provider-transport-detail')
					},
				}
			},
		} satisfies StreamHandle<ExecutionEvent<string>, RunOutcome<string>>
		const stream = await dispatcherWith(raw).open({
			target: support,
			input: 'question',
			invocation: nestedInvocation(),
		})

		const resultError = await stream.result.catch(error => error)
		expect(resultError).toMatchObject({
			errorCode: StatusCode.InternalServerError,
			message: 'Harness EventBridge stream failed.',
		})
		expect(JSON.stringify(resultError)).not.toContain('secret')
		await expect(collect(stream)).rejects.toBe(resultError)
	})

	it('rejects malformed and stale persisted receipts before transport', async () => {
		const raw = completedHandle({ status: 'completed', runId: 'child-run', output: 'answer' })
		const openStream = vi.fn(async () => raw)
		const binding = createHarnessTargetRouteBinding({
			target: support,
			address: {
				serviceName: 'Child',
				serviceVersion: '2',
				serviceTarget: 'support',
			},
			exportDigest: digest,
			routeBindingRevision: 'revision-1',
			visibility: 'dependency',
		})
		const dispatcher = createEventBridgeHarnessTargetDispatcher({
			eventBridge: bridge(openStream),
			sender: {
				serviceName: 'Parent',
				serviceVersion: '1',
				serviceTarget: 'command',
				instanceId: 'bridge-1',
			},
			bindings: [binding],
		})
		const base = {
			route: binding.receipt,
			wireInput: 'question',
			resume: {
				type: 'tool-approval',
				runId: 'child-run',
				interruptId: 'interrupt',
				revision: '1',
				eventId: 'resume',
				decisions: [],
			},
			invocation: nestedInvocation(),
		} as const
		await expect(
			dispatcher.openPersisted({ ...base, route: { ...binding.receipt, extra: true } as never }),
		).rejects.toMatchObject({ errorCode: StatusCode.Conflict })
		const changed = createHarnessTargetRouteBinding({
			target: support,
			address: binding.address,
			exportDigest: digest,
			routeBindingRevision: 'revision-2',
			visibility: 'dependency',
		})
		await expect(dispatcher.openPersisted({ ...base, route: changed.receipt })).rejects.toMatchObject({
			errorCode: StatusCode.Conflict,
		})
		expect(openStream).not.toHaveBeenCalled()
	})
})

function nestedInvocation(): HarnessNestedTargetDispatchInvocation {
	return Object.freeze({
		sessionId: 'session-1',
		invocationId: 'child-run',
		rootRunId: 'root-run',
		parentRunId: 'parent-run',
		parentAgentId: 'parent-agent',
		depth: 1,
		remainingDepth: 3,
		identity: { tenantId: 'tenant-a', principalId: 'principal-a' },
		trace: { traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' },
		deadline: Date.now() + 30_000,
		signal: new AbortController().signal,
	})
}

function bridge(openStream: ReturnType<typeof vi.fn>): Pick<EventBridge, 'instanceId' | 'openStream'> {
	return { instanceId: 'bridge-1', openStream } as unknown as Pick<EventBridge, 'instanceId' | 'openStream'>
}

function completedHandle<Output>(
	candidate: RunOutcome<Output>,
	final: RunOutcome<Output> = candidate,
): StreamHandle<ExecutionEvent<Output>, RunOutcome<Output>> & { cancel: ReturnType<typeof vi.fn> } {
	const frames: StreamFrame<ExecutionEvent<Output>, RunOutcome<Output>>[] = [
		frame({ frameType: 'start', sequence: 0 }),
		frame({
			frameType: 'chunk',
			sequence: 1,
			chunk: {
				type: 'run.started',
				eventId: 'event-1',
				sequence: 1,
				runId: candidate.runId,
				parentRunId: 'parent-run',
				parentInvocationId: 'child-run',
				at: '2026-09-08T00:00:00.000Z',
			},
		}),
		frame({
			frameType: 'chunk',
			sequence: 2,
			chunk: {
				type: 'run.finished',
				eventId: 'event-2',
				sequence: 2,
				runId: candidate.runId,
				parentRunId: 'parent-run',
				parentInvocationId: 'child-run',
				at: '2026-09-08T00:00:01.000Z',
				outcome: candidate,
			},
		}),
		frame({ frameType: 'complete', sequence: 3, final }),
	]
	const cancel = vi.fn(async () => undefined)
	return {
		sessionId: 'transport-session' as CorrelationId,
		cancel,
		async *[Symbol.asyncIterator]() {
			yield* frames
		},
	}
}

function streamHandle<Output>(frames: readonly StreamFrame<ExecutionEvent<Output>, RunOutcome<Output>>[]) {
	const cancel = vi.fn(async () => undefined)
	return {
		sessionId: 'transport-session' as CorrelationId,
		cancel,
		async *[Symbol.asyncIterator]() {
			yield* frames
		},
	}
}

function dispatcherWith(raw: StreamHandle<any, any>, openStream = vi.fn(async () => raw)) {
	return createEventBridgeHarnessTargetDispatcher({
		eventBridge: bridge(openStream),
		sender: {
			serviceName: 'Parent',
			serviceVersion: '1',
			serviceTarget: 'command',
			instanceId: 'bridge-1',
		},
		bindings: [
			createHarnessTargetRouteBinding({
				target: support,
				address: {
					serviceName: 'Child',
					serviceVersion: '2',
					serviceTarget: 'support',
				},
				exportDigest: digest,
				routeBindingRevision: 'revision-1',
				visibility: 'dependency',
			}),
		],
	})
}

function completedFrames<Output>(
	outcome: RunOutcome<Output>,
): StreamFrame<ExecutionEvent<Output>, RunOutcome<Output>>[] {
	return [
		frame({ frameType: 'start', sequence: 0 }),
		frame({
			frameType: 'chunk',
			sequence: 1,
			chunk: {
				type: 'run.started',
				eventId: 'event-1',
				sequence: 1,
				runId: outcome.runId,
				parentRunId: 'parent-run',
				parentInvocationId: 'child-run',
				at: '2026-09-08T00:00:00.000Z',
			},
		}),
		frame({
			frameType: 'chunk',
			sequence: 2,
			chunk: {
				type: 'run.finished',
				eventId: 'event-2',
				sequence: 2,
				runId: outcome.runId,
				parentRunId: 'parent-run',
				parentInvocationId: 'child-run',
				at: '2026-09-08T00:00:01.000Z',
				outcome,
			},
		}),
		frame({ frameType: 'complete', sequence: 3, final: outcome }),
	]
}

function remoteSupport() {
	const schema = generatedSchema<string, string>({ type: 'string' })
	const source = {
		schemaVersion: 1 as const,
		address: { serviceName: 'Remote', serviceVersion: '1', serviceTarget: 'support' } as const,
		target: {
			targetName: 'support' as const,
			kind: 'agent' as const,
			inputSchema: schema,
			validatedInputSchema: { type: 'string' },
			outputSchema: schema,
			updateSchema: { type: 'string' },
			interruptSchema: false as const,
			invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
			stream: {
				protocol: 'harness-execution-events-v1' as const,
				eventTypes: harnessExecutionEventTypesV1,
				outputUpdates: ['text-delta'] as const,
			},
		},
	}
	const digest = computeHarnessTargetExportDigest(source)
	return createRemoteHarnessTargetContract({ ...source, target: { ...source.target, exportDigest: digest } })
}

function generatedSchema<Input extends JsonValue, Output extends JsonValue>(
	json: Readonly<Record<string, unknown>>,
): ModelSchema<Input, Output> {
	const schema = { ...json }
	Object.defineProperty(schema, '~standard', {
		enumerable: false,
		value: Object.freeze({
			version: 1,
			vendor: 'purista-generated',
			validate: (value: unknown) => ({ value }),
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: Object.freeze({ input: () => json, output: () => json }),
		}),
	})
	return Object.freeze(schema) as unknown as ModelSchema<Input, Output>
}

function frame<Output>(
	payload: StreamFrame<ExecutionEvent<Output>, RunOutcome<Output>>['payload'],
): StreamFrame<ExecutionEvent<Output>, RunOutcome<Output>> {
	return { payload } as StreamFrame<ExecutionEvent<Output>, RunOutcome<Output>>
}

async function collect<Output, Interrupt>(stream: HarnessTargetDispatchStream<Output, Interrupt>) {
	const events = []
	for await (const event of stream) events.push(event)
	return events
}

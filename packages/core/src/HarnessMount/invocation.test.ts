import type { ExecutionEvent, RunOutcome } from '@purista/harness'
import { describe, expect, it, vi } from 'vitest'

import type { CorrelationId } from '../core/types/CorrelationId.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import { createHarnessInvocationProxy } from './invocation.js'

describe('address-first Harness execution streams', () => {
	it('yields portable events while hiding EventBridge transport frames', async () => {
		const outcome: RunOutcome<string> = { status: 'completed', runId: 'run-1', output: 'done' }
		const raw = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame({
				frameType: 'chunk',
				sequence: 1,
				chunk: { type: 'run.started', runId: 'run-1', at: '2026-09-02T10:00:00.000Z' },
			}),
			frame({
				frameType: 'chunk',
				sequence: 2,
				chunk: {
					type: 'run.finished',
					runId: 'run-1',
					at: '2026-09-02T10:00:01.000Z',
					outcome,
				},
			}),
			frame({ frameType: 'complete', sequence: 3, final: outcome }),
		])
		const proxy = createHarnessInvocationProxy<{
			Knowledge: { '1': { answer: { stream(input: string): Promise<AsyncIterable<ExecutionEvent<string>>> } } }
		}>(noopInvoke, openRaw(raw))

		const events = []
		for await (const event of await proxy.Knowledge['1'].answer.stream('question')) events.push(event)

		expect(events).toEqual([
			expect.objectContaining({ type: 'run.started', runId: 'run-1' }),
			expect.objectContaining({ type: 'run.finished', outcome }),
		])
		expect(raw.cancel).not.toHaveBeenCalled()
	})

	it('turns transport failures into handled errors', async () => {
		const raw = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame({
				frameType: 'error',
				sequence: 1,
				error: {
					status: StatusCode.TooManyRequests,
					message: 'Provider admission rejected the run.',
					isHandledError: true,
				},
			}),
		])
		const proxy = createHarnessInvocationProxy<any>(noopInvoke, openRaw(raw))
		const events = await proxy.Knowledge['1'].answer.stream('question')

		await expect(collect(events)).rejects.toMatchObject({
			errorCode: StatusCode.TooManyRequests,
			message: 'Provider admission rejected the run.',
		})
	})

	it('cancels the remote stream when the consumer stops early', async () => {
		const raw = streamHandle([
			frame({ frameType: 'start', sequence: 0 }),
			frame({
				frameType: 'chunk',
				sequence: 1,
				chunk: { type: 'run.started', runId: 'run-1', at: '2026-09-02T10:00:00.000Z' },
			}),
			frame({
				frameType: 'chunk',
				sequence: 2,
				chunk: { type: 'output.text.delta', runId: 'run-1', id: 'text', delta: 'more' },
			}),
		])
		const proxy = createHarnessInvocationProxy<any>(noopInvoke, openRaw(raw))
		const events = await proxy.Knowledge['1'].answer.stream('question')

		for await (const _event of events) break

		expect(raw.cancel).toHaveBeenCalledWith('consumer stopped reading')
	})
})

function streamHandle(
	frames: readonly StreamFrame<ExecutionEvent<string>, RunOutcome<string>>[],
): StreamHandle<ExecutionEvent<string>, RunOutcome<string>> & { cancel: ReturnType<typeof vi.fn> } {
	const cancel = vi.fn(async () => undefined)
	return {
		sessionId: 'stream-session' as CorrelationId,
		cancel,
		async *[Symbol.asyncIterator]() {
			yield* frames
		},
	}
}

function frame(
	payload: StreamFrame<ExecutionEvent<string>, RunOutcome<string>>['payload'],
): StreamFrame<ExecutionEvent<string>, RunOutcome<string>> {
	return { payload } as StreamFrame<ExecutionEvent<string>, RunOutcome<string>>
}

async function collect(events: AsyncIterable<ExecutionEvent<string>>) {
	const result = []
	for await (const event of events) result.push(event)
	return result
}

async function noopInvoke<T>(): Promise<T> {
	return undefined as T
}

function openRaw(raw: StreamHandle<ExecutionEvent<string>, RunOutcome<string>>) {
	return async <Chunk, Final>() => raw as unknown as StreamHandle<Chunk, Final>
}

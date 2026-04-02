import { describe, expect, it, vi } from 'vitest'

import { EBMessageType } from '../types/EBMessageType.enum.js'
import type { StreamFrame } from '../types/stream/StreamFrame.js'
import { PendingStreamRegistry } from './PendingStreamRegistry.impl.js'

const createFrame = (
	correlationId: string,
	frameType: StreamFrame['payload']['frameType'],
	sequence: number,
): StreamFrame => ({
	messageType: EBMessageType.Stream,
	id: `frame-${sequence}`,
	timestamp: Date.now(),
	correlationId,
	traceId: 'trace-id',
	contentType: 'application/json',
	contentEncoding: 'utf-8',
	sender: {
		serviceName: 'sender',
		serviceVersion: '1',
		serviceTarget: 'stream',
		instanceId: 'sender-instance',
	},
	receiver: {
		serviceName: 'receiver',
		serviceVersion: '1',
		serviceTarget: 'stream',
		instanceId: 'receiver-instance',
	},
	payload: {
		frameType,
		sequence,
	},
})

describe('PendingStreamRegistry', () => {
	it('resolves frames in iterator order and completes on terminal frame', async () => {
		const registry = new PendingStreamRegistry()
		const session = registry.register('stream-1', 2000, 'trace-id')

		session.push(createFrame('stream-1', 'start', 0))
		session.push(createFrame('stream-1', 'chunk', 1))
		session.push(createFrame('stream-1', 'complete', 2))

		const iterator = session.handle[Symbol.asyncIterator]()
		const start = await iterator.next()
		const chunk = await iterator.next()
		const complete = await iterator.next()
		const done = await iterator.next()

		expect(start.done).toBe(false)
		expect(start.value?.payload.frameType).toBe('start')
		expect(chunk.value?.payload.frameType).toBe('chunk')
		expect(complete.value?.payload.frameType).toBe('complete')
		expect(done.done).toBe(true)
		expect(registry.size).toBe(0)
	})

	it('reports late frames after stream timeout', async () => {
		const onLateFrame = vi.fn()
		const registry = new PendingStreamRegistry({
			onLateFrame,
		})
		const session = registry.register('stream-1', 1, 'trace-id')
		const iterator = session.handle[Symbol.asyncIterator]()

		await expect(iterator.next()).resolves.toEqual({ done: true, value: undefined })

		const result = session.push(createFrame('stream-1', 'chunk', 1))
		expect(result).toBe('late')
		expect(onLateFrame).toHaveBeenCalledWith('stream-1')
	})
})

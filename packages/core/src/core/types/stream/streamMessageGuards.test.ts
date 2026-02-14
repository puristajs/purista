import { EBMessageType } from '../EBMessageType.enum.js'
import type { StreamControl, StreamFrame, StreamOpenRequest } from './index.js'
import { isStreamControl } from './isStreamControl.impl.js'
import { isStreamFrame } from './isStreamFrame.impl.js'
import { isStreamMessage } from './isStreamMessage.impl.js'
import { isStreamOpenRequest } from './isStreamOpenRequest.impl.js'

const base = {
	id: 'id-1',
	timestamp: Date.now(),
	traceId: 'trace-id',
	principalId: 'principal-id',
	tenantId: 'tenant-id',
	contentType: 'application/json',
	contentEncoding: 'utf-8',
	sender: {
		serviceName: 'source',
		serviceVersion: '1',
		serviceTarget: 'test',
		instanceId: 'instance-id',
	},
}

describe('stream message guards', () => {
	it('detects open stream requests', () => {
		const openRequest: StreamOpenRequest = {
			...base,
			correlationId: 'corr-1',
			messageType: EBMessageType.Stream,
			receiver: {
				serviceName: 'target',
				serviceVersion: '1',
				serviceTarget: 'stream',
				instanceId: 'instance-id',
			},
			payload: {
				frameType: 'open',
				payload: { search: 'foo' },
				parameter: { page: 1 },
			},
		}

		expect(isStreamMessage(openRequest)).toBe(true)
		expect(isStreamOpenRequest(openRequest)).toBe(true)
		expect(isStreamFrame(openRequest)).toBe(false)
		expect(isStreamControl(openRequest)).toBe(false)
	})

	it('detects chunk frames', () => {
		const frame: StreamFrame = {
			...base,
			correlationId: 'corr-1',
			messageType: EBMessageType.Stream,
			receiver: {
				serviceName: 'target',
				serviceVersion: '1',
				serviceTarget: 'stream',
				instanceId: 'instance-id',
			},
			payload: {
				frameType: 'chunk',
				sequence: 2,
				chunk: { id: 'u1' },
			},
		}

		expect(isStreamMessage(frame)).toBe(true)
		expect(isStreamOpenRequest(frame)).toBe(false)
		expect(isStreamFrame(frame)).toBe(true)
		expect(isStreamControl(frame)).toBe(false)
	})

	it('detects cancel control frames', () => {
		const control: StreamControl = {
			...base,
			correlationId: 'corr-1',
			messageType: EBMessageType.Stream,
			receiver: {
				serviceName: 'target',
				serviceVersion: '1',
				serviceTarget: 'stream',
				instanceId: 'inst-1',
			},
			payload: {
				frameType: 'cancel',
				reason: 'client disconnected',
			},
		}

		expect(isStreamMessage(control)).toBe(true)
		expect(isStreamOpenRequest(control)).toBe(false)
		expect(isStreamFrame(control)).toBe(false)
		expect(isStreamControl(control)).toBe(true)
	})
})

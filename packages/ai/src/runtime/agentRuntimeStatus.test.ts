import { describe, expect, it } from 'vitest'

import { getAgentRuntimeStatuses } from './agentRuntimeStatus.js'

describe('getAgentRuntimeStatuses', () => {
	it('returns status from array and map inputs', () => {
		const a = {
			getStatus: () => ({
				agentName: 'a',
				agentVersion: '1',
				poolId: 'p1',
				maxConcurrencyPerInstance: 1,
				activeWorkers: 0,
				waitingWorkers: 0,
			}),
		}
		const b = {
			getStatus: () => ({
				agentName: 'b',
				agentVersion: '1',
				poolId: 'p2',
				maxConcurrencyPerInstance: 2,
				activeWorkers: 1,
				waitingWorkers: 0,
			}),
		}

		expect(getAgentRuntimeStatuses([a, b] as any)).toEqual([a.getStatus(), b.getStatus()])
		expect(getAgentRuntimeStatuses({ a, b } as any)).toEqual([a.getStatus(), b.getStatus()])
	})
})

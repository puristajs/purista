import { describe, expect, it } from 'vitest'

import type { AgentRuntimeInstance } from '../types/AgentDefinition.js'
import { getAgentRuntimeStatuses } from './agentRuntimeStatus.js'

describe('getAgentRuntimeStatuses', () => {
	it('returns status from array and map inputs', () => {
		const a = {
			getStatus: () => ({
				agentName: 'a',
				serviceVersion: '1',
				poolId: 'p1',
				maxConcurrencyPerInstance: 1,
				activeWorkers: 0,
				waitingWorkers: 0,
			}),
		}
		const b = {
			getStatus: () => ({
				agentName: 'b',
				serviceVersion: '1',
				poolId: 'p2',
				maxConcurrencyPerInstance: 2,
				activeWorkers: 1,
				waitingWorkers: 0,
			}),
		}

		const agentA = a as unknown as AgentRuntimeInstance
		const agentB = b as unknown as AgentRuntimeInstance
		expect(getAgentRuntimeStatuses([agentA, agentB])).toEqual([a.getStatus(), b.getStatus()])
		expect(getAgentRuntimeStatuses({ a: agentA, b: agentB })).toEqual([a.getStatus(), b.getStatus()])
	})
})

import { describe, expect, it } from 'vitest'
import * as ai from './index.js'

describe('@purista/ai public exports', () => {
	it('keeps agent builder + invocation helpers public', () => {
		expect(typeof ai.AgentQueueBuilder).toBe('function')
		expect(typeof ai.ServiceBuilder).toBe('function')
		expect(typeof ai.invokeAgent).toBe('function')
	})

	it('does not expose internal runtime/platform entrypoints', () => {
		expect('AgentExecutor' in ai).toBe(false)
		expect('enqueueRunCommandBuilder' in ai).toBe(false)
		expect('AgentBuilder' in ai).toBe(false)
	})
})

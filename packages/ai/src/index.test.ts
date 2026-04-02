import { describe, expect, it } from 'vitest'
import * as ai from './index.js'

describe('@purista/ai public exports', () => {
	it('keeps builder + invocation helpers public', () => {
		expect(typeof ai.AgentBuilder).toBe('function')
		expect(typeof ai.invokeAgent).toBe('function')
	})

	it('does not expose internal runtime/platform entrypoints', () => {
		expect('AgentExecutor' in ai).toBe(false)
		expect('enqueueRunCommandBuilder' in ai).toBe(false)
	})
})

import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { createAiExecution } from './createAiExecution.js'

describe('createAiExecution', () => {
	it('uses the low-effort local durable bundle by default and closes idempotently', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-agent-example-'))
		try {
			const runtime = createAiExecution({ PURISTA_LOCAL_RUNTIME_ROOT: root })
			expect(runtime.mode).toBe('local')
			expect(runtime.ai.storage.capabilities).toContain('storage.persistent')
			expect(runtime.ai.sandbox.capabilities).toContain('sandbox.text_search')
			expect(runtime.ai.workspace?.capabilities).toContain('workspace.durable')
			await Promise.all([runtime.close(), runtime.close()])
		} finally {
			await rm(root, { recursive: true, force: true })
		}
	})

	it('fails before client construction when production configuration is incomplete', () => {
		expect(() => createAiExecution({ PURISTA_AI_EXECUTION: 'kubernetes' })).toThrow('DATABASE_URL')
		expect(() => createAiExecution({ PURISTA_AI_EXECUTION: 'unsupported' })).toThrow(
			'PURISTA_AI_EXECUTION must be local, postgres-local, or kubernetes',
		)
	})
})

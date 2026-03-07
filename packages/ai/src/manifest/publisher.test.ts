import { describe, expect, it, vi } from 'vitest'

import type { AgentDefinition } from '../types/AgentDefinition.js'
import { publishAgentManifest } from './publisher.js'

describe('publishAgentManifest', () => {
	it('writes the manifest into managed config using a deterministic key', async () => {
		const setConfig = vi.fn().mockResolvedValue(undefined)
		const definition = {
			manifest: {
				agentName: 'supportAgent',
				agentVersion: '1',
				eventBridge: 'default',
				allowedTools: [],
			},
		} as unknown as AgentDefinition

		const result = await publishAgentManifest(setConfig, definition)

		expect(setConfig).toHaveBeenCalledWith('ai.manifest.supportAgent.1', definition.manifest)
		expect(result.configKey).toBe('ai.manifest.supportAgent.1')
		expect(result.manifest).toBe(definition.manifest)
	})
})

import { describe, expect, it } from 'vitest'

import { AgentBuilder } from './AgentBuilder.js'

describe('AgentBuilder', () => {
	it('builds a manifest with defaults', () => {
		const definition = AgentBuilder.create({ agentName: 'testAgent', agentVersion: '1' })
			.setDescription('demo agent')
			.setModelResource({ resourceName: 'model' })
			.allowTool({ serviceName: 'demo', serviceVersion: 'v1', commandName: 'doSomething' })
			.setHandler(async () => 'ok')
			.build()

		expect(definition.manifest.agentName).toBe('testAgent')
		expect(definition.manifest.modelResource?.resourceName).toBe('model')
		expect(definition.manifest.allowedTools).toHaveLength(1)
	})
})

import { describe, expect, it } from 'vitest'
import {
	getHarnessTransportCorrelationId,
	type HarnessTransportCorrelationInput,
} from './getHarnessTransportCorrelationId.impl.js'

describe('getHarnessTransportCorrelationId', () => {
	it('uses the immutable Harness root invocation id', () => {
		const input = {
			harness: {
				contract: { schemaVersion: 1, exportDigest: `sha256:${'a'.repeat(64)}` },
				root: { invocationId: 'harness-root-invocation', sessionId: 'harness-session' },
			},
		} satisfies HarnessTransportCorrelationInput

		expect(getHarnessTransportCorrelationId(input)).toBe('harness-root-invocation')
	})

	it('creates a transport correlation when no Harness root exists', () => {
		const correlationId = getHarnessTransportCorrelationId({})

		expect(correlationId).toEqual(expect.any(String))
		expect(correlationId).not.toHaveLength(0)
	})
})

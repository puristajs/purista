import { describe, expect, it } from 'vitest'
import { getUnsupportedWorkerAiSdkReason } from './executeWorkload.js'

describe('getUnsupportedWorkerAiSdkReason', () => {
	it('returns null for missing metadata', () => {
		expect(getUnsupportedWorkerAiSdkReason(undefined)).toBeNull()
		expect(getUnsupportedWorkerAiSdkReason(null)).toBeNull()
	})

	it('returns null when aiSdk metadata has no tools', () => {
		expect(
			getUnsupportedWorkerAiSdkReason({
				aiSdk: {
					maxSteps: 20,
					toolChoice: 'required',
				},
			}),
		).toBeNull()
	})

	it('returns reason when top-level aiSdk.tools is present', () => {
		const reason = getUnsupportedWorkerAiSdkReason({
			aiSdk: {
				tools: {
					writeSpecFile: { description: 'writes files' },
				},
			},
		})
		expect(reason).toContain('does not support function-based aiSdk.tools')
	})

	it('returns reason when nested aiSdk.generate.tools is present', () => {
		const reason = getUnsupportedWorkerAiSdkReason({
			aiSdk: {
				generate: {
					tools: {
						writeSpecFile: { description: 'writes files' },
					},
				},
			},
		})
		expect(reason).toContain('does not support function-based aiSdk.tools')
	})
})

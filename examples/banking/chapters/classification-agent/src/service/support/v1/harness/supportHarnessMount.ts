import { supportHarness } from '../../../../harness/support/supportHarness.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['classify_support_message'], workflows: [] },
	targets: { agents: {}, workflows: {} },
} as const

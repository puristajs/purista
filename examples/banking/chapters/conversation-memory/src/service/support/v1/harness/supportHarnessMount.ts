import { supportHarness } from '../../../../harness/support/supportHarness.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['answer_support_question'], workflows: [] },
	targets: { agents: {}, workflows: {} },
} as const

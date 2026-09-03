import { classificationHarness } from '../../../../classificationAgent.js'

export { classificationHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['classify_support_message'], workflows: [] },
	targets: { agents: {}, workflows: {} },
} as const

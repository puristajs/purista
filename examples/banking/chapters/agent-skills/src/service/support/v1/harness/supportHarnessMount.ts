import { supportHarness } from '../../../../harness/support/supportHarness.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['answer_procedure_question'], workflows: [] },
	targets: { agents: {}, workflows: {} },
} as const

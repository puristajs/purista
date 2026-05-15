import { createScriptedHarnessModel } from '@purista/core'

const highPriorityTerms = ['cannot sign in', 'payroll', 'production', 'outage', 'security', 'blocked']

export const createSupportTriageModel = () => {
	const model = createScriptedHarnessModel()

	model.object = async request => {
		model.requests.push(request)
		const content = JSON.stringify(request.messages).toLowerCase()
		const priority = highPriorityTerms.some(term => content.includes(term)) ? 'high' : 'normal'

		return {
			object: {
				priority,
				reason:
					priority === 'high'
						? 'The ticket contains business-critical or access-blocking language.'
						: 'The ticket can be handled through the normal support queue.',
			},
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
			finishReason: 'stop',
		} as never
	}

	return model
}

import { FakeModelProvider } from '@purista/harness/testing'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

export function passingEvaluationProvider() {
	const provider = new FakeModelProvider({ strict: true })
	for (const object of [
		{ category: 'card', urgency: 'urgent', reason: 'The card is stolen and active misuse is reported.' },
		{ category: 'transfer', urgency: 'normal', reason: 'The question concerns a scheduled transfer date.' },
		{ category: 'account_access', urgency: 'urgent', reason: 'Essential access is blocked before a deadline.' },
	]) {
		provider.enqueueObject({ object, usage, finishReason: 'stop' })
	}
	return provider
}

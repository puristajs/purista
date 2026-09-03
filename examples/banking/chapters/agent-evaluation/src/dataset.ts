import type { EvaluationDataset } from '@purista/harness'
import type { ClassificationInput, ClassificationOutput } from './harness/support/supportClassificationSchemas.js'

export type ClassificationAssessment = Pick<ClassificationOutput, 'category' | 'urgency'>

export const supportClassificationDataset = {
	id: 'support-classification-cases',
	version: '1.0.0',
	cases: [
		{
			id: 'missing-card',
			input: { messageId: 'message-1', text: 'My card was stolen and someone is using it now.' },
			assessment: { category: 'card', urgency: 'urgent' },
			segments: { category: 'card', urgency: 'urgent' },
		},
		{
			id: 'transfer-date',
			input: { messageId: 'message-2', text: 'When will my scheduled transfer arrive?' },
			assessment: { category: 'transfer', urgency: 'normal' },
			segments: { category: 'transfer', urgency: 'normal' },
		},
		{
			id: 'locked-out',
			input: { messageId: 'message-3', text: 'I am locked out and must pay rent today.' },
			assessment: { category: 'account_access', urgency: 'urgent' },
			segments: { category: 'account_access', urgency: 'urgent' },
		},
	],
} as const satisfies EvaluationDataset<ClassificationInput, ClassificationAssessment>

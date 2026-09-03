import { type EventBridge, getNewInstanceId } from '@purista/core'
import type { z } from 'zod'
import type {
	answerTransactionQuestionInputSchema,
	answerTransactionQuestionOutputSchema,
} from './harness/support/agent/answerTransactionQuestion/answerTransactionQuestionAgent.js'

type Question = z.infer<typeof answerTransactionQuestionInputSchema>
type Answer = z.infer<typeof answerTransactionQuestionOutputSchema>

/** A small outer adapter used by the terminal demos to address the Support command. */
export function invokeSupportQuestion(
	eventBridge: EventBridge,
	identity: Readonly<{ tenantId: string; principalId: string }>,
	payload: Question,
) {
	return eventBridge.invoke<Answer>({
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		tenantId: identity.tenantId,
		principalId: identity.principalId,
		sender: {
			serviceName: 'TutorialClient',
			serviceVersion: '1',
			serviceTarget: 'askSupport',
			instanceId: getNewInstanceId(),
		},
		receiver: {
			serviceName: 'Support',
			serviceVersion: '1',
			serviceTarget: 'answerTransactionQuestion',
		},
		payload: { payload, parameter: {} },
	})
}

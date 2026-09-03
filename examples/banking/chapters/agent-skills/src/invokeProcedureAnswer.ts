import { type EventBridge, getNewInstanceId } from '@purista/core'
import type { z } from 'zod'
import type {
	answerProcedureQuestionInputSchema,
	answerProcedureQuestionOutputSchema,
} from './harness/support/agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'

type ProcedureQuestion = z.infer<typeof answerProcedureQuestionInputSchema>
type ProcedureAnswer = z.infer<typeof answerProcedureQuestionOutputSchema>

export function invokeProcedureAnswer(
	eventBridge: EventBridge,
	identity: Readonly<{ tenantId: string; principalId: string }>,
	payload: ProcedureQuestion,
) {
	return eventBridge.invoke<ProcedureAnswer>({
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		tenantId: identity.tenantId,
		principalId: identity.principalId,
		sender: {
			serviceName: 'TutorialClient',
			serviceVersion: '1',
			serviceTarget: 'askProcedureQuestion',
			instanceId: getNewInstanceId(),
		},
		receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'answerProcedureQuestion' },
		payload: { payload, parameter: {} },
	})
}

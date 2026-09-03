import { type EventBridge, getNewInstanceId } from '@purista/core'
import type { z } from 'zod'
import type {
	classifySupportMessageInputSchema,
	classifySupportMessageOutputSchema,
} from './harness/support/agent/classifySupportMessage/schema.js'

type ClassificationInput = z.infer<typeof classifySupportMessageInputSchema>
type Classification = z.infer<typeof classifySupportMessageOutputSchema>

export function invokeClassification(
	eventBridge: EventBridge,
	identity: Readonly<{ tenantId: string; principalId: string }>,
	payload: ClassificationInput,
) {
	return eventBridge.invoke<Classification>({
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		tenantId: identity.tenantId,
		principalId: identity.principalId,
		sender: {
			serviceName: 'TutorialClient',
			serviceVersion: '1',
			serviceTarget: 'classify',
			instanceId: getNewInstanceId(),
		},
		receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'classifySupportMessage' },
		payload: { payload, parameter: {} },
	})
}

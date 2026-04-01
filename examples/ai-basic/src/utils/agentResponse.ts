import { agentProtocolEnvelopeSchema, extractFinalAssistantText } from '@purista/ai'

export const getFinalMessageFromEnvelopes = (input: unknown): string => {
	const envelopes = agentProtocolEnvelopeSchema.array().parse(input)
	return extractFinalAssistantText(envelopes)
}

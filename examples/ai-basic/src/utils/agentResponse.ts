import { agentProtocolEnvelopeSchema } from '@purista/ai'

export const getFinalMessageFromEnvelopes = (input: unknown): string => {
	const envelopes = agentProtocolEnvelopeSchema.array().parse(input)
	const finalMessage = envelopes
		.map(envelope => envelope.frame)
		.filter(
			(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
				frame.kind === 'message' && frame.final === true,
		)
		.map(frame => frame.content)
		.at(-1)

	return finalMessage ?? ''
}

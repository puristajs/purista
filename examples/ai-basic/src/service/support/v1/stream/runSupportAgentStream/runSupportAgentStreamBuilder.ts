import { agentProtocolEnvelopeSchema } from '@purista/ai'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import {
	runSupportAgentStreamChunkSchema,
	runSupportAgentStreamFinalSchema,
	runSupportAgentStreamInputSchema,
	runSupportAgentStreamInvokeParameterSchema,
	runSupportAgentStreamInvokePayloadSchema,
	runSupportAgentStreamParameterSchema,
} from './schema.js'

export const runSupportAgentStreamBuilder = supportV1ServiceBuilder
	.getStreamBuilder('runSupportAgentStream', 'Streams support agent frames via SSE')
	.canInvokeAgent('supportAgent', '1', {
		payloadSchema: runSupportAgentStreamInvokePayloadSchema,
		parameterSchema: runSupportAgentStreamInvokeParameterSchema,
	})
	.addPayloadSchema(runSupportAgentStreamInputSchema)
	.addParameterSchema(runSupportAgentStreamParameterSchema)
	.addChunkSchema(runSupportAgentStreamChunkSchema)
	.addFinalSchema(runSupportAgentStreamFinalSchema)
	.exposeAsHttpStreamEndpoint('POST', 'support/ask/stream')
	.setStreamFunction(async function (context, payload, parameter, writer) {
		const supportAgentInvoke = context.invokeAgent.supportAgent?.['1']
		if (!supportAgentInvoke?.call) {
			throw new Error('supportAgent invoke binding is not configured')
		}

		const invocation = supportAgentInvoke.call(
			{
				sessionId: payload.sessionId,
				message: payload.prompt,
				prompt: payload.prompt,
				context: payload.context,
				history: [],
				attachments: [],
			},
			{
				channel: 'stream',
				locale: parameter.locale,
			},
		)

		const streamedEnvelopes: unknown[] = []
		for await (const frame of invocation) {
			const envelopes = Array.isArray(frame)
				? agentProtocolEnvelopeSchema.array().parse(frame)
				: [agentProtocolEnvelopeSchema.parse(frame)]
			for (const envelope of envelopes) {
				streamedEnvelopes.push(envelope)
				await writer.write(envelope)
			}
		}

		const final = await invocation.final()
		const envelopes = agentProtocolEnvelopeSchema.array().parse(final)
		if (streamedEnvelopes.length === 0) {
			for (const envelope of envelopes) {
				await writer.write(envelope)
			}
		}

		await writer.close({
			message:
				envelopes
					.map(envelope => envelope.frame)
					.filter(
						(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message'; final?: boolean }> =>
							frame.kind === 'message' && frame.final === true,
					)
					.map(frame => frame.content)
					.at(-1) ?? '',
			envelopes,
		})
	})

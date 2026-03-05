import { AgentBuilder, type AgentHandlerContext, agentProtocolEnvelopeSchema } from '@purista/ai'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod/v4'
import { type SupportAgentInput, supportAgentInputSchema } from './schema.js'

type SupportAgentContext = AgentHandlerContext<SupportAgentInput, unknown>

const getFinalMessage = (value: unknown): string => {
	const envelopes = agentProtocolEnvelopeSchema.array().parse(value)
	return (
		envelopes
			.map(envelope => envelope.frame)
			.filter(
				(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
					frame.kind === 'message' && frame.final === true,
			)
			.map(frame => frame.content)
			.at(-1)
			?.trim() ?? ''
	)
}

const hasErrorFrame = (value: unknown): boolean => {
	try {
		const envelopes = agentProtocolEnvelopeSchema.array().parse(value)
		return envelopes.some(envelope => envelope.frame.kind === 'error')
	} catch {
		return false
	}
}

const splitTextIntoProgressiveChunks = (text: string, size = 120): string[] => {
	const chunks: string[] = []
	let current = ''
	for (const token of text.split(/\s+/)) {
		const candidate = current ? `${current} ${token}` : token
		if (candidate.length > size && current) {
			chunks.push(current)
			current = token
		} else {
			current = candidate
		}
	}
	if (current) {
		chunks.push(current)
	}
	return chunks
}

const extractFirstUrl = (input: string): string | undefined => {
	const match = input.match(/https?:\/\/[^\s)]+/i)
	return match?.[0]
}

const extractCalculationExpression = (input: string): string | undefined => {
	const calcPrompt = input.match(/(?:calculate|calc)\s*[:-]?\s*([0-9+\-*/().\s]+)/i)
	if (calcPrompt?.[1]) {
		return calcPrompt[1].trim()
	}
	const genericMath = input.match(/([0-9][0-9+\-*/().\s]{2,})/)
	return genericMath?.[1]?.trim()
}

const jsonAnswerSchema = z.object({
	answer: z.string().min(1),
	nextActions: z.array(z.string()).default([]),
	sources: z.array(z.string()).default([]),
})

export const supportAgent = new AgentBuilder({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Support agent using tool calls and optional delegation to triageAgent',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream', 'json'] })
	.persistConversation('user', { maxFrames: 20 })
	.allowTool({
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'lookupFaq',
	})
	.allowTool({
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'calculate',
	})
	.allowTool({
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'fetchWebsite',
	})
	.allowTool({
		serviceName: 'triageAgent',
		serviceVersion: '1',
		commandName: 'run',
	})
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
	.setHandler<SupportAgentInput>(async function (context: SupportAgentContext, payload) {
		const userPrompt = payload.prompt ?? payload.message ?? ''
		const model = context.models['openai:gpt-4o-mini']
		await context.conversation.addUser(userPrompt)

		context.stream.sendChunk('Checking FAQ knowledge...')
		const faqResult = await context.tools.invoke('support.1.lookupFaq', { question: userPrompt })
		const faqAnswer =
			typeof faqResult === 'object' && faqResult && 'answer' in faqResult && typeof faqResult.answer === 'string'
				? faqResult.answer
				: 'No matching FAQ article was found.'

		const extractedUrl = extractFirstUrl(userPrompt)
		let websiteSummary = ''
		if (extractedUrl) {
			context.stream.sendChunk(`Fetching website context from ${extractedUrl}...`)
			const websiteResult = await context.tools.invoke('support.1.fetchWebsite', { url: extractedUrl })
			if (
				typeof websiteResult === 'object' &&
				websiteResult &&
				'text' in websiteResult &&
				typeof websiteResult.text === 'string'
			) {
				websiteSummary = websiteResult.text.slice(0, 1_800)
			}
		}

		const calculationExpression = extractCalculationExpression(userPrompt)
		let calculationResult = ''
		if (calculationExpression) {
			context.stream.sendChunk(`Calculating: ${calculationExpression}`)
			try {
				const calc = await context.tools.invoke('support.1.calculate', { expression: calculationExpression })
				if (typeof calc === 'object' && calc && 'result' in calc) {
					calculationResult = String(calc.result)
				}
			} catch (error) {
				context.logger.warn({ err: error, calculationExpression }, 'Calculation tool failed')
			}
		}

		let triageSummary = ''
		if (/refund|enterprise|legal|urgent|escalate|priority|incident/i.test(userPrompt)) {
			context.stream.sendChunk('Escalating to triage agent...')
			const triagePayload: Record<string, unknown> = {
				prompt: userPrompt,
			}
			if (payload.sessionId) {
				triagePayload.sessionId = payload.sessionId
			}
			try {
				const triageResult = await context.tools.invoke('triageAgent.1.run', {
					...triagePayload,
				})
				if (hasErrorFrame(triageResult)) {
					context.stream.sendChunk('Triage unavailable right now, continuing with FAQ guidance.')
				}
				triageSummary = getFinalMessage(triageResult)
			} catch (error) {
				context.logger.warn({ err: error }, 'triageAgent failed, continuing with faq-only fallback')
				context.stream.sendChunk('Triage unavailable right now, continuing with FAQ guidance.')
			}
		}

		context.stream.sendChunk('Generating final answer...')
		const modelRequest = {
			prompt: [
				await context.conversation.buildPromptInput(),
				`Customer prompt: ${userPrompt}`,
				`FAQ answer: ${faqAnswer}`,
				calculationResult ? `Calculation result: ${calculationResult}` : undefined,
				websiteSummary ? `Website context: ${websiteSummary}` : undefined,
				triageSummary ? `Triage summary: ${triageSummary}` : undefined,
			]
				.filter(Boolean)
				.join('\n'),
			context: payload.context,
			metadata: {
				aiSdk: {
					temperature: 0.2,
				},
			},
		}

		try {
			if (payload.responseFormat === 'json' && model.generateJson) {
				const jsonResult = await model.generateJson<z.infer<typeof jsonAnswerSchema>>({
					...modelRequest,
					prompt: `${modelRequest.prompt}\n\nReturn JSON that follows the provided schema.`,
					schema: jsonAnswerSchema,
				})
				if (jsonResult.reasoningText?.trim()) {
					context.stream.sendReasoning(jsonResult.reasoningText)
				}
				context.stream.sendArtifact({
					artifactId: 'json-response',
					content: jsonResult.data,
					mimeType: 'application/json',
					final: true,
				})
				await context.conversation.addAssistant(jsonResult.data.answer)
				context.stream.sendFinal(jsonResult.data.answer)
				return {
					message: jsonResult.data.answer,
				}
			}

			const maybeStreamModel = model as typeof model & {
				stream?: (request: typeof modelRequest) => AsyncIterable<
					| { type: 'text-delta'; textDelta: string }
					| { type: 'reasoning-delta'; reasoningDelta: string }
					| { type: 'error'; error: unknown }
				> & {
					final(): Promise<{ output: string; reasoningText?: string }>
				}
			}

			if (typeof maybeStreamModel.stream === 'function') {
				const stream = maybeStreamModel.stream(modelRequest)
				let answer = ''
				let reasoning = ''

				for await (const chunk of stream) {
					if (chunk.type === 'error') {
						throw chunk.error
					}
					if (chunk.type === 'reasoning-delta') {
						reasoning += chunk.reasoningDelta
						if (reasoning.trim().length > 0) {
							context.stream.sendReasoning(reasoning)
						}
					}
					if (chunk.type === 'text-delta') {
						answer += chunk.textDelta
						context.stream.sendChunk(answer)
					}
				}

				const finalResult = await stream.final()
				const finalAnswer = finalResult.output || answer
				const finalReasoning = finalResult.reasoningText?.trim() ?? reasoning.trim()
				if (finalReasoning) {
					context.stream.sendReasoning(finalReasoning)
				}
				await context.conversation.addAssistant(finalAnswer)
				context.stream.sendFinal(finalAnswer)

				return {
					message: finalAnswer,
				}
			}

			if (!model.generate) {
				throw new HandledError(StatusCode.InternalServerError, 'Text generation model is not configured')
			}
			const result = await model.generate(modelRequest)
			if (result.reasoningText?.trim()) {
				context.stream.sendReasoning(result.reasoningText)
			}
			const answer = result.output
			await context.conversation.addAssistant(answer)
			const progressiveChunks = splitTextIntoProgressiveChunks(answer)
			let progressiveText = ''
			for (const chunk of progressiveChunks) {
				progressiveText = progressiveText ? `${progressiveText} ${chunk}` : chunk
				context.stream.sendChunk(progressiveText)
				await new Promise(resolve => setImmediate(resolve))
			}
			context.stream.sendFinal(answer)

			return {
				message: answer,
			}
		} catch (error) {
			await context.conversation.revertLast({ role: 'user' })
			throw HandledError.fromError(error, StatusCode.BadGateway)
		}
	})
	.build()

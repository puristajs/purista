import { AgentBuilder, generateText } from '@purista/ai'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

import { type SupportAgentInput, supportAgentInputSchema } from './schema.js'

const escalationPattern = /refund|enterprise|legal|urgent|escalate|priority|incident/i

const jsonAnswerSchema = z.object({
	answer: z.string().min(1),
	nextActions: z.array(z.string()).default([]),
	sources: z.array(z.string()).default([]),
})

const extractFirstUrl = (input: string): string | undefined => {
	const match = input.match(/https?:\/\/[^\s)]+/i)
	return match?.[0]
}

const extractCalculationExpression = (input: string): string | undefined => {
	const explicit = input.match(/(?:calculate|calc)\s*[:-]?\s*([0-9+\-*/().\s]+)/i)
	if (explicit?.[1]) {
		return explicit[1].trim()
	}

	const generic = input.match(/([0-9][0-9+\-*/().\s]{2,})/)
	return generic?.[1]?.trim()
}

export const supportAgent = new AgentBuilder({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Queued durable support agent with checkpoints and optional delegation to triageAgent',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream', 'json'] })
	.persistConversation('user', { maxFrames: 20 })
	.setExecutionMode('queued')
	.setExecutionPolicy({
		httpBehavior: 'attach-and-stream',
		recovery: 'resume-from-checkpoints',
		scopeFromPayload: ['sessionId'],
		leaseTtlMs: 30_000,
		heartbeatIntervalMs: 10_000,
		maxAttempts: 3,
		maxDurationMs: 15 * 60_000,
	})
	.canInvoke('support', '1', 'lookupFaq')
	.canInvoke('support', '1', 'calculate')
	.canInvoke('support', '1', 'fetchWebsite')
	.canInvokeAgent('triageAgent', '1')
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
	.setSseProtocol('ai-sdk-ui-message')
	.setHandler<SupportAgentInput>(async function (context, payload) {
		const userPrompt = payload.prompt ?? payload.message ?? ''
		const model = context.models['openai:gpt-4o-mini']
		const sessionId = payload.sessionId ?? context.message.id
		const run = await context.runState.start({
			title: 'Support orchestration',
			phase: 'planning',
			extraScope: {
				sessionId,
			},
			lock: {
				key: 'support',
				extraScope: {
					sessionId,
				},
			},
		})

		await context.conversation.addUser(userPrompt)
		await run.plan([
			{ id: 'faq', title: 'Check knowledge base' },
			{ id: 'website', title: 'Fetch website context when needed' },
			{ id: 'calculation', title: 'Evaluate calculations when requested' },
			{ id: 'triage', title: 'Escalate to triage when needed' },
			{ id: 'answer', title: 'Compose final answer' },
		])
		await run.checkpoint(
			'request',
			{
				prompt: userPrompt,
				responseFormat: payload.responseFormat ?? 'text',
			},
			{ completed: true },
		)
		await run.update({ phase: 'running', status: 'running' })

		const faqAnswer = await run.step(
			'faq',
			async () => {
				context.stream.sendChunk('Checking knowledge base...')
				const faqResult = await context.tools.invoke.support['1'].lookupFaq({ question: userPrompt })
				return typeof faqResult === 'object' &&
					faqResult &&
					'answer' in faqResult &&
					typeof faqResult.answer === 'string'
					? faqResult.answer
					: 'No matching knowledge-base article was found.'
			},
			{ detail: 'Searching the knowledge base', checkpoint: 'faq-answer' },
		)

		const extractedUrl = extractFirstUrl(userPrompt)
		const websiteSummary = await run.step(
			'website',
			async () => {
				if (!extractedUrl) {
					return ''
				}
				context.stream.sendChunk(`Fetching website context from ${extractedUrl}...`)
				const websiteResult = await context.tools.invoke.support['1'].fetchWebsite({ url: extractedUrl })
				if (
					typeof websiteResult === 'object' &&
					websiteResult &&
					'text' in websiteResult &&
					typeof websiteResult.text === 'string'
				) {
					return websiteResult.text.slice(0, 1_800)
				}
				return ''
			},
			{
				detail: extractedUrl ? `Fetching ${extractedUrl}` : 'No URL requested',
				checkpoint: 'website-summary',
			},
		)

		const calculationExpression = extractCalculationExpression(userPrompt)
		const calculationResult = await run.step(
			'calculation',
			async () => {
				if (!calculationExpression) {
					return ''
				}
				context.stream.sendChunk(`Calculating: ${calculationExpression}`)
				try {
					const calc = await context.tools.invoke.support['1'].calculate({ expression: calculationExpression })
					if (typeof calc === 'object' && calc && 'result' in calc) {
						return String(calc.result)
					}
				} catch (error) {
					context.logger.warn({ err: error, calculationExpression }, 'Calculation tool failed')
				}
				return ''
			},
			{
				detail: calculationExpression ? `Evaluating ${calculationExpression}` : 'No calculation requested',
				checkpoint: 'calculation-result',
			},
		)

		const triageSummary = await run.step(
			'triage',
			async () => {
				if (!escalationPattern.test(userPrompt)) {
					return ''
				}
				context.stream.sendChunk('Escalating to triage agent...')
				try {
					return await context.agents.runText({
						agentName: 'triageAgent',
						agentVersion: '1',
						payload: {
							prompt: userPrompt,
							sessionId,
						},
						sessionId,
					})
				} catch (error) {
					context.logger.warn({ err: error }, 'triageAgent failed, continuing with tool-based fallback')
					context.stream.sendChunk('Triage unavailable right now, continuing with tool-based guidance.')
					return ''
				}
			},
			{
				detail: escalationPattern.test(userPrompt) ? 'Escalating to the triage agent' : 'No escalation needed',
				checkpoint: 'triage-summary',
			},
		)

		const prompt = [
			await context.conversation.buildPromptInput(),
			`Customer prompt: ${userPrompt}`,
			`Knowledge base answer: ${faqAnswer}`,
			calculationResult ? `Calculation result: ${calculationResult}` : undefined,
			websiteSummary ? `Website context: ${websiteSummary}` : undefined,
			triageSummary ? `Triage summary: ${triageSummary}` : undefined,
		]
			.filter(Boolean)
			.join('\n')

		try {
			await run.update({ phase: 'summarizing', status: 'summarizing' })
			const answer = await run.step(
				'answer',
				async () => {
					if (payload.responseFormat === 'json' && model.generateJson) {
						const jsonResult = await model.generateJson<z.infer<typeof jsonAnswerSchema>>({
							prompt: `${prompt}\n\nReturn JSON that follows the provided schema.`,
							schema: jsonAnswerSchema,
							context: payload.context,
							metadata: { aiSdk: { temperature: 0.2 } },
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
						return jsonResult.data.answer
					}

					if (!model.generate && !model.stream) {
						throw new HandledError(StatusCode.InternalServerError, 'Text generation model is not configured')
					}

					context.stream.sendChunk('Generating final answer...')
					const answer = await generateText({
						model,
						request: {
							prompt,
							context: payload.context,
							metadata: { aiSdk: { temperature: 0.2 } },
						},
						onReasoning: text => context.stream.sendReasoning(text),
						onTextDelta: delta => {
							if (delta.length > 0) {
								context.stream.sendChunk(delta)
							}
						},
					})
					await context.conversation.addAssistant(answer)
					return answer
				},
				{ detail: 'Generating final answer', checkpoint: 'final-answer' },
			)

			await run.setFinalMessage(answer)
			await run.finishSuccess(answer)
			context.stream.sendFinal(answer)
			return { message: answer }
		} catch (error) {
			await context.conversation.revertLast({ role: 'user' })
			await run.failTask('answer', error instanceof Error ? error.message : String(error))
			await run.finishFailure(error instanceof Error ? error.message : String(error), {
				code: error instanceof HandledError ? String(error.errorCode) : 'UnhandledError',
				message: error instanceof Error ? error.message : String(error),
				handled: error instanceof HandledError,
			})
			throw HandledError.fromError(error, StatusCode.BadGateway)
		}
	})
	.build()

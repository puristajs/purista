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
	description: 'Support agent using tool calls and optional delegation to triageAgent',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream', 'json'] })
	.persistConversation('user', { maxFrames: 20 })
	.canInvoke('support', '1', 'lookupFaq')
	.canInvoke('support', '1', 'calculate')
	.canInvoke('support', '1', 'fetchWebsite')
	.canInvokeAgent('triageAgent', '1')
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
	.setSseProtocol('ai-sdk-ui-message')
	.setHandler<SupportAgentInput>(async function (context, payload) {
		const userPrompt = payload.prompt ?? payload.message ?? ''
		const model = context.models['openai:gpt-4o-mini']
		const run = await context.runState.start({
			title: 'Support orchestration',
			extraScope: {
				sessionId: payload.sessionId ?? context.message.id,
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

		context.stream.sendChunk('Checking knowledge base...')
		await run.startTask('faq', 'Searching the knowledge base')
		const faqResult = await context.tools.invoke.support['1'].lookupFaq({ question: userPrompt })
		await run.completeTask('faq', 'Knowledge base lookup completed')
		const faqAnswer =
			typeof faqResult === 'object' && faqResult && 'answer' in faqResult && typeof faqResult.answer === 'string'
				? faqResult.answer
				: 'No matching knowledge-base article was found.'

		let websiteSummary = ''
		const extractedUrl = extractFirstUrl(userPrompt)
		if (extractedUrl) {
			await run.startTask('website', `Fetching ${extractedUrl}`)
			context.stream.sendChunk(`Fetching website context from ${extractedUrl}...`)
			const websiteResult = await context.tools.invoke.support['1'].fetchWebsite({ url: extractedUrl })
			if (
				typeof websiteResult === 'object' &&
				websiteResult &&
				'text' in websiteResult &&
				typeof websiteResult.text === 'string'
			) {
				websiteSummary = websiteResult.text.slice(0, 1_800)
			}
			await run.completeTask('website', 'Website context captured')
		} else {
			await run.completeTask('website', 'No URL requested')
		}

		let calculationResult = ''
		const calculationExpression = extractCalculationExpression(userPrompt)
		if (calculationExpression) {
			await run.startTask('calculation', `Evaluating ${calculationExpression}`)
			context.stream.sendChunk(`Calculating: ${calculationExpression}`)
			try {
				const calc = await context.tools.invoke.support['1'].calculate({ expression: calculationExpression })
				if (typeof calc === 'object' && calc && 'result' in calc) {
					calculationResult = String(calc.result)
				}
				await run.completeTask('calculation', `Calculation result: ${calculationResult || 'done'}`)
			} catch (error) {
				context.logger.warn({ err: error, calculationExpression }, 'Calculation tool failed')
				await run.failTask('calculation', error instanceof Error ? error.message : String(error))
			}
		} else {
			await run.completeTask('calculation', 'No calculation requested')
		}

		let triageSummary = ''
		if (escalationPattern.test(userPrompt)) {
			await run.startTask('triage', 'Escalating to the triage agent')
			context.stream.sendChunk('Escalating to triage agent...')
			try {
				triageSummary = await context.agents.runText({
					agentName: 'triageAgent',
					agentVersion: '1',
					payload: {
						prompt: userPrompt,
						sessionId: payload.sessionId,
					},
					sessionId: payload.sessionId,
				})
				await run.completeTask('triage', 'Triage agent returned guidance')
			} catch (error) {
				context.logger.warn({ err: error }, 'triageAgent failed, continuing with tool-based fallback')
				context.stream.sendChunk('Triage unavailable right now, continuing with tool-based guidance.')
				await run.failTask('triage', error instanceof Error ? error.message : String(error))
			}
		} else {
			await run.completeTask('triage', 'No escalation needed')
		}

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
			await run.phase('answer-generation', 'summarizing')
			await run.startTask('answer', 'Generating final answer')
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
				await run.completeTask('answer', 'JSON answer generated')
				await run.finishSuccess(jsonResult.data.answer)
				context.stream.sendFinal(jsonResult.data.answer)
				return { message: jsonResult.data.answer }
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
			await run.completeTask('answer', 'Final answer generated')
			await run.finishSuccess(answer)
			context.stream.sendFinal(answer)
			return { message: answer }
		} catch (error) {
			await context.conversation.revertLast({ role: 'user' })
			await run.failTask('answer', error instanceof Error ? error.message : String(error))
			await run.finishFailure(error instanceof Error ? error.message : String(error))
			throw HandledError.fromError(error, StatusCode.BadGateway)
		}
	})
	.build()

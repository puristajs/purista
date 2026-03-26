import { AgentBuilder, renderSkillDocuments, renderSkillReferences } from '@purista/ai'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

import { type SupportAgentInput, supportAgentInputSchema } from './schema.js'

const escalationPattern = /refund|enterprise|legal|urgent|escalate|priority|incident/i

const jsonAnswerSchema = z.object({
	answer: z.string().min(1),
	nextActions: z.array(z.string()).default([]),
	sources: z.array(z.string()).default([]),
})

const answerCritiqueSchema = z.object({
	accepted: z.boolean(),
	feedback: z.array(z.string()).default([]),
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

// biome-ignore lint/correctness/useHookAtTopLevel: AgentBuilder.useSkills is a builder method, not a React hook.
export const supportAgent = new AgentBuilder({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Queued durable support agent with checkpoints and optional delegation to triageAgent',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineResource<'supportPolicy', { developerInstruction: string }>()
	.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream', 'json'] })
	.useSkills(['spec-elicitation', 'support-workflow'])
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
	.setReflectionPolicy({
		enabledByDefault: false,
		presets: {
			synthesis: {
				maxIterations: 2,
				stopOnStagnation: true,
				artifacts: {
					emitArtifacts: true,
					artifactPrefix: 'reflection',
				},
			},
		},
	})
	.setAgentPolicy({
		quality: {
			defaultProfile: 'standard',
			profiles: {
				quick: {
					reflection: {
						enabled: false,
					},
					verification: {
						required: false,
					},
					execution: {
						maxModelSteps: 8,
						maxToolCalls: 8,
					},
				},
				standard: {
					reflection: {
						enabled: false,
					},
					verification: {
						required: true,
					},
					execution: {
						maxModelSteps: 16,
						maxToolCalls: 12,
					},
				},
				synthesis: {
					reflection: {
						enabled: true,
						preset: 'synthesis',
						maxIterations: 2,
					},
					verification: {
						required: true,
					},
					execution: {
						maxModelSteps: 24,
						maxToolCalls: 16,
					},
				},
			},
		},
		approvals: {
			checkpoints: {
				'publish-response': {
					required: true,
					when: 'before-final-message',
					timeoutMs: 5_000,
				},
			},
		},
		resources: {
			objective: 'quality',
			maxDurationMs: 15 * 60_000,
		},
	})
	.canInvoke('support', '1', 'lookupFaq')
	.canInvoke('support', '1', 'calculate')
	.canInvoke('support', '1', 'fetchWebsite')
	.canInvokeAgent('triageAgent', '1')
	.setBeforeGuardHooks({
		requirePrompt: async function requirePrompt(_context, payload) {
			const prompt =
				typeof payload === 'object' && payload !== null ? (payload as { prompt?: string }).prompt : undefined
			if (!prompt?.trim()) {
				throw new HandledError(StatusCode.BadRequest, 'prompt is required')
			}
		},
	})
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
	.setSseProtocol('ai-sdk-ui-message')
	.setHandler<SupportAgentInput>(async function (context, payload) {
		const userPrompt = payload.prompt ?? payload.message ?? ''
		const model = context.ai.models['openai:gpt-4o-mini']
		const sessionId = payload.sessionId ?? context.input.message.id
		const quality = context.ai.policy.resolve(payload.qualityProfile)
		const run = await context.memory.run.start({
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

		await context.memory.conversation.addUser(userPrompt)
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
				qualityProfile: quality.name ?? 'standard',
				requireApproval: payload.requireApproval ?? false,
			},
			{ completed: true },
		)
		await run.update({ phase: 'running', status: 'running' })
		await run.checkpoint(
			'quality-profile',
			{
				name: quality.name ?? 'standard',
				reflectionEnabled: quality.reflection.enabled,
				maxIterations: quality.reflection.maxIterations,
				verificationRequired: quality.verification.required,
			},
			{ completed: true },
		)

		const faqAnswer = await run.step(
			'faq',
			async () => {
				context.io.stream.sendChunk('Checking knowledge base...')
				const faqResult = await context.invoke.tools.invoke.support['1'].lookupFaq({ question: userPrompt })
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
				context.io.stream.sendChunk(`Fetching website context from ${extractedUrl}...`)
				const websiteResult = await context.invoke.tools.invoke.support['1'].fetchWebsite({ url: extractedUrl })
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
				context.io.stream.sendChunk(`Calculating: ${calculationExpression}`)
				try {
					const calc = await context.invoke.tools.invoke.support['1'].calculate({ expression: calculationExpression })
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
				context.io.stream.sendChunk('Escalating to triage agent...')
				try {
					return await context.invoke.agents.runText({
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
					context.io.stream.sendChunk('Triage unavailable right now, continuing with tool-based guidance.')
					return ''
				}
			},
			{
				detail: escalationPattern.test(userPrompt) ? 'Escalating to the triage agent' : 'No escalation needed',
				checkpoint: 'triage-summary',
			},
		)

		const skills = await context.ai.skills.loadAvailable()
		const skillReferences = await context.ai.skills.loadReferences('support-workflow').catch(() => [])

		const prompt = [
			renderSkillDocuments('Relevant skills', skills),
			renderSkillReferences('Relevant references', skillReferences),
			context.app.resources.supportPolicy.developerInstruction,
			await context.memory.conversation.buildPromptInput(),
			`Customer prompt: ${userPrompt}`,
			`Knowledge base answer: ${faqAnswer}`,
			calculationResult ? `Calculation result: ${calculationResult}` : undefined,
			websiteSummary ? `Website context: ${websiteSummary}` : undefined,
			triageSummary ? `Triage summary: ${triageSummary}` : undefined,
		]
			.filter(Boolean)
			.join('\n')

		const generateTextAnswer = async (instructions?: string) => {
			if (!model.generateText) {
				throw new HandledError(StatusCode.InternalServerError, 'Text generation model is not configured')
			}
			return await model.generateText({
				prompt: [prompt, instructions].filter(Boolean).join('\n\n'),
				context: payload.context,
				metadata: { aiSdk: { temperature: 0.2 } },
				onReasoning: text => context.io.stream.sendReasoning(text),
			})
		}

		try {
			await run.update({ phase: 'summarizing', status: 'summarizing' })
			let publishedReply = false
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
							context.io.stream.sendReasoning(jsonResult.reasoningText)
						}
						context.io.stream.sendArtifact({
							artifactId: 'json-response',
							content: jsonResult.data,
							mimeType: 'application/json',
							final: true,
						})
						return jsonResult.data.answer
					}

					if (!quality.reflection.enabled && !payload.requireApproval) {
						context.io.stream.sendChunk('Generating final answer...')
						publishedReply = true
						return await context.ai.reply.generate({
							model: 'openai:gpt-4o-mini',
							prompt,
							context: payload.context,
							metadata: { aiSdk: { temperature: 0.2 } },
							onReasoning: text => context.io.stream.sendReasoning(text),
						})
					}

					let internalAnswer: string
					if (quality.reflection.enabled) {
						context.io.stream.sendChunk(`Running ${quality.name ?? 'synthesis'} reflection loop...`)
						const reflection = await context.ai.reflect.run<string, z.infer<typeof answerCritiqueSchema>>({
							name: 'support-answer',
							profile: quality.name,
							draft: async () =>
								await generateTextAnswer('Write the first support response draft. Keep it actionable and specific.'),
							critique: async ({ draft, iteration }) => {
								if (!model.generateJson) {
									return { accepted: true, feedback: [] }
								}
								const critique = await model.generateJson<z.infer<typeof answerCritiqueSchema>>({
									prompt: [
										prompt,
										`Draft ${iteration}:`,
										draft,
										'Review the draft. Accept only when it is concrete, correct, and production-safe.',
									].join('\n\n'),
									schema: answerCritiqueSchema,
									context: payload.context,
									metadata: { aiSdk: { temperature: 0 } },
								})
								return critique.data
							},
							accept: ({ critique }) => critique.accepted,
							refine: async ({ draft, critique }) =>
								await generateTextAnswer(
									[
										'Revise the previous draft using the critique.',
										`Previous draft:\n${draft}`,
										critique.feedback.length > 0
											? `Critique:\n- ${critique.feedback.join('\n- ')}`
											: 'Critique: tighten wording and improve completeness.',
									].join('\n\n'),
								),
						})
						internalAnswer = reflection.output
					} else {
						context.io.stream.sendChunk('Generating final answer...')
						internalAnswer = await model.generateText({
							prompt,
							context: payload.context,
							metadata: { aiSdk: { temperature: 0.2 } },
							onReasoning: text => context.io.stream.sendReasoning(text),
						})
					}
					return internalAnswer
				},
				{ detail: 'Generating final answer', checkpoint: 'final-answer' },
			)

			if (payload.requireApproval) {
				context.io.stream.sendChunk('Waiting for approval before sending the final answer...')
				await context.runtime.approvals.wait({
					checkpoint: 'publish-response',
					detail: 'Review the generated support response before it is sent to the user.',
				})
			}

			if (!publishedReply) {
				context.ai.reply.publish(answer)
			}
			await context.memory.conversation.addAssistant(answer)
			await run.setFinalMessage(answer)
			await run.finishSuccess(answer)
			return { message: answer }
		} catch (error) {
			await context.memory.conversation.revertLast({ role: 'user' })
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

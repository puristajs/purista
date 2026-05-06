import type {
	ModelProvider,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderObjectStream,
	ProviderRequest,
} from '@purista/ai'

export class DeterministicModelProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'
	readonly capabilities = { text: true, 'text-stream': true, object: true, 'object-stream': true }

	streamText(request: ProviderRequest) {
		const prompt = request.prompt.toLowerCase()
		const output = prompt.includes('you are finalizing a developer-facing summary after a planner workflow')
			? [
					'# Evaluation outcome',
					'The architecture change needs additional hardening before rollout.',
					'',
					'**Highlights**',
					'- Planner created a sequential task list.',
					'- Delegates were invoked deterministically.',
					'',
					'**Recommended next actions**',
					'- Review the highlighted findings.',
					'- Execute the next engineering step.',
				].join('\n')
			: `INTEROP:${request.prompt}`
		return {
			async final() {
				return {
					output,
					tokens: {
						prompt: request.prompt.length,
						completion: 10,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'text-delta' as const,
					textDelta: output,
				}
			},
		}
	}

	async generateText(request: {
		prompt: string
		onReasoning?: (text: string) => void | Promise<void>
		onTextDelta?: (delta: string) => void | Promise<void>
	}): Promise<string> {
		const prompt = request.prompt.toLowerCase()
		const output = prompt.includes('summarize the final proposal revision')
			? 'Developer Desk reflection summary'
			: prompt.includes('you are finalizing a developer-facing summary after a planner workflow')
				? [
						'# Evaluation outcome',
						'The architecture change needs additional hardening before rollout.',
						'',
						'**Highlights**',
						'- Planner created a sequential task list.',
						'- Delegates were invoked deterministically.',
						'',
						'**Recommended next actions**',
						'- Review the highlighted findings.',
						'- Execute the next engineering step.',
					].join('\n')
				: prompt.includes('developer desk research')
					? 'Developer Desk research answer'
					: `INTEROP:${request.prompt}`
		await request.onReasoning?.('deterministic reasoning')
		await request.onTextDelta?.(output)
		return output
	}

	async generateObject<T = unknown, OutputSchema = unknown>(
		request: ProviderJsonRequest<OutputSchema>,
	): Promise<ProviderJsonResponse<T>> {
		const prompt = request.prompt.toLowerCase()
		if (prompt.includes('break down the request into an exact sequential plan')) {
			const plan = prompt.includes('architecture')
				? {
						title: 'Developer desk delivery plan',
						summary: 'Review the architecture and summarize the outcome.',
						tasks: [
							{
								id: 'review-architecture',
								title: 'Review the proposed architecture',
								instruction: 'Review the architecture and return a structured readiness assessment.',
								delegate: 'architecture-review',
							},
							{
								id: 'summarize-findings',
								title: 'Summarize the final recommendation',
								instruction: 'Summarize the architecture review for the developer.',
							},
						],
					}
				: prompt.includes('research') || prompt.includes('documentation') || prompt.includes('http')
					? {
							title: 'Developer desk delivery plan',
							summary: 'Research documentation and summarize the findings.',
							tasks: [
								{
									id: 'research-docs',
									title: 'Research the request',
									instruction: 'Research the request and gather the relevant facts.',
									delegate: 'research-agent',
								},
								{
									id: 'summarize-findings',
									title: 'Summarize the research result',
									instruction: 'Summarize the research result for the developer.',
								},
							],
						}
					: prompt.includes('guidance') || prompt.includes('faq') || prompt.includes('purista')
						? {
								title: 'Developer desk delivery plan',
								summary: 'Look up Purista-specific guidance.',
								tasks: [
									{
										id: 'lookup-guidance',
										title: 'Look up Purista guidance',
										instruction: 'Look up the most relevant Purista guidance for this request.',
										delegate: 'lookup-faq',
									},
									{
										id: 'summarize-findings',
										title: 'Summarize the guidance',
										instruction: 'Summarize the guidance for the developer.',
									},
								],
							}
						: {
								title: 'Developer desk delivery plan',
								summary: 'Let the worker draft the direct reply.',
								tasks: [
									{
										id: 'draft-reply',
										title: 'Draft the answer',
										instruction: 'Write a concise developer-facing answer.',
									},
								],
							}
			return {
				data: plan as T,
				text: JSON.stringify(plan),
				tokens: {
					prompt: 1,
					completion: 1,
				},
			}
		}
		if (prompt.includes('you are finalizing a developer-facing summary after a planner workflow')) {
			return {
				data: {
					message: 'Planner summary for the developer desk workflow.',
					highlights: ['Planner created a sequential task list.', 'Delegates were invoked deterministically.'],
					recommendedNextActions: ['Review the highlighted findings.', 'Execute the next engineering step.'],
					researchSummary: 'Deterministic research summary.',
				} as T,
				text: 'planner-summary',
				tokens: {
					prompt: 1,
					completion: 1,
				},
			}
		}
		if (prompt.includes('assess the request and return a concise architecture readiness review')) {
			return {
				data: {
					overallVerdict: prompt.includes('risky') ? 'risky' : 'needs-work',
					executiveSummary: 'The architecture needs targeted hardening before rollout.',
					strengths: ['Service boundaries are explicit.', 'Streaming and protocol lanes are already modeled.'],
					risks: ['Operational observability is still incomplete.', 'Delivery sequencing needs tighter ownership.'],
					nextActions: ['Tighten the rollout plan.', 'Add focused integration checks.'],
				} as T,
				text: 'architecture-review',
				tokens: {
					prompt: 1,
					completion: 1,
				},
			}
		}
		const urgency = prompt.includes('down') || prompt.includes('production') ? 'high' : 'low'
		return {
			data: {
				message: 'Structured deterministic reply',
				mode: 'summary',
				urgency,
				explanation: 'deterministic explanation',
				nextSteps: 'deterministic next steps',
			} as T,
			text: `{"urgency":"${urgency}"}`,
			tokens: {
				prompt: 1,
				completion: 1,
			},
		}
	}

	streamObject<T = unknown, OutputSchema = unknown>(
		request: ProviderJsonRequest<OutputSchema>,
	): ProviderObjectStream<T> {
		let finalResultPromise: Promise<ProviderJsonResponse<T>> | undefined
		const resolveFinal = async () => {
			finalResultPromise ??= this.generateObject<T, OutputSchema>(request)
			return await finalResultPromise
		}

		return {
			async final() {
				return await resolveFinal()
			},
			async *[Symbol.asyncIterator]() {
				const final = await resolveFinal()
				yield {
					type: 'status' as const,
					message: 'Analyzing developer desk request',
				}
				if (typeof final.data === 'object' && final.data !== null) {
					for (const [section, content] of Object.entries(final.data as Record<string, unknown>)) {
						yield {
							type: 'section' as const,
							section,
							content,
						}
					}
				}
				yield {
					type: 'final-object' as const,
					data: final.data,
					text: final.text,
					reasoningText: final.reasoningText,
					tokens: final.tokens,
					metadata: final.metadata,
				}
			},
		}
	}
}

export const deterministicModelProvider = new DeterministicModelProvider()

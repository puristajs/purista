import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import {
	type ArchitectureReviewAgentInput,
	type ArchitectureReviewAgentResponse,
	architectureReviewAgentInputSchema,
	architectureReviewAgentResponseSchema,
} from './schema.js'

const toMarkdown = (review: ArchitectureReviewAgentResponse) =>
	[
		`**Verdict:** ${review.overallVerdict}`,
		`**Readiness Score:** ${review.scorecard.readinessScore}/100`,
		`**Summary:** ${review.executiveSummary}`,
		`**Strengths:** ${review.strengths.join('; ')}`,
		`**Risks:** ${review.risks.join('; ')}`,
		`**Next Actions:** ${review.nextActions.join('; ')}`,
	].join('\n\n')

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

const parseNamedScores = <TKey extends string>(raw: string, keys: readonly TKey[]) => {
	const parsed: Partial<Record<TKey, number>> = {}
	for (const key of keys) {
		const match = raw.match(new RegExp(`${key}\\s*:\\s*(\\d{1,3})`, 'i'))
		if (match?.[1]) {
			parsed[key] = clampScore(Number(match[1]))
		}
	}
	return parsed
}

const normalizeBulletList = (value: string) =>
	value
		.split('\n')
		.map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
		.filter(line => line.length > 0)

const cleanSectionText = (raw: string, payloadPrompt: string) =>
	raw
		.replaceAll('You are Developer Desk Architecture Review.', '')
		.replace(/Return only the requested .*? section for the review below\./gi, '')
		.replaceAll('Do not include headings, labels, markdown fences, or explanations about the format.', '')
		.replaceAll('Review request:', '')
		.replaceAll(payloadPrompt, '')
		.replaceAll('Section instruction:', '')
		.replace(/\n{3,}/g, '\n\n')
		.trim()

const fallbackSectionValue = (
	section: keyof ArchitectureReviewAgentResponse,
	payloadPrompt: string,
): ArchitectureReviewAgentResponse[keyof ArchitectureReviewAgentResponse] => {
	switch (section) {
		case 'overallVerdict':
			return 'needs-work'
		case 'scorecard':
			return {
				readinessScore: 68,
				riskScore: 61,
				confidenceScore: 72,
			}
		case 'dimensionScores':
			return {
				scalability: 78,
				reliability: 74,
				operability: 62,
				security: 66,
			}
		case 'executiveSummary':
			return `Architecture review requested for: ${payloadPrompt}`
		case 'strengths':
			return [
				'Queue-backed execution supports resilience and controlled scaling.',
				'Separated agents reduce coupling between responsibilities.',
				'Structured outputs make downstream consumption predictable.',
			]
		case 'risks':
			return [
				'Cross-agent coordination may introduce operational complexity.',
				'Queue bottlenecks can hide latency under load.',
				'Without strong tracing, failures are harder to diagnose.',
			]
		case 'nextActions':
			return [
				'Load test the queue and worker path under realistic concurrency.',
				'Add end-to-end tracing and runtime health dashboards.',
				'Document agent boundaries and failure recovery behavior.',
			]
	}
}

export const architectureReviewAgentBuilder = deskV1ServiceBuilder
	.getAgentQueueBuilder(
		'architectureReviewAgent',
		'Streams a structured architecture readiness review with a validated final output',
	)
	.addPayloadSchema(architectureReviewAgentInputSchema)
	.addOutputSchema(architectureReviewAgentResponseSchema)
	.addModel('openai:gpt-4o-mini')
	.exposeAsHttpEndpoint('POST', 'agents/architectureReviewAgent')
	.setStreamProtocolAdapter('ai-sdk.ui-message')
	.setAgentFunction(async function (context, payload: ArchitectureReviewAgentInput) {
		await context.memory.conversation.addUser(payload.prompt, {
			sessionId: payload.sessionId,
			metadata: { scenario: 'structured-output' },
		})

		const emitStructuredSection = (section: string, content: unknown, final = false) => {
			context.io.protocol.emitArtifact({
				artifactId: `architecture-review-${section}`,
				mimeType: 'application/json',
				content: content as never,
				final,
			})
		}

		const sectionModel = context.ai.models['openai:gpt-4o-mini']
		const reviewDraft: Partial<ArchitectureReviewAgentResponse> = {}

		const streamSection = async (
			section: keyof ArchitectureReviewAgentResponse,
			instruction: string,
		): Promise<string> => {
			const stream = sectionModel.streamText({
				prompt: `You are Developer Desk Architecture Review.
Return only the requested ${section} section for the review below.
Do not include headings, labels, markdown fences, or explanations about the format.

Review request:
${payload.prompt}

Section instruction:
${instruction}`,
			})

			let text = ''
			for await (const chunk of stream) {
				if (chunk.type === 'text-delta') {
					text += chunk.textDelta
					const cleaned = cleanSectionText(text, payload.prompt)
					emitStructuredSection(section, section === 'overallVerdict' ? cleaned.toLowerCase() : cleaned)
				}
				if (chunk.type === 'error') {
					throw chunk.error instanceof Error ? chunk.error : new Error(String(chunk.error))
				}
			}
			const final = await stream.final()
			text = cleanSectionText(final.output.trim(), payload.prompt)
			emitStructuredSection(section, section === 'overallVerdict' ? text.toLowerCase() : text, true)
			return text
		}

		const streamScoreSection = async <
			TField extends 'scorecard' | 'dimensionScores',
			TKey extends keyof ArchitectureReviewAgentResponse[TField] & string,
		>(
			section: TField,
			keys: readonly TKey[],
			instruction: string,
		): Promise<ArchitectureReviewAgentResponse[TField]> => {
			const stream = sectionModel.streamText({
				prompt: `You are Developer Desk Architecture Review.
Return only the requested ${section} section for the review below.
Do not include headings, labels other than the required keys, markdown fences, or explanations about the format.

Review request:
${payload.prompt}

Section instruction:
${instruction}`,
			})

			let text = ''
			for await (const chunk of stream) {
				if (chunk.type === 'text-delta') {
					text += chunk.textDelta
					const cleaned = cleanSectionText(text, payload.prompt)
					const partial = parseNamedScores(cleaned, keys)
					if (Object.keys(partial).length > 0) {
						emitStructuredSection(section, partial)
					}
				}
				if (chunk.type === 'error') {
					throw chunk.error instanceof Error ? chunk.error : new Error(String(chunk.error))
				}
			}
			const final = await stream.final()
			const cleaned = cleanSectionText(final.output.trim(), payload.prompt)
			const parsed = parseNamedScores(cleaned, keys)
			const fallback = fallbackSectionValue(section, payload.prompt) as Record<string, number>
			const completed = Object.fromEntries(
				keys.map(key => [key, parsed[key] ?? fallback[key]]),
			) as ArchitectureReviewAgentResponse[TField]
			emitStructuredSection(section, completed, true)
			return completed
		}

		const overallVerdictText = await streamSection(
			'overallVerdict',
			'Return exactly one lowercase value: ready, needs-work, or risky.',
		)
		reviewDraft.overallVerdict = (overallVerdictText.match(/\b(ready|needs-work|risky)\b/i)?.[1]?.toLowerCase() ??
			fallbackSectionValue('overallVerdict', payload.prompt)) as ArchitectureReviewAgentResponse['overallVerdict']
		reviewDraft.scorecard = await streamScoreSection(
			'scorecard',
			['readinessScore', 'riskScore', 'confidenceScore'],
			'Return exactly 3 lines in the form readinessScore: N, riskScore: N, confidenceScore: N. Each N must be an integer between 0 and 100.',
		)
		reviewDraft.dimensionScores = await streamScoreSection(
			'dimensionScores',
			['scalability', 'reliability', 'operability', 'security'],
			'Return exactly 4 lines in the form scalability: N, reliability: N, operability: N, security: N. Each N must be an integer between 0 and 100.',
		)

		const executiveSummaryText = await streamSection(
			'executiveSummary',
			'Return one concise executive summary sentence.',
		)
		reviewDraft.executiveSummary =
			executiveSummaryText || (fallbackSectionValue('executiveSummary', payload.prompt) as string)

		reviewDraft.strengths =
			normalizeBulletList(await streamSection('strengths', 'Return 3 short bullet points, one per line.')) ||
			(fallbackSectionValue('strengths', payload.prompt) as string[])
		if (reviewDraft.strengths.length === 0) {
			reviewDraft.strengths = fallbackSectionValue('strengths', payload.prompt) as string[]
		}
		emitStructuredSection('strengths', reviewDraft.strengths, true)
		reviewDraft.risks = normalizeBulletList(await streamSection('risks', 'Return 3 short bullet points, one per line.'))
		if (reviewDraft.risks.length === 0) {
			reviewDraft.risks = fallbackSectionValue('risks', payload.prompt) as string[]
		}
		emitStructuredSection('risks', reviewDraft.risks, true)
		reviewDraft.nextActions = normalizeBulletList(
			await streamSection('nextActions', 'Return 3 short next actions, one per line.'),
		)
		if (reviewDraft.nextActions.length === 0) {
			reviewDraft.nextActions = fallbackSectionValue('nextActions', payload.prompt) as string[]
		}
		emitStructuredSection('nextActions', reviewDraft.nextActions, true)

		const review = architectureReviewAgentResponseSchema.parse(reviewDraft)

		const message = toMarkdown(review)
		await context.memory.conversation.addAssistant(review.executiveSummary, {
			sessionId: payload.sessionId,
			metadata: { agent: 'architectureReviewAgent', scenario: 'structured-output' },
		})

		return {
			message,
			output: review,
		}
	})

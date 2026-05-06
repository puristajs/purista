import { HandledError, StatusCode } from '@purista/core'
import { lookupFaqInputSchema, lookupFaqOutputSchema } from '../../command/lookupFaq/schema.js'
import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { createInternalConversationSessionId } from '../../exampleConversationStore.js'
import {
	type ArchitectureReviewAgentResponse,
	architectureReviewAgentInputSchema,
	architectureReviewAgentResponseSchema,
} from '../architectureReviewAgent/index.js'
import { researchAgentInputSchema, researchAgentResponseSchema } from '../researchAgent/index.js'
import {
	type DeliveryPlannerAgentInput,
	deliveryPlannerAgentInputSchema,
	deliveryPlannerAgentResponseSchema,
} from './schema.js'

const plannerInstructions = `Break down the request into an exact sequential plan.
- Prefer 2-3 tasks. Use 4 only when the request genuinely needs an extra step.
- The default worker is only for concise synthesis or focused reasoning that cannot be delegated.
- Use research-agent for documentation lookup, factual investigation, or URL-based research.
- Use architecture-review when the user needs a structured architecture or readiness assessment.
- Use lookup-faq only for Purista-specific framework guidance.
- Keep tasks business-level and executable from the instruction alone.
- Avoid generic placeholders like "Initial Risk Assessment" or "Final Evaluation Report" when a more specific task title is possible.
- For architecture-change evaluation, strongly prefer:
  1. targeted documentation research when external facts are needed
  2. architecture-review for the structured assessment
  3. one final synthesis step by the default worker.`

const uniqueStrings = (entries: Array<string | undefined>, minimum = 1, fallback: string[] = []) => {
	const normalized = entries.map(entry => entry?.trim()).filter((entry): entry is string => Boolean(entry))
	const deduplicated = [...new Set(normalized)]
	if (deduplicated.length >= minimum) {
		return deduplicated
	}
	const combined = [...deduplicated]
	for (const fallbackEntry of fallback) {
		if (!combined.includes(fallbackEntry)) {
			combined.push(fallbackEntry)
		}
		if (combined.length >= minimum) {
			break
		}
	}
	return combined
}

const extractMarkdownBullets = (content: string, heading: string) => {
	const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const sectionMatch = content.match(
		new RegExp(`(?:^|\\n)\\*\\*${escapedHeading}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*[^\\n]+\\*\\*|$)`, 'i'),
	)
	if (!sectionMatch?.[1]) {
		return []
	}
	return sectionMatch[1]
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.startsWith('- '))
		.map(line => line.slice(2).trim())
		.filter(line => line.length > 0)
}

export const deliveryPlannerAgentBuilder = deskV1ServiceBuilder
	.getAgentQueueBuilder(
		'deliveryPlannerAgent',
		'Planner-first developer desk agent with worker, delegates, tools, and child agents',
	)
	.canInvoke('desk', '1', 'lookupFaq', lookupFaqOutputSchema, lookupFaqInputSchema)
	.canInvokeAgent('researchAgent', '1', {
		payloadSchema: researchAgentInputSchema,
		outputSchema: researchAgentResponseSchema,
	})
	.canInvokeAgent('architectureReviewAgent', '1', {
		payloadSchema: architectureReviewAgentInputSchema,
		outputSchema: architectureReviewAgentResponseSchema,
	})
	.addPayloadSchema(deliveryPlannerAgentInputSchema)
	.addOutputSchema(deliveryPlannerAgentResponseSchema)
	.addModel('openai:gpt-4o-mini')
	.exposeAsHttpEndpoint('POST', 'agents/deliveryPlannerAgent')
	.setStreamProtocolAdapter('ai-sdk.ui-message')
	.setAgentFunction(async function (context, payload: DeliveryPlannerAgentInput) {
		await context.memory.conversation.addUser(payload.prompt, {
			sessionId: payload.sessionId,
			metadata: { scenario: 'planner' },
		})

		const worker = context.ai.createToolExecutorLogic({
			id: 'default-worker',
			description: 'Default planner worker for concise synthesis and focused engineering reasoning.',
			kind: 'model',
			call: async ({ task, request }) => {
				const model = context.ai.models['openai:gpt-4o-mini']
				if (!model || typeof model.generateText !== 'function') {
					throw new HandledError(
						StatusCode.InternalServerError,
						'Planner worker model does not support text generation',
					)
				}

				return await model.generateText({
					prompt: `Original request:\n${request}\n\nCurrent task:\n${task.instruction}`,
					developerInstruction:
						'You are the default Developer Desk planner worker. Return a concise, high-signal result for this single task only. Do not restate the entire workflow.',
					onTextDelta: async delta => {
						context.io.tasks.sendChunk(task.id, delta, {
							kind: 'text-delta',
							mimeType: 'text/plain',
						})
					},
				})
			},
		})

		const lookupFaqDelegate = context.ai.createToolExecutorFromInvoke(context.invoke.tools.invoke.desk['1'].lookupFaq, {
			id: 'lookup-faq',
			description: 'Looks up Purista-specific framework guidance.',
			buildPayload: ({ task }) => ({
				question: task.instruction,
			}),
		})

		const researchDelegate = context.ai.createAgentExecutorFromInvoke(
			(payload, parameter) =>
				context.invoke.agents.invoke.researchAgent['1'].call(
					payload as { prompt: string; sessionId?: string },
					parameter,
				),
			{
				id: 'research-agent',
				description: 'Researches documentation, URLs, and factual implementation questions.',
				resultMode: 'text',
				forwardToCurrentStream: {
					assistant: false,
					artifacts: {
						workflow: true,
						sources: true,
					},
					errors: true,
					toolEvents: true,
				},
				buildPayload: ({ task }) => ({
					prompt: task.instruction,
					sessionId: createInternalConversationSessionId(payload.sessionId, `planner:research:${task.id}`),
				}),
			},
		)

		const architectureDelegate = context.ai.createAgentExecutorFromInvoke(
			(payload, parameter) =>
				context.invoke.agents.invoke.architectureReviewAgent['1'].call(
					payload as { prompt: string; sessionId?: string },
					parameter,
				),
			{
				id: 'architecture-review',
				description: 'Produces a structured architecture readiness review.',
				resultMode: 'object',
				outputSchema: architectureReviewAgentResponseSchema,
				forwardToCurrentStream: {
					assistant: false,
					artifacts: {
						workflow: true,
					},
					errors: true,
				},
				buildPayload: ({ task }) => ({
					prompt: task.instruction,
					sessionId: createInternalConversationSessionId(payload.sessionId, `planner:architecture:${task.id}`),
				}),
			},
		)

		const plan = await context.plan.generate({
			model: 'openai:gpt-4o-mini',
			title: 'Developer desk delivery plan',
			request: payload.prompt,
			instructions: plannerInstructions,
			worker,
			delegates: [lookupFaqDelegate, researchDelegate, architectureDelegate],
		})

		const execution = await context.plan.execute(plan)
		context.io.workflow.emitStage({
			name: 'final-answer',
			runId: execution.run.runId,
			status: 'running',
			summary: 'Synthesizing the final recommendation from completed planner tasks.',
		})
		const lastArchitectureReview = Object.values(execution.results).find(
			value => typeof value === 'object' && value !== null && 'overallVerdict' in value && 'executiveSummary' in value,
		) as ArchitectureReviewAgentResponse | undefined
		const researchSummary = Object.values(execution.results).find(value => typeof value === 'string')
		const history = await context.memory.conversation.buildPromptInput({
			sessionId: payload.sessionId,
		})

		const finalMessage = await context.ai.streamText({
			model: 'openai:gpt-4o-mini',
			prompt: `You are finalizing a developer-facing summary after a planner workflow.

Write a substantive markdown answer for a developer.

Requirements:
- Start with a concrete heading.
- Include a short conclusion paragraph that clearly states the evaluation outcome.
- Include a "**Highlights**" section with bullet points for the most important findings.
- Include a "**Recommended next actions**" section with concrete next steps.
- Do not write generic filler like "Summary of the evaluation plan" or "Here is the summary".
- Do not describe the planning process itself; describe the actual evaluation outcome.

Original request:
${payload.prompt}

Executed plan:
${JSON.stringify(
	plan.tasks.map(task => ({
		id: task.id,
		title: task.title,
		instruction: task.instruction,
		delegate: task.delegate,
	})),
	null,
	2,
)}

Task results:
${JSON.stringify(execution.results, null, 2)}

Conversation history:
${history || 'No prior conversation history.'}
`,
		})

		const finalOutput = {
			message: finalMessage,
			highlights: uniqueStrings(
				[
					...extractMarkdownBullets(finalMessage, 'Highlights'),
					lastArchitectureReview?.executiveSummary,
					...(lastArchitectureReview?.risks ?? []),
				],
				1,
				['Review the architecture risks before rollout.'],
			),
			recommendedNextActions: uniqueStrings(
				[
					...extractMarkdownBullets(finalMessage, 'Recommended next actions'),
					...(lastArchitectureReview?.nextActions ?? []),
				],
				1,
				['Review the highest-risk areas and define the rollout gates.'],
			),
			researchSummary:
				typeof researchSummary === 'string' && researchSummary.trim().length > 0 ? researchSummary : undefined,
			architectureReview: lastArchitectureReview,
		}
		await context.memory.conversation.addAssistant(finalOutput.message, {
			sessionId: payload.sessionId,
			metadata: {
				agent: 'deliveryPlannerAgent',
				scenario: 'planner',
			},
		})
		context.io.workflow.emitStage({
			name: 'final-answer',
			runId: execution.run.runId,
			status: 'completed',
			summary: 'Final recommendation ready.',
			finalMessage: finalOutput.message,
			final: true,
		})

		return {
			message: finalOutput.message,
			output: finalOutput,
		}
	})

import { calculateInputSchema, calculateOutputSchema } from '../../command/calculate/schema.js'
import { fetchWebsiteInputSchema, fetchWebsiteOutputSchema } from '../../command/fetchWebsite/schema.js'
import { lookupFaqInputSchema, lookupFaqOutputSchema } from '../../command/lookupFaq/schema.js'
import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { type ResearchAgentInput, researchAgentInputSchema, researchAgentResponseSchema } from './schema.js'

const urlPattern = /https?:\/\/\S+/i
const mathPattern = /\d+\s*[+\-*/]\s*\d+/

const toBulletList = (values: string[]) => values.map(value => `- ${value}`).join('\n')

export const researchAgentBuilder = deskV1ServiceBuilder
	.getAgentQueueBuilder('researchAgent', 'Research-oriented developer desk agent with tools, skills, and references')
	.canInvoke('desk', '1', 'lookupFaq', lookupFaqOutputSchema, lookupFaqInputSchema)
	.canInvoke('desk', '1', 'fetchWebsite', fetchWebsiteOutputSchema, fetchWebsiteInputSchema)
	.canInvoke('desk', '1', 'calculate', calculateOutputSchema, calculateInputSchema)
	.addPayloadSchema(researchAgentInputSchema)
	.addOutputSchema(researchAgentResponseSchema)
	.addModel('openai:gpt-4o-mini')
	.exposeAsHttpEndpoint('POST', 'agents/researchAgent')
	.setStreamProtocolAdapter('ai-sdk.ui-message')
	.setAgentFunction(async function (context, payload: ResearchAgentInput) {
		await context.memory.conversation.addUser(payload.prompt, {
			sessionId: payload.sessionId,
			metadata: { scenario: 'research' },
		})

		const findings: string[] = []
		const sources: string[] = []
		const url = payload.prompt.match(urlPattern)?.[0]
		if (url) {
			const website = await context.invoke.tools.invoke.desk['1'].fetchWebsite({ url })
			findings.push(`Fetched ${website.title ?? website.url} and extracted readable content.`)
			findings.push(website.text.slice(0, 280))
			sources.push(website.url)
			await context.memory.conversation.addTool(`Fetched ${website.url}`, {
				sessionId: payload.sessionId,
				toolName: 'fetchWebsite',
			})
			await context.memory.conversation.addToolResult(website.text.slice(0, 280), {
				sessionId: payload.sessionId,
				toolName: 'fetchWebsite',
			})
		}

		if (mathPattern.test(payload.prompt)) {
			const expression = payload.prompt.match(/\d+\s*[+\-*/]\s*\d+/)?.[0] ?? '1+1'
			const calculation = await context.invoke.tools.invoke.desk['1'].calculate({ expression })
			findings.push(`Calculated ${calculation.expression} = ${calculation.result}`)
			await context.memory.conversation.addTool(`Calculated ${calculation.expression}`, {
				sessionId: payload.sessionId,
				toolName: 'calculate',
			})
			await context.memory.conversation.addToolResult(String(calculation.result), {
				sessionId: payload.sessionId,
				toolName: 'calculate',
			})
		}

		if (findings.length === 0) {
			const faq = await context.invoke.tools.invoke.desk['1'].lookupFaq({
				question: payload.prompt,
			})
			findings.push(faq.answer)
			sources.push('desk.1.lookupFaq')
			await context.memory.conversation.addTool('Looked up PURISTA guidance', {
				sessionId: payload.sessionId,
				toolName: 'lookupFaq',
			})
			await context.memory.conversation.addToolResult(faq.answer, {
				sessionId: payload.sessionId,
				toolName: 'lookupFaq',
			})
		}

		let references: Awaited<ReturnType<typeof context.ai.skills.selectReferences>> | undefined
		if (context.ai.skills.available && context.ai.skills.names.includes('purista')) {
			try {
				references = await context.ai.skills.selectReferences({
					skillName: 'purista',
					queries: [payload.prompt],
					limit: 2,
				})
			} catch {
				references = undefined
			}
		}

		const history = await context.memory.conversation.buildPromptInput({
			sessionId: payload.sessionId,
		})
		const answer = await context.ai.streamText({
			model: 'openai:gpt-4o-mini',
			prompt: `You are Developer Desk Research.
You already have the research findings. Do not claim that you cannot browse or fetch websites.
Answer strictly from the gathered findings below and cite uncertainty only when the findings are incomplete.
If a website was fetched, prioritize its contents over generic product guidance.

Conversation history:
${history || 'No prior conversation history.'}

Current request:
${payload.prompt}

Gathered findings:
${toBulletList(findings)}

Sources:
${sources.length > 0 ? toBulletList(sources) : '- none'}
`,
			references,
			publishToCurrentStream: {
				taskId: 'research',
				taskChunkKind: 'research-delta',
			},
		})

		await context.memory.conversation.addAssistant(answer, {
			sessionId: payload.sessionId,
			metadata: { agent: 'researchAgent', scenario: 'research', sources },
		})

		return {
			message: answer,
			output: {
				message: answer,
				findings,
				sources,
			},
		}
	})

import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { type DeskChatAgentInput, deskChatAgentInputSchema, deskChatAgentResponseSchema } from './schema.js'

const buildConversationPrompt = (
	history: string,
	prompt: string,
) => `You are Developer Desk, a concise engineering assistant.
Help the developer with architecture, implementation, debugging, and platform questions.
Answer in a direct, practical tone.
Always return valid GitHub-flavored Markdown.
When you use headings, bullets, emphasis, or code fences, format them strictly and do not add decorative spaces inside Markdown markers.
Prefer:
- one short heading when it helps
- normal bullet lists with \`- \`
- numbered lists with \`1. \`
- fenced code blocks with a language tag when code is useful
Avoid malformed Markdown like \`** heading **\` or decorative bullets.

${history.trim().length > 0 ? `Conversation history:\n${history}\n\n` : ''}Latest user request:
${prompt}`

export const deskChatAgentBuilder = deskV1ServiceBuilder
	.getAgentQueueBuilder('deskChatAgent', 'Stream-first developer desk chat with conversation memory')
	.addPayloadSchema(deskChatAgentInputSchema)
	.addOutputSchema(deskChatAgentResponseSchema)
	.addModel('openai:gpt-4o-mini')
	.exposeAsHttpEndpoint('POST', 'agents/deskChatAgent')
	.setStreamProtocolAdapter('ai-sdk.ui-message')
	.setAgentFunction(async function (context, payload: DeskChatAgentInput) {
		await context.memory.conversation.addUser(payload.prompt, {
			sessionId: payload.sessionId,
			metadata: { scenario: 'chat' },
		})

		const history = await context.memory.conversation.buildPromptInput({
			sessionId: payload.sessionId,
		})
		const answer = await context.ai.streamText({
			model: 'openai:gpt-4o-mini',
			prompt: buildConversationPrompt(history, payload.prompt),
		})

		await context.memory.conversation.addAssistant(answer, {
			sessionId: payload.sessionId,
			metadata: { agent: 'deskChatAgent', scenario: 'chat' },
		})

		return {
			message: answer,
			output: {
				answer,
			},
		}
	})

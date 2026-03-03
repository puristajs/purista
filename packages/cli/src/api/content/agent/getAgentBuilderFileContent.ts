import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

export const getAgentBuilderFileContent = (input: {
	agentName: string
	agentDescription: string
	agentVersion: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const normalizedAgentName = camelCase(input.agentName)
	const schemaName = `${normalizedAgentName}InputSchema`
	const definitionName = `${normalizedAgentName}AgentDefinition`

	writer.writeLine("import { AgentBuilder } from '@purista/ai'")
	writer.writeLine("import { extendApi } from '@purista/core'")
	writer.writeLine("import { z } from 'zod/v4'").blankLine()

	writer.writeLine(`const ${schemaName} = extendApi(`)
	writer.indent(() => {
		writer.writeLine('z.object({')
		writer.indent(() => {
			writer.writeLine("sessionId: extendApi(z.string().optional(), { title: 'Session identifier' }),")
			writer.writeLine("prompt: extendApi(z.string().min(1), { title: 'User prompt' }),")
			writer.writeLine("context: extendApi(z.string().optional(), { title: 'Additional context' }),")
		})
		writer.writeLine('}),')
		writer.writeLine("  { title: 'Agent input schema' },")
	})
	writer.writeLine(')').blankLine()

	writer.writeLine(`export const ${definitionName} = new AgentBuilder({`)
	writer.indent(() => {
		writer.writeLine(`agentName: '${normalizedAgentName}',`)
		writer.writeLine(`agentVersion: '${input.agentVersion}',`)
		writer.writeLine(`description: '${input.agentDescription}',`)
	})
	writer.writeLine('})')
	writer.indent(() => {
		writer.writeLine(`.addPayloadSchema(${schemaName})`)
		writer.writeLine(".defineModel('openai:gpt-4o-mini')")
		writer.writeLine(".persistHistory({ storeName: 'aiConversation', maxFrames: 20 })")
		writer.writeLine(`.setConcurrency({ poolId: '${normalizedAgentName}' })`)
		writer.writeLine(`.exposeAsHttpEndpoint('POST', 'agents/${normalizedAgentName}')`)
		writer.writeLine(
			'.setHandler<{ sessionId?: string; prompt: string; context?: string }>(async function (context, payload) {',
		)
		writer.indent(() => {
			writer.writeLine('const sessionId = payload.sessionId ?? context.message.id ?? (`session-` + Date.now())')
			writer.writeLine("context.logger.info({ prompt: payload.prompt }, 'invoking agent')")
			writer.writeLine("const model = context.models['openai:gpt-4o-mini']")
			writer.writeLine('const result = await model.generate({ prompt: payload.prompt, context: payload.context })')
			writer.writeLine('const answer = result.output')
			writer.writeLine('context.stream.sendFinal(answer)')
			writer.writeLine('await context.session.save({ sessionId, data: { lastOutput: answer }, updatedAt: Date.now() })')
			writer.writeLine('return { message: answer }')
		})
		writer.writeLine('})')
	})
	writer.writeLine('.build()')

	return writer.toString()
}

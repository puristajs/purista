import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

export const getAgentBuilderFileContent = (input: {
	agentName: string
	agentDescription: string
	agentVersion: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const schemaName = `${agentIdentifier}InputSchema`
	const addSuccessEvent = !!input.responseEventName?.trim()

	writer.writeLine("import { AgentBuilder } from '@purista/ai'")
	writer.writeLine("import { extendApi } from '@purista/core'")
	writer.writeLine("import { z } from 'zod'").blankLine()

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

	writer.writeLine(`export const ${agentIdentifier} = new AgentBuilder({`)
	writer.indent(() => {
		writer.writeLine(`agentName: '${agentIdentifier}',`)
		writer.writeLine(`agentVersion: '${input.agentVersion}',`)
		writer.writeLine(`description: '${input.agentDescription}',`)
	})
	writer.writeLine('})')
	writer.indent(() => {
		if (addSuccessEvent) {
			writer.writeLine(
				`.setSuccessEventName('${convertToProjectEventCasing(input.responseEventName as string, input.puristaConfig)}')`,
			)
		}
		writer.writeLine(`.addPayloadSchema(${schemaName})`)
		writer.writeLine(".defineModel('openai:gpt-4o-mini')")
		writer.writeLine(".persistConversation('user', { maxFrames: 20 })")
		writer.writeLine(`.exposeAsHttpEndpoint('POST', 'agents/${agentIdentifier}')`)
		writer.writeLine(
			'.setHandler<{ sessionId?: string; prompt: string; context?: string }>(async function (context, payload) {',
		)
		writer.indent(() => {
			writer.writeLine("context.logger.info({ prompt: payload.prompt }, 'invoking agent')")
			writer.writeLine('await context.conversation.addUser(payload.prompt)')
			writer.writeLine('// For long-running workflows prefer durable run state instead of in-memory progress flags.')
			writer.writeLine("// Example: const run = await context.runState.start({ title: 'My long-running agent task' })")
			writer.writeLine("// await run.plan([{ id: 'step-1', title: 'Collect input' }])")
			writer.writeLine('const prompt = await context.conversation.buildPromptInput()')
			writer.writeLine("const model = context.models['openai:gpt-4o-mini']")
			writer.writeLine('if (!model.generate) {')
			writer.indent(() => {
				writer.writeLine("throw new Error('Model alias openai:gpt-4o-mini does not provide generate()')")
			})
			writer.writeLine('}')
			writer.writeLine('const result = await model.generate({ prompt, context: payload.context })')
			writer.writeLine('if (result.reasoningText?.trim()) {')
			writer.indent(() => {
				writer.writeLine('context.stream.sendReasoning(result.reasoningText)')
			})
			writer.writeLine('}')
			writer.writeLine('const answer = result.output')
			writer.writeLine('await context.conversation.addAssistant(answer)')
			writer.writeLine('context.stream.sendFinal(answer)')
			writer.writeLine('return { message: answer }')
		})
		writer.writeLine('})')
	})
	writer.writeLine('.build()')

	return writer.toString()
}

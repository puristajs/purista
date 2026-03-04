import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

export const getAgentTestFileContent = (input: {
	agentName: string
	builderImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)

	writer.writeLine("import { DefaultEventBridge } from '@purista/core'")
	writer.writeLine("import { EchoProvider } from '@purista/ai'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${agentIdentifier} } from '${input.builderImportName}'`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs with deterministic provider and emits protocol frames', async () => {")
		writer.indent(() => {
			writer.writeLine('const eventBridge = new DefaultEventBridge()')
			writer.writeLine('await eventBridge.start()')
			writer.blankLine()
			writer.writeLine(`const agent = await ${agentIdentifier}.getInstance(eventBridge, {`)
			writer.indent(() => {
				writer.writeLine("models: { 'openai:gpt-4o-mini': new EchoProvider() },")
			})
			writer.writeLine('})')
			writer.writeLine('await agent.start()')
			writer.writeLine('await new Promise(resolve => setTimeout(resolve, 25))')
			writer.blankLine()
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine('const { envelopes } = await agent.invoke({')
				writer.indent(() => {
					writer.writeLine("payload: { prompt: 'hello', message: 'hello', history: [], attachments: [] },")
				})
				writer.writeLine('})')
				writer.blankLine()
				writer.writeLine('const hasFinalMessage = envelopes.some(')
				writer.indent(() => {
					writer.writeLine(
						"envelope => envelope.frame.kind === 'message' && envelope.frame.final === true && envelope.frame.content.length > 0,",
					)
				})
				writer.writeLine(')')
				writer.writeLine("const hasTelemetry = envelopes.some(envelope => envelope.frame.kind === 'telemetry')")
				writer.writeLine('expect(hasFinalMessage).toBe(true)')
				writer.writeLine('expect(hasTelemetry).toBe(true)')
			})
			writer.writeLine('} finally {')
			writer.indent(() => {
				writer.writeLine('await agent.stop()')
				writer.writeLine('await eventBridge.destroy()')
			})
			writer.writeLine('}')
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')

	return writer.toString()
}

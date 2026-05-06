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
	const builderName = `${agentIdentifier}Builder`

	writer.writeLine("import { getFinalAssistantText, getTelemetryFrames, ScriptedModel } from '@purista/ai'")
	writer.writeLine("import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.blankLine()
	writer.writeLine(`const { ${builderName} } = await import('${input.builderImportName}')`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs with the attached-agent runtime and emits protocol frames', async () => {")
		writer.indent(() => {
			writer.writeLine('const eventBridge = new DefaultEventBridge()')
			writer.writeLine('await eventBridge.start()')
			writer.writeLine('const queueBridge = new DefaultQueueBridge()')
			writer.writeLine(`const instance = await ${builderName}.getInstance(eventBridge, {`)
			writer.indent(() => {
				writer.writeLine('queueBridge,')
				writer.writeLine("models: { 'openai:gpt-4o-mini': new ScriptedModel().nextText('hello') },")
			})
			writer.writeLine('})')
			writer.blankLine()
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine('await instance.start()')
				writer.blankLine()
				writer.writeLine('const result = await instance.invoke({')
				writer.indent(() => {
					writer.writeLine("payload: { prompt: 'hello' },")
				})
				writer.writeLine('})')
				writer.blankLine()
				writer.writeLine("expect(getFinalAssistantText(result.envelopes)).toBe('hello')")
				writer.writeLine('expect(getTelemetryFrames(result.envelopes).length).toBeGreaterThan(0)')
			})
			writer.writeLine('} finally {')
			writer.indent(() => {
				writer.writeLine('await instance.stop()')
				writer.writeLine('await queueBridge.destroy()')
				writer.writeLine('await eventBridge.destroy()')
			})
			writer.writeLine('}')
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')

	return writer.toString()
}

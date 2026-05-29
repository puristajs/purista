import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/** Generate an attached-agent harness test with a scripted object model. */
export const getAgentTestFileContent = (input: {
	agentName: string
	builderImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const builderName = `${agentIdentifier}Builder`

	writer.writeLine("import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/core'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.blankLine()
	writer.writeLine(`const { ${builderName} } = await import('${input.builderImportName}')`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs with the attached-agent harness runtime', async () => {")
		writer.indent(() => {
			writer.writeLine('const model = createScriptedHarnessModel()')
			writer.writeLine('model.enqueueObject({')
			writer.indent(() => {
				writer.writeLine("object: { message: 'hello' },")
				writer.writeLine('usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },')
				writer.writeLine("finishReason: 'stop',")
			})
			writer.writeLine('})')
			writer.blankLine()
			writer.writeLine(`const harness = await createAgentTestHarness(await ${builderName}.getDefinition(), {`)
			writer.indent(() => {
				writer.writeLine('models: {')
				writer.indent(() => {
					writer.writeLine('primary: {')
					writer.indent(() => {
						writer.writeLine('provider: model,')
						writer.writeLine("model: 'gpt-4.1-mini',")
						writer.writeLine("capabilities: ['object'],")
					})
					writer.writeLine('},')
				})
				writer.writeLine('},')
			})
			writer.writeLine('})')
			writer.blankLine()
			writer.writeLine('const result = await harness.run({')
			writer.indent(() => {
				writer.writeLine("payload: { prompt: 'hello' },")
			})
			writer.writeLine('})')
			writer.blankLine()
			writer.writeLine("expect(result).toEqual({ message: 'hello' })")
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')

	return writer.toString()
}

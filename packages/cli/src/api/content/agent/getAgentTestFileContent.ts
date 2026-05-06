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

	writer.writeLine("import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/ai/testing'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.blankLine()
	writer.writeLine(`const { ${builderName} } = await import('${input.builderImportName}')`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs with the attached-agent harness runtime', async () => {")
		writer.indent(() => {
			writer.writeLine(`const harness = await createAgentTestHarness(await ${builderName}.getDefinition(), {`)
			writer.indent(() => {
				writer.writeLine('models: {')
				writer.indent(() => {
					writer.writeLine('primary: {')
					writer.indent(() => {
						writer.writeLine("provider: createScriptedHarnessModel().nextObject({ message: 'hello' }),")
						writer.writeLine("model: 'gpt-4.1-mini',")
						writer.writeLine("capabilities: ['object', 'text_stream', 'tool_use'],")
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

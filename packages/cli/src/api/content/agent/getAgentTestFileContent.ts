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

	writer.writeLine("import { createAgentTestHarness, ScriptedModel } from '@purista/ai'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${agentIdentifier} } from '${input.builderImportName}'`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs with the agent test harness and emits protocol frames', async () => {")
		writer.indent(() => {
			writer.writeLine(`const harness = await createAgentTestHarness(${agentIdentifier}, {`)
			writer.indent(() => {
				writer.writeLine("models: { 'openai:gpt-4o-mini': new ScriptedModel().nextText('hello') },")
			})
			writer.writeLine('})')
			writer.blankLine()
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine('const result = await harness.run({')
				writer.indent(() => {
					writer.writeLine("payload: { prompt: 'hello' },")
				})
				writer.writeLine('})')
				writer.blankLine()
				writer.writeLine("expect(result.finalMessage).toBe('hello')")
				writer.writeLine('expect(result.telemetryFrames.length).toBeGreaterThan(0)')
			})
			writer.writeLine('} finally {')
			writer.indent(() => {
				writer.writeLine('await harness.destroy()')
			})
			writer.writeLine('}')
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')

	return writer.toString()
}

import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

export const getAgentTestFileContent = (input: {
	agentName: string
	builderImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const normalizedAgentName = camelCase(input.agentName)

	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${normalizedAgentName}AgentDefinition } from '${input.builderImportName}'`).blankLine()

	writer.writeLine("describe('Agent definition', () => {")
	writer.indent(() => {
		writer.writeLine("it('exposes manifest metadata', () => {")
		writer.indent(() => {
			writer.writeLine(`const definition = ${normalizedAgentName}AgentDefinition`)
			writer.writeLine('expect(definition.manifest.agentName).toBeTruthy()')
			writer.writeLine('expect(definition.manifest.agentVersion).toBeTruthy()')
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')

	return writer.toString()
}

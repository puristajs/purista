import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

/** Convert a logical MCP server name to its exported definition identifier. */
export const getHarnessMcpIdentifier = (name: string) => {
	const id = camelCase(name)
	return id.endsWith('Mcp') ? id : `${id}Mcp`
}

/** Generate one typed transport-free MCP server declaration. */
export const getHarnessMcpFileContent = (input: {
	mcpName: string
	mcpDescription: string
	toolName: string
	remoteName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const identifier = getHarnessMcpIdentifier(input.mcpName)
	const toolId = camelCase(input.toolName)
	writer.writeLine("import { defineMcpServer } from '@purista/harness'")
	writer.writeLine("import { z } from 'zod'").blankLine()
	writer.writeLine(`export const ${identifier} = defineMcpServer('${camelCase(input.mcpName)}', {`)
	writer.indent(() => {
		writer.writeLine('tools: {')
		writer.indent(() => {
			writer.writeLine(`${toolId}: {`)
			writer.indent(() => {
				writer.writeLine(`remoteName: ${JSON.stringify(input.remoteName)},`)
				writer.writeLine(`description: ${JSON.stringify(input.mcpDescription)},`)
				writer.writeLine('input: z.string(),')
				writer.writeLine('output: z.string(),')
			})
			writer.writeLine('},')
		})
		writer.writeLine('},')
	})
	writer.writeLine('})')
	return writer.toString()
}

/** Generate a credential-free MCP declaration contract test. */
export const getHarnessMcpTestFileContent = (input: {
	mcpName: string
	toolName: string
	remoteName: string
	mcpImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const identifier = getHarnessMcpIdentifier(input.mcpName)
	const toolId = camelCase(input.toolName)
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${identifier} } from '${input.mcpImportName}'`).blankLine()
	writer.writeLine(`describe('${identifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('declares the exact remote tool without a transport binding', () => {")
		writer.indent(() => {
			writer.writeLine(`expect(${identifier}.id).toBe('${camelCase(input.mcpName)}')`)
			writer.writeLine(`expect(${identifier}.tools.${toolId}.remoteName).toBe(${JSON.stringify(input.remoteName)})`)
			writer.writeLine(`expect(Object.keys(${identifier}.tools)).toEqual(['${toolId}'])`)
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')
	return writer.toString()
}

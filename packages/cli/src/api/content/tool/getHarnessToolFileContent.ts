import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

/** Selects a standalone Harness tool or a PURISTA ServiceBuilder-owned host tool. */
export type HarnessToolKind = 'portable' | 'purista'

/** Convert a logical tool name to its exported definition identifier. */
export const getHarnessToolIdentifier = (name: string) => {
	const id = camelCase(name)
	return id.endsWith('Tool') ? id : `${id}Tool`
}

/** Generate a portable native tool or a PURISTA ServiceBuilder-owned host tool. */
export const getHarnessToolFileContent = (input: {
	toolName: string
	toolDescription: string
	kind: HarnessToolKind
	serviceBuilderIdentifier?: string
	serviceBuilderImportName?: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const id = camelCase(input.toolName)
	const identifier = getHarnessToolIdentifier(input.toolName)
	if (input.kind === 'portable') writer.writeLine("import { defineTool } from '@purista/harness'")
	else {
		if (!input.serviceBuilderIdentifier || !input.serviceBuilderImportName)
			throw new Error('PURISTA host tool generation requires the owning service builder import.')
		writer.writeLine(`import { ${input.serviceBuilderIdentifier} } from '${input.serviceBuilderImportName}'`)
	}
	writer.writeLine("import { z } from 'zod'").blankLine()
	const factory = input.kind === 'portable' ? 'defineTool' : `${input.serviceBuilderIdentifier}.defineTool`
	writer.writeLine(`export const ${identifier} = ${factory}('${id}', {`)
	writer.indent(() => {
		writer.writeLine(`description: ${JSON.stringify(input.toolDescription)},`)
		writer.writeLine('input: z.string(),')
		writer.writeLine('output: z.string(),')
		if (input.kind === 'portable') writer.writeLine('handler: async (_context, input) => input,')
	})
	writer.writeLine(input.kind === 'portable' ? '})' : '}).setHandler(async (_context, input) => input)')
	return writer.toString()
}

/** Generate a credential-free definition contract test for a tool leaf. */
export const getHarnessToolTestFileContent = (input: {
	toolName: string
	toolImportName: string
	kind: HarnessToolKind
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const identifier = getHarnessToolIdentifier(input.toolName)
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${identifier} } from '${input.toolImportName}'`).blankLine()
	writer.writeLine(`describe('${identifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('defines one unregistered typed string tool', () => {")
		writer.indent(() => {
			writer.writeLine(`expect(${identifier}.id).toBe('${camelCase(input.toolName)}')`)
			writer.writeLine(`expect(${identifier}.kind).toBe('tool')`)
			writer.writeLine(`expect(Object.isFrozen(${identifier})).toBe(true)`)
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')
	return writer.toString()
}

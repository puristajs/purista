import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, snakeCase } from '../../change-case.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/** Generate one portable, provider-neutral Harness definition. */
export const getHarnessDefinitionFileContent = (input: {
	agentName: string
	agentDescription: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const agentId = snakeCase(`${input.agentName} agent`)
	const harnessName = `${camelCase(input.agentName)}Harness`
	const inputSchemaName = `${agentIdentifier}InputSchema`
	const outputSchemaName = `${agentIdentifier}OutputSchema`

	writer.writeLine("import { defineHarness } from '@purista/harness'")
	writer.writeLine("import { z } from 'zod'").blankLine()

	writer.writeLine(`export const ${inputSchemaName} = z.object({`)
	writer.indent(() => {
		writer.writeLine('prompt: z.string().min(1),')
		writer.writeLine('context: z.string().optional(),')
	})
	writer.writeLine('})').blankLine()

	writer.writeLine(`export const ${outputSchemaName} = z.object({`)
	writer.indent(() => writer.writeLine('message: z.string(),'))
	writer.writeLine('})').blankLine()

	writer.writeLine(`export const ${harnessName} = defineHarness({ name: '${camelCase(input.agentName)}' })`)
	writer.indent(() => {
		writer.writeLine(".requireModel('primary', { capabilities: ['object'] })")
		writer.writeLine(`.agent('${agentId}', {`)
		writer.indent(() => {
			writer.writeLine("model: 'primary',")
			writer.writeLine(`input: ${inputSchemaName},`)
			writer.writeLine(`output: ${outputSchemaName},`)
			writer.writeLine("updates: 'object-snapshot',")
			writer.writeLine(`instructions: ${JSON.stringify(input.agentDescription)},`)
		})
		writer.writeLine('})')
		writer.writeLine('.define()')
	})

	return writer.toString()
}

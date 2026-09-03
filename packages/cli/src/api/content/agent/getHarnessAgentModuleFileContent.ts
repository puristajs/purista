import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, snakeCase } from '../../change-case.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/** Generate one provider-neutral native Harness agent module. */
export const getHarnessAgentModuleFileContent = (input: {
	serviceName: string
	agentName: string
	agentDescription: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const agentId = snakeCase(input.agentName)
	const inputSchemaName = `${agentIdentifier}InputSchema`
	const outputSchemaName = `${agentIdentifier}OutputSchema`

	writer.writeLine("import { defineHarnessModule, type BuilderState, type ModelAlias } from '@purista/harness'")
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

	writer.writeLine('type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }').blankLine()
	writer.writeLine(
		`export const ${agentIdentifier} = defineHarnessModule<PrimaryModelState>()('${snakeCase(input.serviceName)}.agent.${agentId}', {`,
	)
	writer.indent(() => {
		writer.writeLine("version: '1.0.0',")
		writer.writeLine('register(builder) {')
		writer.indent(() => {
			writer.writeLine(`return builder.agent('${agentId}', {`)
			writer.indent(() => {
				writer.writeLine("model: 'primary',")
				writer.writeLine(`input: ${inputSchemaName},`)
				writer.writeLine(`output: ${outputSchemaName},`)
				writer.writeLine("updates: 'object-snapshot',")
				writer.writeLine(`instructions: ${JSON.stringify(input.agentDescription)},`)
			})
			writer.writeLine('})')
		})
		writer.writeLine('},')
	})
	writer.writeLine('})')

	return writer.toString()
}

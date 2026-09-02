import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, snakeCase } from '../../change-case.js'

const toWorkflowIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Workflow') ? normalized : `${normalized}Workflow`
}

/** Generate one provider-neutral native Harness workflow module. */
export const getHarnessWorkflowModuleFileContent = (input: {
	serviceName: string
	workflowName: string
	workflowDescription: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const workflowIdentifier = toWorkflowIdentifier(input.workflowName)
	const workflowId = snakeCase(input.workflowName)
	const inputSchemaName = `${workflowIdentifier}InputSchema`
	const outputSchemaName = `${workflowIdentifier}OutputSchema`

	writer.writeLine("import { defineHarnessModule } from '@purista/harness'")
	writer.writeLine("import { z } from 'zod'").blankLine()
	writer.writeLine(`export const ${inputSchemaName} = z.object({`)
	writer.indent(() => writer.writeLine('value: z.string().min(1),'))
	writer.writeLine('})').blankLine()
	writer.writeLine(`export const ${outputSchemaName} = z.object({`)
	writer.indent(() => writer.writeLine('value: z.string(),'))
	writer.writeLine('})').blankLine()
	writer.writeLine(`// ${input.workflowDescription.replaceAll(/\s+/g, ' ').trim()}`)
	writer.writeLine(
		`export const ${workflowIdentifier} = defineHarnessModule<{}>()('${snakeCase(input.serviceName)}.workflow.${workflowId}', {`,
	)
	writer.indent(() => {
		writer.writeLine("version: '1.0.0',")
		writer.writeLine('register(builder) {')
		writer.indent(() => {
			writer.writeLine(`return builder.workflow('${workflowId}', {`)
			writer.indent(() => {
				writer.writeLine(`input: ${inputSchemaName},`)
				writer.writeLine(`output: ${outputSchemaName},`)
				writer.writeLine("updates: 'object-snapshot',")
				writer.writeLine(`handler: async context => context.step('produce-output', async () => ({`)
				writer.indent(() => writer.writeLine('value: context.input.value,'))
				writer.writeLine('})),')
			})
			writer.writeLine('})')
		})
		writer.writeLine('},')
	})
	writer.writeLine('})')

	return writer.toString()
}

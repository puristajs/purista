import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

const toWorkflowIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Workflow') ? normalized : `${normalized}Workflow`
}

/** Generate one provider-neutral native string Harness workflow. */
export const getHarnessWorkflowFileContent = (input: {
	serviceName: string
	workflowName: string
	workflowDescription: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const workflowIdentifier = toWorkflowIdentifier(input.workflowName)
	writer.writeLine("import { defineWorkflow } from '@purista/harness'").blankLine()
	writer.writeLine(`export const ${workflowIdentifier} = defineWorkflow('${camelCase(input.workflowName)}', {`)
	writer.indent(() => {
		writer.writeLine(`description: ${JSON.stringify(input.workflowDescription)},`)
		writer.writeLine('handler: async context => context.input,')
	})
	writer.writeLine('})')

	return writer.toString()
}

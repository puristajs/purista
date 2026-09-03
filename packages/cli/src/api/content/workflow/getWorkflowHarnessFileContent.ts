import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

/** Generate the first service Harness when a workflow is its first AI artifact. */
export const getWorkflowHarnessFileContent = (input: {
	serviceName: string
	workflowIdentifier: string
	workflowImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const harnessName = `${camelCase(input.serviceName)}Harness`
	writer.writeLine("import { defineHarness } from '@purista/harness'")
	writer.writeLine(`import { ${input.workflowIdentifier} } from '${input.workflowImportName}'`).blankLine()
	writer.writeLine(`export const ${harnessName} = defineHarness({ name: '${camelCase(input.serviceName)}' })`)
	writer.indent(() => {
		writer.writeLine(`.use(${input.workflowIdentifier})`)
		writer.writeLine('.define()')
	})
	return writer.toString()
}

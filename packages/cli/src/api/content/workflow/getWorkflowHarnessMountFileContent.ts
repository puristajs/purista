import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, snakeCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate the service publication policy when a workflow is its first target. */
export const getWorkflowHarnessMountFileContent = (input: {
	serviceName: string
	workflowName: string
	harnessImportName: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const workflowId = snakeCase(input.workflowName)
	const harnessName = `${camelCase(input.serviceName)}Harness`
	const policyName = `${camelCase(input.serviceName)}HarnessPolicy`
	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined
	writer.writeLine(`import { ${harnessName} } from '${input.harnessImportName}'`).blankLine()
	writer.writeLine(`export { ${harnessName} }`).blankLine()
	writer.writeLine(`export const ${policyName} = {`)
	writer.indent(() => {
		writer.writeLine(`publish: { agents: [], workflows: ['${workflowId}'] },`)
		writer.writeLine('targets: {')
		writer.indent(() => {
			writer.writeLine('agents: {},')
			writer.writeLine('workflows: {')
			if (successEventName) {
				writer.indent(() => writer.writeLine(`${workflowId}: { successEvent: '${successEventName}' },`))
			}
			writer.writeLine('},')
		})
		writer.writeLine('},')
	})
	writer.writeLine('} as const')
	return writer.toString()
}

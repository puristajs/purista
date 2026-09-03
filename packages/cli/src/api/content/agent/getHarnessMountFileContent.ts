import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, snakeCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate the service-owned publication policy for a Harness definition. */
export const getHarnessMountFileContent = (input: {
	serviceName: string
	agentName: string
	harnessImportName: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentId = snakeCase(input.agentName)
	const harnessName = `${camelCase(input.serviceName)}Harness`
	const policyName = `${camelCase(input.serviceName)}HarnessPolicy`
	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined

	writer.writeLine(`import { ${harnessName} } from '${input.harnessImportName}'`).blankLine()
	writer.writeLine(`export { ${harnessName} }`).blankLine()
	writer.writeLine(`export const ${policyName} = {`)
	writer.indent(() => {
		writer.writeLine(`publish: { agents: ['${agentId}'], workflows: [] },`)
		writer.writeLine('targets: {')
		writer.indent(() => {
			writer.writeLine('agents: {')
			if (successEventName) {
				writer.indent(() => writer.writeLine(`${agentId}: { successEvent: '${successEventName}' },`))
			}
			writer.writeLine('},')
			writer.writeLine('workflows: {},')
		})
		writer.writeLine('},')
	})
	writer.writeLine('} as const')

	return writer.toString()
}

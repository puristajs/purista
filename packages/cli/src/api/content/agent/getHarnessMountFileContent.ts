import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, snakeCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate the service-owned publication policy for a Harness definition. */
export const getHarnessMountFileContent = (input: {
	agentName: string
	harnessImportName: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentId = snakeCase(`${input.agentName} agent`)
	const harnessName = `${camelCase(input.agentName)}Harness`
	const policyName = `${camelCase(input.agentName)}HarnessPolicy`
	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined

	writer.writeLine(`import { ${harnessName} } from '${input.harnessImportName}'`).blankLine()
	writer.writeLine(`export { ${harnessName} }`).blankLine()
	writer.writeLine(`export const ${policyName} = {`)
	writer.indent(() => {
		writer.writeLine(`publish: { agents: ['${agentId}'] },`)
		if (successEventName) {
			writer.writeLine('targets: {')
			writer.indent(() => {
				writer.writeLine('agents: {')
				writer.indent(() => writer.writeLine(`${agentId}: { successEvent: '${successEventName}' },`))
				writer.writeLine('},')
			})
			writer.writeLine('},')
		}
	})
	writer.writeLine('} as const')

	return writer.toString()
}

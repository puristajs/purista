import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/** Generate the service-owned publication policy for a Harness definition. */
export const getHarnessMountFileContent = (input: {
	agentName: string
	harnessImportName: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const harnessName = `${camelCase(input.agentName)}Harness`
	const policyName = `${camelCase(input.agentName)}HarnessPolicy`
	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined

	writer.writeLine(`import { ${harnessName} } from '${input.harnessImportName}'`).blankLine()
	writer.writeLine(`export { ${harnessName} }`).blankLine()
	writer.writeLine(`export const ${policyName} = {`)
	writer.indent(() => {
		writer.writeLine(`publish: { agents: ['${agentIdentifier}'] },`)
		if (successEventName) {
			writer.writeLine('targets: {')
			writer.indent(() => {
				writer.writeLine('agents: {')
				writer.indent(() => writer.writeLine(`${agentIdentifier}: { successEvent: '${successEventName}' },`))
				writer.writeLine('},')
			})
			writer.writeLine('},')
		}
	})
	writer.writeLine('} as const')

	return writer.toString()
}

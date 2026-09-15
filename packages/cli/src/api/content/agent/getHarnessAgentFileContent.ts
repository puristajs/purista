import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

export const getHarnessAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/** Generate one provider-neutral native string Harness agent. */
export const getHarnessAgentFileContent = (input: {
	serviceName: string
	agentName: string
	agentDescription: string
	modelAlias: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = getHarnessAgentIdentifier(input.agentName)
	writer.writeLine("import { defineAgent } from '@purista/harness'").blankLine()
	writer.writeLine(`export const ${agentIdentifier} = defineAgent('${camelCase(input.agentName)}', {`)
	writer.indent(() => {
		writer.writeLine(`description: ${JSON.stringify(input.agentDescription)},`)
		writer.writeLine(`model: ${JSON.stringify(input.modelAlias)},`)
		writer.writeLine(`instructions: ${JSON.stringify(input.agentDescription)},`)
	})
	writer.writeLine('})')

	return writer.toString()
}

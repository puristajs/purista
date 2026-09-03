import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

/** Generate the single portable Harness definition composed by one service. */
export const getServiceHarnessFileContent = (input: {
	serviceName: string
	agentIdentifier: string
	agentImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const harnessName = `${camelCase(input.serviceName)}Harness`

	writer.writeLine("import { defineHarness } from '@purista/harness'")
	writer.writeLine(`import { ${input.agentIdentifier} } from '${input.agentImportName}'`).blankLine()
	writer.writeLine(`export const ${harnessName} = defineHarness({ name: '${camelCase(input.serviceName)}' })`)
	writer.indent(() => {
		writer.writeLine(".requireModel('primary', { capabilities: ['object'] })")
		writer.writeLine(`.use(${input.agentIdentifier})`)
		writer.writeLine('.define()')
	})

	return writer.toString()
}

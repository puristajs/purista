import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

/** Generate the single portable Harness definition composed by one service. */
export const getServiceHarnessFileContent = (input: {
	serviceName: string
	harnessName?: string
	rootIdentifier?: string
	rootImportName?: string
	rootKind?: 'Agent' | 'Workflow'
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const harnessName = `${camelCase(input.serviceName)}Harness`

	writer.writeLine("import { defineHarness } from '@purista/harness'")
	if (input.rootIdentifier && input.rootImportName)
		writer.writeLine(`import { ${input.rootIdentifier} } from '${input.rootImportName}'`)
	if (input.rootIdentifier && input.rootImportName) writer.blankLine()
	writer.writeLine(
		`export const ${harnessName} = defineHarness({ name: ${JSON.stringify(input.harnessName ?? camelCase(input.serviceName))} })`,
	)
	if (input.rootIdentifier && input.rootKind)
		writer.indent(() => writer.writeLine(`.add${input.rootKind}(${input.rootIdentifier})`))

	return writer.toString()
}

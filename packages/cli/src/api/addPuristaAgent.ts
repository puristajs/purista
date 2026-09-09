import { getHarnessAgentFileContent } from './content/agent/getHarnessAgentFileContent.js'
import { getHarnessDefinitionTestFileContent } from './content/agent/getHarnessDefinitionTestFileContent.js'
import { type HarnessScaffoldingInput, prepareHarnessScaffold, writeHarnessScaffold } from './harnessScaffolding.js'

/** Generate a colocated string agent and deterministic test, then add its service Harness root. */
export const addPuristaAgent = async (
	input: HarnessScaffoldingInput & {
		agentName: string
		agentDescription: string
	},
) => {
	const files = prepareHarnessScaffold(input, {
		kind: 'Agent',
		name: input.agentName,
		content: getHarnessAgentFileContent(input),
		testContent: importName =>
			getHarnessDefinitionTestFileContent({
				agentName: input.agentName,
				agentImportName: importName,
				codeWriterOptions: input.codeWriterOptions,
			}),
	})
	return writeHarnessScaffold(files)
}

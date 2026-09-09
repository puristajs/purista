import { getHarnessWorkflowFileContent } from './content/workflow/getHarnessWorkflowFileContent.js'
import { getHarnessWorkflowTestFileContent } from './content/workflow/getHarnessWorkflowTestFileContent.js'
import { type HarnessScaffoldingInput, prepareHarnessScaffold, writeHarnessScaffold } from './harnessScaffolding.js'

/** Generate a colocated string workflow and deterministic test, then add its service Harness root. */
export const addPuristaWorkflow = async (
	input: HarnessScaffoldingInput & {
		workflowName: string
		workflowDescription: string
	},
) => {
	const files = prepareHarnessScaffold(input, {
		kind: 'Workflow',
		name: input.workflowName,
		content: getHarnessWorkflowFileContent(input),
		testContent: importName =>
			getHarnessWorkflowTestFileContent({
				workflowName: input.workflowName,
				workflowImportName: importName,
				codeWriterOptions: input.codeWriterOptions,
			}),
	})
	return writeHarnessScaffold(files)
}

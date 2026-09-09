import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

const toWorkflowIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Workflow') ? normalized : `${normalized}Workflow`
}

/** Generate a standalone test for one native Harness workflow module. */
export const getHarnessWorkflowTestFileContent = (input: {
	workflowName: string
	workflowImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const workflowIdentifier = toWorkflowIdentifier(input.workflowName)
	const workflowId = camelCase(input.workflowName)
	writer.writeLine("import { defineHarness } from '@purista/harness'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${workflowIdentifier} } from '${input.workflowImportName}'`).blankLine()
	writer.writeLine(`describe('${workflowIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs as a standalone Harness workflow', async () => {")
		writer.indent(() => {
			writer.writeLine(`const definition = defineHarness({ name: 'workflowTest' })`)
			writer.indent(() => {
				writer.writeLine(`.addWorkflow(${workflowIdentifier})`)
			})
			writer.writeLine('const runtime = await definition.getInstance({})')
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine("const session = await runtime.getSession('test-session')")
				writer.writeLine(`const outcome = await session.workflows.${workflowId}.run('hello')`)
				writer.writeLine("expect(outcome.status).toBe('completed')")
				writer.writeLine("if (outcome.status !== 'completed') throw new Error('Expected a completed workflow run.')")
				writer.writeLine("expect(outcome.output).toBe('hello')")
			})
			writer.writeLine('} finally {')
			writer.indent(() => writer.writeLine('await runtime.close()'))
			writer.writeLine('}')
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')
	return writer.toString()
}

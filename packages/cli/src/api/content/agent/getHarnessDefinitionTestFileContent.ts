import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/** Generate a standalone Harness definition test with an injected fake model. */
export const getHarnessDefinitionTestFileContent = (input: {
	agentName: string
	agentImportName: string
	modelAlias: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const agentId = camelCase(input.agentName)
	const harnessName = 'definition'

	writer.writeLine("import { defineHarness } from '@purista/harness'")
	writer.writeLine("import { FakeModelProvider } from '@purista/harness/testing'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${agentIdentifier} } from '${input.agentImportName}'`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs as a standalone Harness definition', async () => {")
		writer.indent(() => {
			writer.writeLine('const provider = new FakeModelProvider({ strict: true })')
			writer.writeLine('provider.enqueueText({')
			writer.indent(() => {
				writer.writeLine("content: 'hello',")
				writer.writeLine('usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },')
				writer.writeLine("finishReason: 'stop',")
			})
			writer.writeLine('})').blankLine()
			writer.writeLine(`const ${harnessName} = defineHarness({ name: 'agentTest' }).addAgent(${agentIdentifier})`)
			writer
				.writeLine(
					`const runtime = await ${harnessName}.getInstance({ models: { ${input.modelAlias}: { provider, model: 'fake' } } })`,
				)
				.blankLine()
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine("const session = await runtime.getSession('test-session')")
				writer.writeLine(`const outcome = await session.agents.${agentId}.run('hello')`)
				writer.writeLine("expect(outcome.status).toBe('completed')")
				writer.writeLine("if (outcome.status !== 'completed') throw new Error('Expected a completed agent run.')")
				writer.writeLine("expect(outcome.output).toBe('hello')")
				writer.writeLine('provider.assertExhausted()')
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

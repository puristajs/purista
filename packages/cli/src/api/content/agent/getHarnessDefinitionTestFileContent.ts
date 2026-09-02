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
	definitionImportName: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const harnessName = `${camelCase(input.agentName)}Harness`

	writer.writeLine("import { FakeModelProvider } from '@purista/harness/testing'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${harnessName} } from '${input.definitionImportName}'`).blankLine()

	writer.writeLine(`describe('${agentIdentifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('runs as a standalone Harness definition', async () => {")
		writer.indent(() => {
			writer.writeLine('const provider = new FakeModelProvider({ strict: true })')
			writer.writeLine('provider.enqueueObject({')
			writer.indent(() => {
				writer.writeLine("object: { message: 'hello' },")
				writer.writeLine('usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },')
				writer.writeLine("finishReason: 'stop',")
			})
			writer.writeLine('})').blankLine()
			writer.writeLine(`const runtime = await ${harnessName}.getInstance({`)
			writer.indent(() => {
				writer.writeLine('models: {')
				writer.indent(() => writer.writeLine("primary: { provider, model: 'fake' },"))
				writer.writeLine('},')
			})
			writer.writeLine('})').blankLine()
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine("const session = await runtime.getSession('test-session')")
				writer.writeLine(`const outcome = await session.agents.${agentIdentifier}.run({ prompt: 'hello' })`)
				writer.writeLine("expect(outcome.status).toBe('completed')")
				writer.writeLine("if (outcome.status !== 'completed') throw new Error('Expected a completed agent run.')")
				writer.writeLine("expect(outcome.output).toEqual({ message: 'hello' })")
				writer.writeLine('provider.assertExhausted()')
			})
			writer.writeLine('} finally {')
			writer.indent(() => writer.writeLine('await runtime.shutdown()'))
			writer.writeLine('}')
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')

	return writer.toString()
}

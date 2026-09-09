import { camelCase } from './change-case.js'
import {
	getHarnessMcpFileContent,
	getHarnessMcpIdentifier,
	getHarnessMcpTestFileContent,
} from './content/mcp/getHarnessMcpFileContent.js'
import { prepareHarnessLeafScaffold, writeHarnessLeafScaffold } from './content/tool/leafScaffolding.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { HarnessScaffoldingInput } from './harnessScaffolding.js'

/** Inputs for one service-owned typed transport-free MCP scaffold. */
export type AddPuristaMcpInput = HarnessScaffoldingInput & {
	mcpName: string
	mcpDescription: string
	toolName: string
	remoteName: string
}

/** Generate one unregistered typed MCP declaration with no transport or credential configuration. */
export const addPuristaMcp = async (input: AddPuristaMcpInput) => {
	if (
		/[\\/]/.test(input.mcpName) ||
		input.mcpName.includes('..') ||
		/[\\/]/.test(input.toolName) ||
		input.toolName.includes('..')
	)
		throw new Error('MCP server and local tool names must not contain path separators or traversal segments.')
	const id = camelCase(input.mcpName)
	const toolId = camelCase(input.toolName)
	for (const [kind, source, value] of [
		['MCP server', input.mcpName, id],
		['MCP tool', input.toolName, toolId],
	] as const)
		if (!/^[a-z][a-zA-Z0-9]{0,63}$/.test(value))
			throw new Error(`${kind} name "${source}" must produce a lower-camel id beginning with a letter.`)
	if (!input.mcpDescription.trim()) throw new Error('MCP tool description is required; no files were changed.')
	if (!input.remoteName.trim()) throw new Error('MCP remote name is required; no files were changed.')
	if (input.remoteName !== input.remoteName.trim())
		throw new Error('MCP remote name must be provided exactly without surrounding whitespace; no files were changed.')
	const identifier = getHarnessMcpIdentifier(input.mcpName)
	if (identifier === 'defineMcpServer')
		throw new Error(
			`MCP name "${input.mcpName}" produces ${identifier}, which collides with the definition factory; no files were changed.`,
		)
	const fileName = `${convertToProjectFileCasing(identifier, input.puristaConfig)}.ts`
	const prepared = prepareHarnessLeafScaffold(input, { kind: 'mcp', id }, { kind: 'mcp', logicalName: input.mcpName }, [
		{
			name: fileName,
			content: getHarnessMcpFileContent({ ...input, codeWriterOptions: input.codeWriterOptions }),
		},
		{
			name: fileName.replace(/\.ts$/, '.test.ts'),
			content: getHarnessMcpTestFileContent({
				mcpName: input.mcpName,
				toolName: input.toolName,
				remoteName: input.remoteName,
				mcpImportName: `./${fileName.replace(/\.ts$/, '.js')}`,
				codeWriterOptions: input.codeWriterOptions,
			}),
		},
	])
	const mutations = await writeHarnessLeafScaffold(prepared)
	return {
		...mutations,
		guidance: `Import { ${identifier} } from the generated MCP file in the agent or workflow definition that needs it, then include ${identifier}.tools.${toolId} in that definition's tools array. Bind the ${id} transport only when creating the Harness instance. No Harness root, service composition, or package metadata was changed.`,
	}
}

import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { camelCase } from './change-case.js'
import {
	getHarnessToolFileContent,
	getHarnessToolIdentifier,
	getHarnessToolTestFileContent,
	type HarnessToolKind,
} from './content/tool/getHarnessToolFileContent.js'
import {
	assertExportedValue,
	assertNotBuiltInToolName,
	prepareHarnessLeafScaffold,
	writeHarnessLeafScaffold,
} from './content/tool/leafScaffolding.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import { getHarnessPaths, type HarnessScaffoldingInput, importSpecifier } from './harnessScaffolding.js'

/** Inputs for one service-owned portable or PURISTA host tool scaffold. */
export type AddPuristaToolInput = HarnessScaffoldingInput & {
	toolName: string
	toolDescription: string
	kind: HarnessToolKind
}

/** Generate one unregistered portable or ServiceBuilder-owned Harness tool and its colocated test. */
export const addPuristaTool = async (input: AddPuristaToolInput) => {
	if (/[\\/]/.test(input.toolName) || input.toolName.includes('..'))
		throw new Error('Tool names must not contain path separators or traversal segments; no files were changed.')
	const id = camelCase(input.toolName)
	if (!/^[a-z][a-zA-Z0-9]{0,63}$/.test(id))
		throw new Error(`Tool name "${input.toolName}" must produce a lower-camel id beginning with a letter.`)
	if (!input.toolDescription.trim()) throw new Error('Tool description is required; no files were changed.')
	assertNotBuiltInToolName(id, 'tool')
	if (input.kind !== 'portable' && input.kind !== 'purista')
		throw new Error('Tool kind must be portable or purista; no files were changed.')
	const identifier = getHarnessToolIdentifier(input.toolName)
	if (identifier === 'defineTool')
		throw new Error(
			`Tool name "${input.toolName}" produces ${identifier}, which collides with the definition factory; no files were changed.`,
		)
	const harnessPaths = getHarnessPaths(input)
	const directoryName = convertToProjectFileCasing(input.toolName, input.puristaConfig)
	const fileName = `${convertToProjectFileCasing(identifier, input.puristaConfig)}.ts`
	const targetDirectory = join(harnessPaths.harnessDirectory, 'tool', directoryName)
	let serviceBuilderImportName: string | undefined
	if (input.kind === 'purista') {
		const builderFile = join(
			dirname(harnessPaths.serviceFile),
			`${convertToProjectFileCasing(`${input.serviceName} v${input.serviceVersion} service builder`, input.puristaConfig)}.ts`,
		)
		if (!existsSync(builderFile))
			throw new Error(`Service builder was not found: ${builderFile}; no files were changed.`)
		assertExportedValue(builderFile, harnessPaths.serviceBuilderIdentifier)
		serviceBuilderImportName = importSpecifier(targetDirectory, builderFile)
	}
	const definition = getHarnessToolFileContent({
		toolName: input.toolName,
		toolDescription: input.toolDescription,
		kind: input.kind,
		serviceBuilderIdentifier: harnessPaths.serviceBuilderIdentifier,
		serviceBuilderImportName,
		codeWriterOptions: input.codeWriterOptions,
	})
	const prepared = prepareHarnessLeafScaffold(
		input,
		{ kind: 'tool', id },
		{ kind: 'tool', logicalName: input.toolName },
		[
			{ name: fileName, content: definition },
			{
				name: fileName.replace(/\.ts$/, '.test.ts'),
				content: getHarnessToolTestFileContent({
					toolName: input.toolName,
					toolImportName: `./${fileName.replace(/\.ts$/, '.js')}`,
					kind: input.kind,
					codeWriterOptions: input.codeWriterOptions,
				}),
			},
		],
	)
	const mutations = await writeHarnessLeafScaffold(prepared)
	return {
		...mutations,
		guidance: `Import { ${identifier} } from the generated tool file in the agent or workflow definition that needs it, then include ${identifier} in that definition's tools array. No Harness root, service composition, or package metadata was changed.`,
	}
}

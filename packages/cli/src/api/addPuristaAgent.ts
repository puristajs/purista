import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Options } from 'code-block-writer'

import { getAgentBuilderFileContent } from './content/agent/getAgentBuilderFileContent.js'
import { getAgentTestFileContent } from './content/agent/getAgentTestFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

export const addPuristaAgent = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	serviceName: string
	serviceVersion: string
	agentName: string
	agentDescription: string
	responseEventName?: string
	codeWriterOptions?: Partial<Options>
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const serviceBasePath = input.puristaConfig.servicePath ?? 'src/service'
	const serviceEntry = input.puristaProject.services[input.serviceName][input.serviceVersion]
	const agentDirName = convertToProjectFileCasing(input.agentName, input.puristaConfig)
	const agentPath = join(
		projectPath,
		serviceBasePath,
		input.serviceName,
		`v${input.serviceVersion}`,
		'agent',
		agentDirName,
	)

	if (existsSync(agentPath)) {
		throw new Error(`Agent "${input.agentName}" already exists for ${input.serviceName} v${input.serviceVersion}.`)
	}

	await mkdir(agentPath, { recursive: true })

	const serviceBuilderFilePath = join(projectPath, serviceBasePath, serviceEntry.builderFile)
	const serviceBuilderContent = await readFile(serviceBuilderFilePath, 'utf-8')
	const upgradedImportContent = serviceBuilderContent.replace(
		"import { ServiceBuilder } from '@purista/core'",
		"import { ServiceBuilder } from '@purista/ai'",
	)
	const normalizedBuilderContent = upgradedImportContent.replace(
		/export const (\w+) = new ServiceBuilder\(([^)]+)\)\.setConfigSchema\(([^)]+)\)\s*$/m,
		(_match, builderName: string, serviceInfoName: string, configSchemaName: string) =>
			`const ${builderName}Instance = new ServiceBuilder(${serviceInfoName})\n${builderName}Instance.setConfigSchema(${configSchemaName})\n\nexport const ${builderName} = ${builderName}Instance`,
	)
	if (normalizedBuilderContent !== serviceBuilderContent) {
		await writeFile(serviceBuilderFilePath, normalizedBuilderContent)
	}

	const agentIdentifier = /agent$/i.test(input.agentName) ? input.agentName : `${input.agentName} agent`
	const builderFileName = convertToProjectFileCasing(agentIdentifier, input.puristaConfig)
	const builderImportName = `./${builderFileName}.js`

	await writeFile(
		join(agentPath, `${builderFileName}.ts`),
		getAgentBuilderFileContent({
			agentName: input.agentName,
			agentDescription: input.agentDescription,
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			responseEventName: input.responseEventName,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	await writeFile(
		join(agentPath, `${builderFileName}.test.ts`),
		getAgentTestFileContent({
			agentName: input.agentName,
			builderImportName,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	await writeFile(
		join(agentPath, 'index.ts'),
		`export { ${builderFileName.replace(/-/g, '')}Builder } from './${builderFileName}.js'\n`,
	)

	return
}

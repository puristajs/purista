import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
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
	codeWriterOptions?: Partial<Options>
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const agentsBasePath = input.puristaConfig.agentPath ?? 'src/agents'
	const agentDirName = convertToProjectFileCasing(input.agentName, input.puristaConfig)
	const agentVersionBasePath = join(projectPath, agentsBasePath, agentDirName, `v${input.serviceVersion}`)
	const agentPath = agentVersionBasePath

	if (existsSync(agentPath)) {
		throw new Error(`Agent "${input.agentName}" already exists for ${input.serviceName} v${input.serviceVersion}.`)
	}

	await mkdir(agentPath, { recursive: true })

	const builderFileBaseName = convertToProjectFileCasing(
		/agent$/i.test(input.agentName) ? input.agentName : `${input.agentName} agent`,
		input.puristaConfig,
	)

	await writeFile(
		join(agentPath, `${builderFileBaseName}.ts`),
		getAgentBuilderFileContent({
			agentName: input.agentName,
			agentDescription: input.agentDescription,
			agentVersion: input.serviceVersion,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	await writeFile(
		join(agentPath, `${builderFileBaseName}.test.ts`),
		getAgentTestFileContent({
			agentName: input.agentName,
			builderImportName: `./${builderFileBaseName}.js`,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	return
}

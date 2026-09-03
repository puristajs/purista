import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { Options } from 'code-block-writer'

import { camelCase, snakeCase } from './change-case.js'
import { getHarnessAgentModuleFileContent } from './content/agent/getHarnessAgentModuleFileContent.js'
import { getHarnessDefinitionTestFileContent } from './content/agent/getHarnessDefinitionTestFileContent.js'
import { getHarnessMountFileContent } from './content/agent/getHarnessMountFileContent.js'
import { getServiceHarnessFileContent } from './content/agent/getServiceHarnessFileContent.js'
import { convertToProjectEventCasing } from './convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import {
	addModuleToHarness,
	addTargetToMountPolicy,
	ensureHarnessDependency,
	importSpecifier,
	mountHarnessOnService,
} from './harnessScaffolding.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/**
 * Add a native Harness agent definition and publish it through an existing
 * PURISTA service. Provider and infrastructure bindings remain in application
 * bootstrap configuration.
 */
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
	const sourceRoot = dirname(serviceBasePath)
	const serviceEntry = input.puristaProject.services[input.serviceName][input.serviceVersion]
	const serviceDirName = convertToProjectFileCasing(input.serviceName, input.puristaConfig)
	const agentDirName = convertToProjectFileCasing(input.agentName, input.puristaConfig)
	const agentIdentifierBase = camelCase(input.agentName)
	const agentIdentifier = agentIdentifierBase.endsWith('Agent') ? agentIdentifierBase : `${agentIdentifierBase}Agent`
	const agentId = snakeCase(input.agentName)
	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const harnessName = `${camelCase(input.serviceName)}Harness`
	const policyName = `${camelCase(input.serviceName)}HarnessPolicy`
	const harnessDirectory = join(projectPath, sourceRoot, 'harness', serviceDirName)
	const agentDirectory = join(harnessDirectory, 'agent', agentDirName)
	const agentFile = join(agentDirectory, `${agentDirName}Agent.ts`)
	const definitionFile = join(harnessDirectory, `${serviceDirName}Harness.ts`)
	const mountDirectory = join(projectPath, serviceBasePath, input.serviceName, `v${input.serviceVersion}`, 'harness')
	const mountFile = join(mountDirectory, `${serviceDirName}HarnessMount.ts`)

	if (existsSync(agentDirectory)) {
		throw new Error(`Agent "${input.agentName}" already exists for ${input.serviceName} v${input.serviceVersion}.`)
	}

	await mkdir(agentDirectory, { recursive: true })
	await mkdir(mountDirectory, { recursive: true })

	await writeFile(
		agentFile,
		getHarnessAgentModuleFileContent({
			serviceName: input.serviceName,
			agentName: input.agentName,
			agentDescription: input.agentDescription,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	await writeFile(
		join(agentDirectory, `${agentDirName}Agent.test.ts`),
		getHarnessDefinitionTestFileContent({
			agentName: input.agentName,
			harnessName,
			definitionImportName: importSpecifier(agentDirectory, definitionFile),
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	if (existsSync(definitionFile)) {
		await addModuleToHarness({
			harnessFile: definitionFile,
			moduleFile: agentFile,
			moduleIdentifier: agentIdentifier,
			harnessName,
			requirePrimaryModel: true,
		})
	} else {
		await writeFile(
			definitionFile,
			getServiceHarnessFileContent({
				serviceName: input.serviceName,
				agentIdentifier,
				agentImportName: importSpecifier(harnessDirectory, agentFile),
				codeWriterOptions: input.codeWriterOptions,
			}),
		)
	}

	if (existsSync(mountFile)) {
		await addTargetToMountPolicy({
			mountFile,
			policyName,
			kind: 'agents',
			targetId: agentId,
			successEventName: input.responseEventName?.trim()
				? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
				: undefined,
		})
	} else {
		await writeFile(
			mountFile,
			getHarnessMountFileContent({
				serviceName: input.serviceName,
				agentName: input.agentName,
				harnessImportName: importSpecifier(mountDirectory, definitionFile),
				responseEventName: input.responseEventName,
				puristaConfig: input.puristaConfig,
				codeWriterOptions: input.codeWriterOptions,
			}),
		)
	}

	await mountHarnessOnService({
		serviceFile: join(projectPath, serviceBasePath, serviceEntry.serviceFile),
		mountFile,
		harnessName,
		policyName,
		serviceBuilderName,
	})
	await ensureHarnessDependency(projectPath)
}

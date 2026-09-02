import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { Options } from 'code-block-writer'

import { camelCase, snakeCase } from './change-case.js'
import {
	getHarnessWorkflowModuleFileContent,
	getHarnessWorkflowTestFileContent,
	getWorkflowHarnessFileContent,
	getWorkflowHarnessMountFileContent,
} from './content/workflow/index.js'
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

/** Add and publish one native Harness workflow in the service-owned Harness. */
export const addPuristaWorkflow = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	serviceName: string
	serviceVersion: string
	workflowName: string
	workflowDescription: string
	responseEventName?: string
	codeWriterOptions?: Partial<Options>
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const serviceBasePath = input.puristaConfig.servicePath ?? 'src/service'
	const sourceRoot = dirname(serviceBasePath)
	const serviceEntry = input.puristaProject.services[input.serviceName][input.serviceVersion]
	const serviceDirName = convertToProjectFileCasing(input.serviceName, input.puristaConfig)
	const workflowDirName = convertToProjectFileCasing(input.workflowName, input.puristaConfig)
	const workflowIdentifierBase = camelCase(input.workflowName)
	const workflowIdentifier = workflowIdentifierBase.endsWith('Workflow')
		? workflowIdentifierBase
		: `${workflowIdentifierBase}Workflow`
	const workflowId = snakeCase(input.workflowName)
	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const harnessName = `${camelCase(input.serviceName)}Harness`
	const policyName = `${camelCase(input.serviceName)}HarnessPolicy`
	const harnessDirectory = join(projectPath, sourceRoot, 'harness', serviceDirName)
	const workflowDirectory = join(harnessDirectory, 'workflow', workflowDirName)
	const workflowFile = join(workflowDirectory, `${workflowDirName}Workflow.ts`)
	const definitionFile = join(harnessDirectory, `${serviceDirName}Harness.ts`)
	const mountDirectory = join(projectPath, serviceBasePath, input.serviceName, `v${input.serviceVersion}`, 'harness')
	const mountFile = join(mountDirectory, `${serviceDirName}HarnessMount.ts`)

	if (existsSync(workflowDirectory)) {
		throw new Error(
			`Workflow "${input.workflowName}" already exists for ${input.serviceName} v${input.serviceVersion}.`,
		)
	}

	await mkdir(workflowDirectory, { recursive: true })
	await mkdir(mountDirectory, { recursive: true })
	await writeFile(
		workflowFile,
		getHarnessWorkflowModuleFileContent({
			serviceName: input.serviceName,
			workflowName: input.workflowName,
			workflowDescription: input.workflowDescription,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	await writeFile(
		join(workflowDirectory, `${workflowDirName}Workflow.test.ts`),
		getHarnessWorkflowTestFileContent({
			workflowName: input.workflowName,
			workflowImportName: importSpecifier(workflowDirectory, workflowFile),
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	if (existsSync(definitionFile)) {
		await addModuleToHarness({
			harnessFile: definitionFile,
			moduleFile: workflowFile,
			moduleIdentifier: workflowIdentifier,
			harnessName,
		})
	} else {
		await writeFile(
			definitionFile,
			getWorkflowHarnessFileContent({
				serviceName: input.serviceName,
				workflowIdentifier,
				workflowImportName: importSpecifier(harnessDirectory, workflowFile),
				codeWriterOptions: input.codeWriterOptions,
			}),
		)
	}

	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined
	if (existsSync(mountFile)) {
		await addTargetToMountPolicy({
			mountFile,
			policyName,
			kind: 'workflows',
			targetId: workflowId,
			successEventName,
		})
	} else {
		await writeFile(
			mountFile,
			getWorkflowHarnessMountFileContent({
				serviceName: input.serviceName,
				workflowName: input.workflowName,
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

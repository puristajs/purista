import { mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { addPuristaCommand } from '../api/addPuristaCommand.js'
import { addPuristaService } from '../api/addPuristaService.js'
import { getFormatConfig } from '../api/getFormatConfig.js'
import { loadPuristaConfig } from '../api/loadPuristaConfig.js'
import { scanPuristaProject } from '../api/scanPuristaProject.js'
import type { ProjectGenerationPlan } from './types.js'

const writePlannedFile = async (targetDirectoryPath: string, relativePath: string, content: string) => {
	const absolutePath = join(targetDirectoryPath, relativePath)
	await mkdir(dirname(absolutePath), { recursive: true })
	await writeFile(absolutePath, content, 'utf-8')
}

const writePlannedSymlink = async (targetDirectoryPath: string, relativePath: string, target: string) => {
	const absolutePath = join(targetDirectoryPath, relativePath)
	await mkdir(dirname(absolutePath), { recursive: true })
	await rm(absolutePath, { force: true, recursive: true })
	await symlink(target, absolutePath, 'dir')
}

const materializeExampleService = async (plan: ProjectGenerationPlan) => {
	for (const step of plan.generatorSteps) {
		if (step.type !== 'example-service') {
			continue
		}

		const puristaConfig = await loadPuristaConfig(plan.targetDirectoryPath)
		const { codeWriterOptions } = await getFormatConfig(plan.targetDirectoryPath)
		const projectAfterBase = await scanPuristaProject(puristaConfig, plan.targetDirectoryPath)

		await addPuristaService({
			projectRootPath: plan.targetDirectoryPath,
			puristaConfig,
			puristaProject: projectAfterBase,
			serviceDescription: step.serviceDescription,
			serviceName: step.serviceName,
			serviceVersion: step.serviceVersion,
			includeMetricExample: step.includeMetricExample,
			codeWriterOptions,
		})

		const projectAfterService = await scanPuristaProject(puristaConfig, plan.targetDirectoryPath)
		await addPuristaCommand({
			projectRootPath: plan.targetDirectoryPath,
			puristaConfig,
			puristaProject: projectAfterService,
			commandDescription: step.commandDescription,
			commandName: step.commandName,
			serviceName: step.serviceName,
			serviceVersion: step.serviceVersion,
			codeWriterOptions,
		})
	}
}

/**
 * Write all files from a generation plan and run deferred generator steps.
 *
 * Returns absolute paths for the files predicted by `planProjectGeneration`.
 */
export const materializeProjectGeneration = async (plan: ProjectGenerationPlan) => {
	await mkdir(plan.targetDirectoryPath, { recursive: true })

	for (const file of plan.files) {
		if (file.type === 'symlink') {
			await writePlannedSymlink(plan.targetDirectoryPath, file.path, file.target)
			continue
		}

		await writePlannedFile(plan.targetDirectoryPath, file.path, file.content)
	}

	await materializeExampleService(plan)

	return {
		targetDirectoryPath: plan.targetDirectoryPath,
		files: plan.predictedFiles.map(relativePath => join(plan.targetDirectoryPath, relativePath)),
	}
}

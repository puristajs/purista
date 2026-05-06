import { mkdir, writeFile } from 'node:fs/promises'
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

export const materializeProjectGeneration = async (plan: ProjectGenerationPlan) => {
	await mkdir(plan.targetDirectoryPath, { recursive: true })

	for (const file of plan.files) {
		await writePlannedFile(plan.targetDirectoryPath, file.path, file.content)
	}

	await materializeExampleService(plan)

	return {
		targetDirectoryPath: plan.targetDirectoryPath,
		files: plan.predictedFiles.map(relativePath => join(plan.targetDirectoryPath, relativePath)),
	}
}

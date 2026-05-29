import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Options } from 'code-block-writer'
import { camelCase } from './change-case.js'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { ensureQueueCollections } from './content/manipulation/ensureQueueCollections.js'
import { getQueueWorkerBuilderFileContent } from './content/queueWorker/getQueueWorkerBuilderFileContent.js'
import { getQueueWorkerTestFileContent } from './content/queueWorker/getQueueWorkerTestFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/** Input for generating an additional worker for an existing queue. */
export type AddPuristaQueueWorkerInput = {
	/** Project root path; defaults to `process.cwd()`. */
	projectRootPath?: string
	/** PURISTA project configuration controlling generated paths and casing. */
	puristaConfig: PuristaConfig
	/** Discovered project metadata used to update the service composition. */
	puristaProject: PuristaProjectInfo
	/** Service name that owns the target queue. */
	serviceName: string
	/** Service version that owns the target queue. */
	serviceVersion: string
	/** Existing queue name the worker handles. */
	queueName: string
	/** Logical worker name. */
	workerName: string
	/** Human-readable worker description written into generated docs and tests. */
	workerDescription: string
	/** Queue worker scheduling mode. */
	mode: 'continuous' | 'interval' | 'sequential'
	/** Interval in milliseconds when `mode` is `interval`. */
	intervalMs?: number
	/** Maximum number of jobs handled concurrently. */
	maxParallelHandlers: number
	/** Optional formatting options passed to `code-block-writer`. */
	codeWriterOptions?: Partial<Options>
}

/**
 * Add a queue worker for an existing service queue.
 *
 * Generates a queue worker builder/test pair and appends the worker definition
 * to the service composition file.
 */
export const addPuristaQueueWorker = async (input: AddPuristaQueueWorkerInput) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const serviceDirName = convertToProjectFileCasing(input.serviceName, input.puristaConfig)
	const serviceVersionPath = join(
		projectPath,
		input.puristaConfig.servicePath,
		serviceDirName,
		`v${input.serviceVersion}`,
	)

	const queueDirName = convertToProjectFileCasing(input.queueName, input.puristaConfig)
	const queuePath = join(serviceVersionPath, 'queue', queueDirName)
	if (!existsSync(queuePath)) {
		throw new Error(
			`Queue "${input.queueName}" does not exist for service ${input.serviceName} v${input.serviceVersion}. Create the queue first.`,
		)
	}

	const workerDirName = convertToProjectFileCasing(input.workerName, input.puristaConfig)
	const workerPath = join(serviceVersionPath, 'queue-worker', workerDirName)
	await mkdir(workerPath, { recursive: true })

	const serviceEntry = input.puristaProject.services[serviceDirName]?.[input.serviceVersion]
	if (!serviceEntry) {
		throw new Error(`Service ${input.serviceName} v${input.serviceVersion} not found in project metadata.`)
	}

	const queueWorkerBuilderFileName = convertToProjectFileCasing(
		`${input.workerName} queue worker builder`,
		input.puristaConfig,
	)
	const queueWorkerBuilderFilePath = join(workerPath, `${queueWorkerBuilderFileName}.ts`)
	const queueWorkerTestFilePath = join(workerPath, `${queueWorkerBuilderFileName}.test.ts`)

	await writeFile(
		queueWorkerBuilderFilePath,
		getQueueWorkerBuilderFileContent({
			...input,
			mode: input.mode,
		}),
		'utf-8',
	)
	await writeFile(
		queueWorkerTestFilePath,
		getQueueWorkerTestFileContent({
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			workerName: input.workerName,
			queueName: input.queueName,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
		'utf-8',
	)

	const serviceFile = join(projectPath, input.puristaConfig.servicePath, serviceEntry.serviceFile)

	await ensureQueueCollections({
		serviceFile,
		serviceName: input.serviceName,
		serviceVersion: input.serviceVersion,
		puristaConfig: input.puristaConfig,
	})

	await addDefinitionToBuilder({
		arrayName: 'queueWorkerDefinitions',
		serviceFile,
		importFile: `./queue-worker/${workerDirName}/${queueWorkerBuilderFileName}.ts`,
		importDefinition: camelCase(`${input.workerName} queue worker builder`),
	})
}

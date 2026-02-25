import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Options } from 'code-block-writer'
import { camelCase } from './change-case.js'
import { addPuristaCommand } from './addPuristaCommand.js'
import { addPuristaQueueWorker } from './addPuristaQueueWorker.js'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { ensureQueueCollections } from './content/manipulation/ensureQueueCollections.js'
import { ensureServiceEvent } from './content/manipulation/ensureServiceEvent.js'
import { getQueueBuilderFileContent } from './content/queue/getQueueBuilderFileContent.js'
import { getQueueSchemaFileContent } from './content/queue/getQueueSchemaFileContent.js'
import { getQueueTestFileContent } from './content/queue/getQueueTestFileContent.js'
import { getQueueTypeFileContent } from './content/queue/getQueueTypeFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

export type QueueProducerOptions = {
	commandName: string
	commandDescription: string
	responseEventName?: string
}

export type QueueWorkerOptions = {
	name: string
	description: string
	mode: 'continuous' | 'interval' | 'sequential'
	intervalMs?: number
	maxParallelHandlers: number
}

export type AddPuristaQueueInput = {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	serviceName: string
	serviceVersion: string
	queueName: string
	queueDescription: string
	worker: QueueWorkerOptions
	producer?: QueueProducerOptions
	codeWriterOptions?: Partial<Options>
}

export const addPuristaQueue = async (input: AddPuristaQueueInput) => {
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
	if (existsSync(queuePath)) {
		throw new Error(
			`Queue "${input.queueName}" already exists for service ${input.serviceName} v${input.serviceVersion}.`,
		)
	}

	await mkdir(queuePath, { recursive: true })

	const serviceEntry = input.puristaProject.services[serviceDirName]?.[input.serviceVersion]
	if (!serviceEntry) {
		throw new Error(`Service ${input.serviceName} v${input.serviceVersion} not found in project metadata.`)
	}

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.queueName} queue`)

	await writeFile(
		join(queuePath, 'schema.ts'),
		getQueueSchemaFileContent({
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			queueName: input.queueName,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
		'utf-8',
	)

	await writeFile(
		join(queuePath, 'types.ts'),
		getQueueTypeFileContent({
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			queueName: input.queueName,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
		'utf-8',
	)

	const queueBuilderFileName = convertToProjectFileCasing(`${input.queueName} queue builder`, input.puristaConfig)
	await writeFile(
		join(queuePath, `${queueBuilderFileName}.ts`),
		getQueueBuilderFileContent({
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			queueName: input.queueName,
			queueDescription: input.queueDescription,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
		'utf-8',
	)

	await writeFile(
		join(queuePath, `${queueBuilderFileName}.test.ts`),
		getQueueTestFileContent({
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
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
		arrayName: 'queueDefinitions',
		serviceFile,
		importFile: `./queue/${queueDirName}/${queueBuilderFileName}.ts`,
		importDefinition: camelCase(`${input.queueName} queue builder`),
	})

	await addPuristaQueueWorker({
		projectRootPath: projectPath,
		puristaConfig: input.puristaConfig,
		puristaProject: input.puristaProject,
		serviceName: input.serviceName,
		serviceVersion: input.serviceVersion,
		queueName: input.queueName,
		workerName: input.worker.name,
		workerDescription: input.worker.description,
		mode: input.worker.mode,
		intervalMs: input.worker.intervalMs,
		maxParallelHandlers: input.worker.maxParallelHandlers,
		codeWriterOptions: input.codeWriterOptions,
	})

	if (input.producer) {
		if (input.producer.responseEventName?.trim().length) {
			const description = `Emitted by ${input.serviceName} v${input.serviceVersion} command ${camelCase(
				input.producer.commandName,
			)}:\n${input.producer.commandDescription}`

			await ensureServiceEvent({
				projectRootPath: projectPath,
				puristaProjectConfig: input.puristaConfig,
				puristaProject: input.puristaProject,
				eventName: input.producer.responseEventName,
				description,
			})
		}

		await addPuristaCommand({
			projectRootPath: projectPath,
			puristaConfig: input.puristaConfig,
			puristaProject: input.puristaProject,
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			commandName: input.producer.commandName,
			commandDescription: input.producer.commandDescription,
			responseEventName: input.producer.responseEventName,
			codeWriterOptions: input.codeWriterOptions,
			enqueues: [
				{
					queueName: camelCase(input.queueName),
					schemaFilePath: join(queuePath, 'schema.ts'),
					payloadSchemaExportName: `${schemaPrefix}PayloadSchema`,
					parameterSchemaExportName: `${schemaPrefix}ParameterSchema`,
				},
			],
		})
	}
}

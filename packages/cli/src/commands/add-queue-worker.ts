import { join } from 'node:path'
import { z } from 'zod'
import { addPuristaQueueWorker } from '../api/addPuristaQueueWorker.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import { baseAddInputSchema, captureMutationSnapshot, createIssuesFromZod, createPendingResolution, createResult, getQueueChoices, getServiceBasePath, getServiceChoices, getServiceVersionChoices, queueWorkerModeChoices, requireProjectContext, requirePuristaConfig } from './shared.js'

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	queueName: z.string().trim().min(1),
	workerMode: z.enum(['continuous', 'interval', 'sequential']).default('continuous'),
	intervalMs: z.coerce.number().int().positive().optional(),
	maxParallelHandlers: z.coerce.number().int().positive().default(1),
})

export type AddQueueWorkerInput = z.input<typeof schema>

export const addQueueWorkerCommand: PuristaExecutableCommand<AddQueueWorkerInput, z.infer<typeof schema>> = {
	id: 'add-queue-worker',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddQueueWorkerInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim()) missing.push({ type: 'input', key: 'name', message: 'Name of the queue worker', required: true } as const)
		if (!input.description?.trim())
			missing.push({ type: 'input', key: 'description', message: 'Description of the queue worker', required: true } as const)
		if (!input.serviceName?.trim())
			missing.push({ type: 'select', key: 'serviceName', message: 'What service do you want to use?', choices: getServiceChoices(projectSnapshot) } as const)
		if (!input.serviceVersion?.trim())
			missing.push({
				type: 'select',
				key: 'serviceVersion',
				message: `Choose the version of service ${input.serviceName ?? ''}`.trim(),
				choices: getServiceVersionChoices(projectSnapshot, input.serviceName),
			} as const)
		if (!input.queueName?.trim())
			missing.push({
				type: 'select',
				key: 'queueName',
				message: 'Select the queue to attach a worker to',
				choices: getQueueChoices(projectSnapshot, input.serviceName, input.serviceVersion),
			} as const)
		if (!input.workerMode?.trim())
			missing.push({ type: 'select', key: 'workerMode', message: 'Select worker mode', choices: queueWorkerModeChoices } as const)
		if (input.workerMode === 'interval' && !input.intervalMs) {
			missing.push({
				type: 'input',
				key: 'intervalMs',
				message: 'Interval in milliseconds',
				defaultValue: '60000',
				required: true,
				validate: (value: string) => (Number.parseInt(value, 10) > 0 ? true : 'Enter a positive integer'),
			} as const)
		}
		if (!input.maxParallelHandlers) {
			missing.push({
				type: 'input',
				key: 'maxParallelHandlers',
				message: 'Max parallel handlers',
				defaultValue: '1',
				required: true,
				validate: (value: string) => (Number.parseInt(value, 10) > 0 ? true : 'Enter a positive integer'),
			} as const)
		}

		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution('add-queue-worker', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-queue-worker', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		const mutationSnapshot = captureMutationSnapshot([
			join(getServiceBasePath(context, resolvedInput.serviceName, resolvedInput.serviceVersion), 'queue-worker'),
		])
		await addPuristaQueueWorker({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			queueName: resolvedInput.queueName,
			workerName: resolvedInput.name,
			workerDescription: resolvedInput.description,
			mode: resolvedInput.workerMode,
			intervalMs: resolvedInput.intervalMs,
			maxParallelHandlers: resolvedInput.maxParallelHandlers,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-queue-worker', context.mode, mutationSnapshot)
	},
}

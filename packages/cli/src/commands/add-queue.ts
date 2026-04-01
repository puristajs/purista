import { join } from 'node:path'
import { z } from 'zod'
import { addPuristaQueue } from '../api/addPuristaQueue.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import { baseAddInputSchema, captureMutationSnapshot, createIssuesFromZod, createPendingResolution, createResult, getServiceBasePath, getServiceChoices, getServiceVersionChoices, nonEmptyOptionalStringSchema, queueWorkerModeChoices, requireProjectContext, requirePuristaConfig } from './shared.js'

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	workerName: z.string().trim().min(1),
	workerDescription: z.string().trim().min(1),
	workerMode: z.enum(['continuous', 'interval', 'sequential']).default('continuous'),
	intervalMs: z.coerce.number().int().positive().optional(),
	maxParallelHandlers: z.coerce.number().int().positive().default(1),
	createProducer: z.coerce.boolean().default(true),
	producerCommandName: nonEmptyOptionalStringSchema,
	producerCommandDescription: nonEmptyOptionalStringSchema,
	producerResponseEventName: nonEmptyOptionalStringSchema,
})

export type AddQueueInput = z.input<typeof schema>

export const addQueueCommand: PuristaExecutableCommand<AddQueueInput, z.infer<typeof schema>> = {
	id: 'add-queue',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddQueueInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim()) missing.push({ type: 'input', key: 'name', message: 'Name of the queue', required: true } as const)
		if (!input.description?.trim())
			missing.push({ type: 'input', key: 'description', message: 'Description of the queue', required: true } as const)
		if (!input.serviceName?.trim())
			missing.push({ type: 'select', key: 'serviceName', message: 'What service do you want to use?', choices: getServiceChoices(projectSnapshot) } as const)
		if (!input.serviceVersion?.trim())
			missing.push({
				type: 'select',
				key: 'serviceVersion',
				message: `Choose the version of service ${input.serviceName ?? ''}`.trim(),
				choices: getServiceVersionChoices(projectSnapshot, input.serviceName),
			} as const)
		if (!input.workerName?.trim())
			missing.push({ type: 'input', key: 'workerName', message: 'Name of the queue worker', defaultValue: input.name ? `${input.name} worker` : undefined } as const)
		if (!input.workerDescription?.trim())
			missing.push({
				type: 'input',
				key: 'workerDescription',
				message: 'Description of the queue worker',
				defaultValue: input.description,
			} as const)
		if (!input.workerMode?.trim())
			missing.push({ type: 'select', key: 'workerMode', message: 'Select worker mode', choices: queueWorkerModeChoices, defaultValue: 'continuous' } as const)
		if (input.workerMode === 'interval' && !input.intervalMs)
			missing.push({
				type: 'input',
				key: 'intervalMs',
				message: 'Interval in milliseconds',
				defaultValue: '60000',
				required: true,
				validate: (value: string) => (Number.parseInt(value, 10) > 0 ? true : 'Enter a positive integer'),
			} as const)
		if (!input.maxParallelHandlers)
			missing.push({
				type: 'input',
				key: 'maxParallelHandlers',
				message: 'Max parallel handlers',
				defaultValue: '1',
				required: true,
				validate: (value: string) => (Number.parseInt(value, 10) > 0 ? true : 'Enter a positive integer'),
			} as const)
		if (typeof input.createProducer !== 'boolean')
			missing.push({ type: 'confirm', key: 'createProducer', message: 'Create a producer command that enqueues jobs?', defaultValue: true } as const)
		if (input.createProducer && !input.producerCommandName?.trim())
			missing.push({
				type: 'input',
				key: 'producerCommandName',
				message: 'Name of the producer command',
				defaultValue: input.name ? `${input.name} producer` : undefined,
				required: true,
			} as const)
		if (input.createProducer && !input.producerCommandDescription?.trim())
			missing.push({ type: 'input', key: 'producerCommandDescription', message: 'Description of the producer command', required: true } as const)

		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution('add-queue', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-queue', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		const mutationSnapshot = captureMutationSnapshot([
			join(getServiceBasePath(context, resolvedInput.serviceName, resolvedInput.serviceVersion), 'queue'),
		])
		await addPuristaQueue({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			queueName: resolvedInput.name,
			queueDescription: resolvedInput.description,
			worker: {
				name: resolvedInput.workerName,
				description: resolvedInput.workerDescription,
				mode: resolvedInput.workerMode,
				intervalMs: resolvedInput.intervalMs,
				maxParallelHandlers: resolvedInput.maxParallelHandlers,
			},
			producer: resolvedInput.createProducer
				? {
						commandName: resolvedInput.producerCommandName ?? `${resolvedInput.name} producer`,
						commandDescription: resolvedInput.producerCommandDescription ?? resolvedInput.description,
						responseEventName: resolvedInput.producerResponseEventName,
					}
				: undefined,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-queue', context.mode, mutationSnapshot)
	},
}

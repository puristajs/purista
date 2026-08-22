import { join } from 'node:path'
import { z } from 'zod'
import { addPuristaSchedule } from '../api/addPuristaSchedule.js'
import { ensureServiceEvent } from '../api/content/manipulation/ensureServiceEvent.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import {
	baseAddInputSchema,
	captureMutationSnapshot,
	createIssuesFromZod,
	createPendingResolution,
	createResult,
	getServiceBasePath,
	getServiceChoices,
	getServiceVersionChoices,
	nonEmptyOptionalStringSchema,
	requireProjectContext,
	requirePuristaConfig,
} from './shared.js'

const schedulePolicySchema = z.enum(['skip', 'runOnce', 'backfill'])

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	eventToEmit: z.string().trim().min(1),
	cronExpression: z
		.string()
		.trim()
		.refine(value => value.split(/\s+/).length === 5, 'Cron expressions must contain exactly five fields.'),
	timezone: nonEmptyOptionalStringSchema,
	schedulerGroup: nonEmptyOptionalStringSchema,
	missedRunPolicy: schedulePolicySchema.optional(),
	enabledByDefault: z.boolean().optional(),
})

export type AddScheduleInput = z.input<typeof schema>

/** Add a schedule declaration that publishes a regular PURISTA custom event. */
export const addScheduleCommand: PuristaExecutableCommand<AddScheduleInput, z.infer<typeof schema>> = {
	id: 'add-schedule',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddScheduleInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the schedule', required: true } as const)
		if (!input.description?.trim())
			missing.push({
				type: 'input',
				key: 'description',
				message: 'Description of the schedule',
				required: true,
			} as const)
		if (!input.serviceName?.trim())
			missing.push({
				type: 'select',
				key: 'serviceName',
				message: 'What service owns this schedule contract?',
				choices: getServiceChoices(projectSnapshot),
			} as const)
		if (!input.serviceVersion?.trim())
			missing.push({
				type: 'select',
				key: 'serviceVersion',
				message: `Choose the version of service ${input.serviceName ?? ''}`.trim(),
				choices: getServiceVersionChoices(projectSnapshot, input.serviceName),
			} as const)
		if (!input.eventToEmit?.trim())
			missing.push({
				type: 'input',
				key: 'eventToEmit',
				message: 'Event emitted by the Scheduler Runtime',
				required: true,
			} as const)
		if (!input.cronExpression?.trim())
			missing.push({
				type: 'input',
				key: 'cronExpression',
				message: 'Five-field cron expression (for example: 0 2 * * *)',
				required: true,
			} as const)

		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution('add-schedule', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-schedule', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		await ensureServiceEvent({
			projectRootPath: context.cwd,
			puristaProjectConfig: puristaConfig,
			puristaProject: projectSnapshot,
			eventName: resolvedInput.eventToEmit,
			description: `Emitted by the Scheduler Runtime for ${resolvedInput.serviceName} v${resolvedInput.serviceVersion} schedule ${resolvedInput.name}:\n${resolvedInput.description}`,
		})

		const mutationSnapshot = captureMutationSnapshot([
			join(getServiceBasePath(context, resolvedInput.serviceName, resolvedInput.serviceVersion), 'schedule'),
		])
		await addPuristaSchedule({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			scheduleName: resolvedInput.name,
			scheduleDescription: resolvedInput.description,
			eventName: resolvedInput.eventToEmit,
			cronExpression: resolvedInput.cronExpression,
			timezone: resolvedInput.timezone,
			schedulerGroup: resolvedInput.schedulerGroup,
			missedRunPolicy: resolvedInput.missedRunPolicy,
			enabledByDefault: resolvedInput.enabledByDefault,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-schedule', context.mode, mutationSnapshot)
	},
}

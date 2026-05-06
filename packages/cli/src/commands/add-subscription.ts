import { join } from 'node:path'
import { z } from 'zod'
import { addPuristaSubscription } from '../api/addPuristaSubscription.js'
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

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	eventToSubscribe: z.string().trim().min(1),
	responseEventName: nonEmptyOptionalStringSchema,
})

export type AddSubscriptionInput = z.input<typeof schema>

export const addSubscriptionCommand: PuristaExecutableCommand<AddSubscriptionInput, z.infer<typeof schema>> = {
	id: 'add-subscription',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddSubscriptionInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the subscription', required: true } as const)
		if (!input.description?.trim())
			missing.push({
				type: 'input',
				key: 'description',
				message: 'Description of the subscription',
				required: true,
			} as const)
		if (!input.serviceName?.trim())
			missing.push({
				type: 'select',
				key: 'serviceName',
				message: 'What service do you want to use?',
				choices: getServiceChoices(projectSnapshot),
			} as const)
		if (!input.serviceVersion?.trim())
			missing.push({
				type: 'select',
				key: 'serviceVersion',
				message: `Choose the version of service ${input.serviceName ?? ''}`.trim(),
				choices: getServiceVersionChoices(projectSnapshot, input.serviceName),
			} as const)
		if (!input.eventToSubscribe?.trim())
			missing.push({
				type: 'select',
				key: 'eventToSubscribe',
				message: 'What event do you want to subscribe?',
				choices: projectSnapshot.eventNames,
			} as const)

		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution('add-subscription', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-subscription', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		if (resolvedInput.responseEventName) {
			await ensureServiceEvent({
				projectRootPath: context.cwd,
				puristaProjectConfig: puristaConfig,
				puristaProject: projectSnapshot,
				eventName: resolvedInput.responseEventName,
				description: `Emitted by ${resolvedInput.serviceName} v${resolvedInput.serviceVersion} subscription ${resolvedInput.name}:\n${resolvedInput.description}`,
			})
		}

		const mutationSnapshot = captureMutationSnapshot([
			join(getServiceBasePath(context, resolvedInput.serviceName, resolvedInput.serviceVersion), 'subscription'),
		])
		await addPuristaSubscription({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			subscriptionName: resolvedInput.name,
			subscriptionDescription: resolvedInput.description,
			eventToSubscribe: resolvedInput.eventToSubscribe,
			responseEventName: resolvedInput.responseEventName,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-subscription', context.mode, mutationSnapshot)
	},
}

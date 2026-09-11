import { z } from 'zod'
import { addPuristaAgent } from '../api/addPuristaAgent.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import {
	baseAddInputSchema,
	createIssuesFromZod,
	createPendingResolution,
	createResult,
	getServiceChoices,
	getServiceVersionChoices,
	requireProjectContext,
	requirePuristaConfig,
} from './shared.js'

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	modelAlias: z
		.string()
		.trim()
		.regex(/^[a-z][A-Za-z0-9]{0,63}$/, 'Model alias must be lower camel case with at most 64 ASCII letters or digits.'),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	http: z.enum(['none', 'command', 'stream']).default('none'),
	responseEventName: z.never().optional(),
})

export type AddAgentInput = z.input<typeof schema>

export const addAgentCommand: PuristaExecutableCommand<AddAgentInput, z.infer<typeof schema>> = {
	id: 'add-agent',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddAgentInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the agent', required: true } as const)
		if (!input.description?.trim())
			missing.push({ type: 'input', key: 'description', message: 'Description of the agent', required: true } as const)
		if (!input.modelAlias?.trim())
			missing.push({
				type: 'input',
				key: 'modelAlias',
				message: 'Model alias for the agent (for example chat)',
				required: true,
				validate: (value: string) =>
					/^[a-z][A-Za-z0-9]{0,63}$/.test(value)
						? true
						: 'Use lower camel case with at most 64 ASCII letters or digits.',
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

		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution('add-agent', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-agent', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		const mutationSnapshot = await addPuristaAgent({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			agentName: resolvedInput.name,
			agentDescription: resolvedInput.description,
			modelAlias: resolvedInput.modelAlias,
			codeWriterOptions: context.codeWriterOptions,
			http: resolvedInput.http,
		})

		return createResult('add-agent', context.mode, mutationSnapshot, [
			...mutationSnapshot.warnings,
			...(resolvedInput.http === 'none'
				? []
				: ['Configure the Hono server with setProtectMiddleware(...) before starting the generated HTTP endpoint.']),
		])
	},
}

import { z } from 'zod'
import { addPuristaMcp } from '../api/addPuristaMcp.js'
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
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	toolName: z.string().trim().min(1),
	remoteName: z
		.string()
		.min(1)
		.refine(value => value === value.trim(), { message: 'Remote MCP tool names must be provided exactly.' }),
	responseEventName: z.never().optional(),
})

export type AddMcpInput = z.input<typeof schema>

export const addMcpCommand: PuristaExecutableCommand<AddMcpInput, z.infer<typeof schema>> = {
	id: 'add-mcp',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddMcpInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the MCP server', required: true } as const)
		if (!input.description?.trim())
			missing.push({
				type: 'input',
				key: 'description',
				message: 'Description of the MCP tool',
				required: true,
			} as const)
		if (!input.toolName?.trim())
			missing.push({ type: 'input', key: 'toolName', message: 'Local MCP tool name', required: true } as const)
		if (!input.remoteName?.trim())
			missing.push({ type: 'input', key: 'remoteName', message: 'Exact remote MCP tool name', required: true } as const)
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
		if (!parsed.success) return createPendingResolution('add-mcp', input, missing, createIssuesFromZod(parsed.error))
		return createPendingResolution('add-mcp', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const mutations = await addPuristaMcp({
			projectRootPath: context.cwd,
			puristaConfig: requirePuristaConfig(context),
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			mcpName: resolvedInput.name,
			mcpDescription: resolvedInput.description,
			toolName: resolvedInput.toolName,
			remoteName: resolvedInput.remoteName,
			codeWriterOptions: context.codeWriterOptions,
		})
		return createResult('add-mcp', context.mode, mutations, [mutations.guidance])
	},
}

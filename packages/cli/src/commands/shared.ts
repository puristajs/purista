import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { PuristaCliValidationError } from '../core/errors.js'
import type { PuristaCommandContext } from '../core/command.js'
import type { PromptAnswerMap, PromptRequest, PuristaCommandIssue, PuristaCommandResolution, PuristaCommandResult } from '../core/types.js'
import { convertToProjectFileCasing } from '../api/convertToProjectFileCasing.js'
import type { ProjectSnapshot } from '../project/createProjectSnapshot.js'

export const nonEmptyOptionalStringSchema = z
	.string()
	.trim()
	.transform(value => (value.length ? value : undefined))
	.optional()

export const baseAddInputSchema = z.object({
	name: z.string().trim().optional(),
	description: z.string().trim().optional(),
	serviceName: z.string().trim().optional(),
	serviceVersion: z.string().trim().optional(),
	responseEventName: nonEmptyOptionalStringSchema,
})

export const queueWorkerModeChoices = [
	{ name: 'continuous', value: 'continuous' as const },
	{ name: 'interval', value: 'interval' as const },
	{ name: 'sequential', value: 'sequential' as const },
]

export const createIssuesFromZod = (error: z.ZodError): PuristaCommandIssue[] =>
	error.issues.map(issue => ({
		code: issue.code,
		message: issue.message,
		path: issue.path.map(entry => String(entry)),
	}))

export const requireProjectContext = (context: PuristaCommandContext): { projectSnapshot: ProjectSnapshot } => {
	if (!context.projectSnapshot) {
		throw new PuristaCliValidationError('No project snapshot loaded for command execution.')
	}

	return { projectSnapshot: context.projectSnapshot }
}

export const requirePuristaConfig = (context: PuristaCommandContext) => {
	if (!context.puristaConfig) {
		throw new PuristaCliValidationError('No purista.json configuration loaded for command execution.')
	}

	return context.puristaConfig
}

export const createPendingResolution = <TInput, TResolved>(
	command: PuristaCommandResolution<TInput, TResolved>['command'],
	input: TInput,
	missing: PromptRequest[],
	errors: PuristaCommandIssue[] = [],
	warnings: string[] = [],
	resolvedInput?: TResolved,
): PuristaCommandResolution<TInput, TResolved> => ({
	command,
	input,
	missing,
	errors,
	warnings,
	resolvedInput,
})

export const askForMissingValues = async <TInput extends Record<string, unknown>>(
	input: TInput,
	missing: PromptRequest[],
	context: PuristaCommandContext,
) => {
	const answers: PromptAnswerMap = {}
	for (const prompt of missing) {
		if (prompt.type === 'input') {
			answers[prompt.key] = await context.prompt.input(prompt)
		}
		if (prompt.type === 'confirm') {
			answers[prompt.key] = await context.prompt.confirm(prompt)
		}
		if (prompt.type === 'select') {
			answers[prompt.key] = await context.prompt.select(prompt)
		}
	}

	return { ...input, ...answers } as TInput
}

export const getServiceChoices = (snapshot: ProjectSnapshot) =>
	Object.keys(snapshot.services)
		.sort()
		.map(serviceName => ({ name: serviceName, value: serviceName }))

export const getServiceVersionChoices = (snapshot: ProjectSnapshot, serviceName?: string) => {
	if (!serviceName || !snapshot.services[serviceName]) {
		return []
	}

	return Object.keys(snapshot.services[serviceName])
		.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
		.map(serviceVersion => ({ name: serviceVersion, value: serviceVersion }))
}

export const getQueueChoices = (snapshot: ProjectSnapshot, serviceName?: string, serviceVersion?: string) => {
	if (!serviceName || !serviceVersion) {
		return []
	}
	return (snapshot.services[serviceName]?.[serviceVersion]?.queues ?? [])
		.sort()
		.map(queueName => ({ name: queueName, value: queueName }))
}

export const classifyMutations = (paths: string[]) => {
	const createdFiles: string[] = []
	const updatedFiles: string[] = []
	for (const filePath of paths) {
		if (existsSync(filePath)) {
			updatedFiles.push(filePath)
		} else {
			createdFiles.push(filePath)
		}
	}

	return { createdFiles, updatedFiles }
}

export const captureMutationSnapshot = (paths: string[]) => classifyMutations(paths)

export const createResult = (
	command: PuristaCommandResult['command'],
	mode: PuristaCommandResult['mode'],
	pathsOrSnapshot: string[] | { createdFiles: string[]; updatedFiles: string[] },
	warnings: string[] = [],
	errors: PuristaCommandIssue[] = [],
): PuristaCommandResult => {
	const mutations = Array.isArray(pathsOrSnapshot) ? classifyMutations(pathsOrSnapshot) : pathsOrSnapshot
	return {
		ok: errors.length === 0,
		command,
		mode,
		createdFiles: mutations.createdFiles,
		updatedFiles: mutations.updatedFiles,
		warnings,
		errors,
	}
}

export const getServiceBasePath = (context: PuristaCommandContext, serviceName: string, serviceVersion: string) => {
	const puristaConfig = requirePuristaConfig(context)
	return join(
		context.cwd,
		puristaConfig.servicePath,
		convertToProjectFileCasing(serviceName, puristaConfig),
		`v${serviceVersion}`,
	)
}

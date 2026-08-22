import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join } from 'node:path'

import { createArchitectureManifest, validateArchitectureManifest } from '@purista/core/adapter'
import { z } from 'zod'
import type { PuristaExecutableCommand } from '../core/command.js'
import { captureMutationSnapshot, createIssuesFromZod, createPendingResolution, createResult } from './shared.js'

const inputSchema = z.object({
	definitions: z.string().trim().default('purista.definitions.json'),
	out: z.string().trim().optional(),
	strict: z.boolean().optional().default(false),
	includeSchemas: z.boolean().optional().default(false),
	format: z.enum(['json']).optional().default('json'),
})

type ArchitectureCommandInput = z.input<typeof inputSchema>
type ArchitectureCommandResolved = z.output<typeof inputSchema>

const resolvePath = (cwd: string, filePath: string) => (isAbsolute(filePath) ? filePath : join(cwd, filePath))

const resolveArchitectureInput = async (
	command: 'inspect' | 'validate' | 'doctor',
	input: ArchitectureCommandInput,
) => {
	const parsed = inputSchema.safeParse(input)
	if (!parsed.success) {
		return createPendingResolution<ArchitectureCommandInput, ArchitectureCommandResolved>(
			command,
			input,
			[],
			createIssuesFromZod(parsed.error),
		)
	}
	return createPendingResolution<ArchitectureCommandInput, ArchitectureCommandResolved>(
		command,
		input,
		[],
		[],
		[],
		parsed.data,
	)
}

const loadManifest = async (input: ArchitectureCommandResolved, cwd: string) => {
	const source = JSON.parse(await readFile(resolvePath(cwd, input.definitions), 'utf-8'))
	return createArchitectureManifest({ services: source, includeSchemas: input.includeSchemas })
}

const writeJsonFile = async (filePath: string, value: unknown) => {
	await mkdir(dirname(filePath), { recursive: true })
	await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8')
}

const issueFromDiagnostic = (diagnostic: Awaited<ReturnType<typeof validateArchitectureManifest>>[number]) => ({
	code: diagnostic.code,
	message: `${diagnostic.message} Remediation: ${diagnostic.remediation}`,
	path: diagnostic.location ? [diagnostic.location.pointer] : undefined,
})

export const inspectArchitectureCommand: PuristaExecutableCommand<
	ArchitectureCommandInput,
	ArchitectureCommandResolved
> = {
	id: 'inspect',
	resolve: input => resolveArchitectureInput('inspect', input),
	execute: async (input, context) => {
		const manifest = await loadManifest(input, context.cwd)
		if (!input.out) {
			return { ...createResult('inspect', context.mode, { createdFiles: [], updatedFiles: [] }), output: manifest }
		}
		const outPath = resolvePath(context.cwd, input.out)
		const mutations = captureMutationSnapshot([outPath])
		await writeJsonFile(outPath, manifest)
		return { ...createResult('inspect', context.mode, mutations), output: manifest }
	},
}

export const validateArchitectureCommand: PuristaExecutableCommand<
	ArchitectureCommandInput,
	ArchitectureCommandResolved
> = {
	id: 'validate',
	resolve: input => resolveArchitectureInput('validate', input),
	execute: async (input, context) => {
		const manifest = await loadManifest(input, context.cwd)
		const diagnostics = validateArchitectureManifest(manifest, { strict: input.strict })
		const errors = diagnostics.filter(item => item.severity === 'error').map(issueFromDiagnostic)
		const warnings = diagnostics
			.filter(item => item.severity === 'warning')
			.map(item => `${item.code}: ${item.message}`)
		return {
			...createResult('validate', context.mode, { createdFiles: [], updatedFiles: [] }, warnings, errors),
			output: { kind: 'purista.architecture.diagnostics', version: '1.0.0', diagnostics },
		}
	},
}

export const doctorArchitectureCommand: PuristaExecutableCommand<
	ArchitectureCommandInput,
	ArchitectureCommandResolved
> = {
	id: 'doctor',
	resolve: input => resolveArchitectureInput('doctor', input),
	execute: async (input, context) => {
		const definitionsPath = resolvePath(context.cwd, input.definitions)
		const diagnostics = existsSync(definitionsPath)
			? [...validateArchitectureManifest(await loadManifest(input, context.cwd), { strict: input.strict })]
			: [
					{
						code: 'PURISTA_DOCTOR_DEFINITIONS_MISSING',
						severity: 'error' as const,
						message: `Generated definitions file ${input.definitions} was not found.`,
						location: { pointer: '/definitions' },
						remediation: 'Run the generated export:definitions script, then run doctor again.',
					},
				]
		if (!context.puristaConfig) {
			diagnostics.push({
				code: 'PURISTA_DOCTOR_CONFIG_MISSING',
				severity: 'warning',
				message: 'No purista.json configuration was loaded.',
				remediation: 'Run this command from a PURISTA project or create purista.json.',
			})
		}
		const errors = diagnostics.filter(item => item.severity === 'error').map(issueFromDiagnostic)
		const warnings = diagnostics
			.filter(item => item.severity === 'warning')
			.map(item => `${item.code}: ${item.message}`)
		return {
			...createResult('doctor', context.mode, { createdFiles: [], updatedFiles: [] }, warnings, errors),
			output: {
				kind: 'purista.doctor',
				version: '1.0.0',
				mode: 'static',
				checks: {
					definitions: existsSync(definitionsPath) ? 'loaded' : 'missing',
					puristaConfig: context.puristaConfig ? 'loaded' : 'missing',
				},
				diagnostics,
			},
		}
	},
}

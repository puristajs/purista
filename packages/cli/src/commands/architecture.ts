import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join } from 'node:path'

import {
	compareArchitectureManifests,
	createArchitectureContext,
	createArchitectureManifest,
	renderArchitectureContextMarkdown,
	validateArchitectureComposition,
	validateArchitectureManifest,
} from '@purista/core/adapter'
import { z } from 'zod'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandMode } from '../core/types.js'
import { captureMutationSnapshot, createIssuesFromZod, createPendingResolution, createResult } from './shared.js'

const inputSchema = z.object({
	definitions: z.string().trim().default('purista.definitions.json'),
	out: z.string().trim().optional(),
	base: z.string().trim().optional(),
	composition: z.string().trim().optional(),
	artifacts: z.array(z.string().trim()).optional().default([]),
	strict: z.boolean().optional().default(false),
	schemaMode: z.enum(['fingerprints', 'referenced']).optional().default('fingerprints'),
	view: z.enum(['manifest', 'agent']).optional().default('manifest'),
	scope: z.array(z.string().trim()).optional().default([]),
	depth: z.number().int().min(0).optional().default(1),
	format: z.enum(['json', 'markdown']).optional().default('json'),
})

type ArchitectureCommandInput = z.input<typeof inputSchema>
type ArchitectureCommandResolved = z.output<typeof inputSchema>
const resolvePath = (cwd: string, filePath: string) => (isAbsolute(filePath) ? filePath : join(cwd, filePath))
const writeJsonFile = async (filePath: string, value: unknown) => {
	await mkdir(dirname(filePath), { recursive: true })
	await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8')
}
const readJsonFile = async (cwd: string, filePath: string) =>
	JSON.parse(await readFile(resolvePath(cwd, filePath), 'utf-8'))

const resolveArchitectureInput = async (
	command: 'inspect' | 'validate' | 'doctor' | 'diff' | 'compose',
	input: ArchitectureCommandInput,
) => {
	const parsed = inputSchema.safeParse(input)
	return parsed.success
		? createPendingResolution<ArchitectureCommandInput, ArchitectureCommandResolved>(
				command,
				input,
				[],
				[],
				[],
				parsed.data,
			)
		: createPendingResolution<ArchitectureCommandInput, ArchitectureCommandResolved>(
				command,
				input,
				[],
				createIssuesFromZod(parsed.error),
			)
}
const loadManifest = async (input: ArchitectureCommandResolved, cwd: string) =>
	createArchitectureManifest({
		services: await readJsonFile(cwd, input.definitions),
		schemaMode: input.schemaMode === 'referenced' ? 'full' : 'fingerprints',
	})
const issueFromDiagnostic = (diagnostic: {
	code: string
	message: string
	remediation: string
	location?: { pointer?: string }
}) => ({
	code: diagnostic.code,
	message: `${diagnostic.message} Remediation: ${diagnostic.remediation}`,
	path: diagnostic.location?.pointer ? [diagnostic.location.pointer] : undefined,
})
const resultFromDiagnostics = (
	command: 'validate' | 'doctor' | 'compose',
	mode: PuristaCommandMode,
	diagnostics: readonly {
		code: string
		severity: string
		message: string
		remediation: string
		location?: { pointer?: string }
	}[],
) => {
	const errors = diagnostics.filter(item => item.severity === 'error').map(issueFromDiagnostic)
	const warnings = diagnostics.filter(item => item.severity === 'warning').map(item => `${item.code}: ${item.message}`)
	return createResult(command, mode, { createdFiles: [], updatedFiles: [] }, warnings, errors)
}

export const inspectArchitectureCommand: PuristaExecutableCommand<
	ArchitectureCommandInput,
	ArchitectureCommandResolved
> = {
	id: 'inspect',
	resolve: input => resolveArchitectureInput('inspect', input),
	execute: async (input, context) => {
		const manifest = await loadManifest(input, context.cwd)
		const contextView =
			input.view === 'agent'
				? createArchitectureContext(manifest, { scope: input.scope, depth: input.depth, schemaMode: input.schemaMode })
				: undefined
		const output =
			input.format === 'markdown'
				? renderArchitectureContextMarkdown(
						contextView ??
							createArchitectureContext(manifest, {
								scope: input.scope,
								depth: input.depth,
								schemaMode: input.schemaMode,
							}),
					)
				: (contextView ?? manifest)
		if (!input.out) return { ...createResult('inspect', context.mode, { createdFiles: [], updatedFiles: [] }), output }
		if (typeof output === 'string') throw new Error('inspect --out supports JSON output only.')
		const out = resolvePath(context.cwd, input.out)
		const mutations = captureMutationSnapshot([out])
		await writeJsonFile(out, output)
		return { ...createResult('inspect', context.mode, mutations), output }
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
		return {
			...resultFromDiagnostics('validate', context.mode, diagnostics),
			output: { kind: 'purista.architecture.diagnostics', version: '1.0.0', digest: manifest.digest, diagnostics },
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
		if (!context.puristaConfig)
			diagnostics.push({
				code: 'PURISTA_DOCTOR_CONFIG_MISSING',
				severity: 'warning',
				message: 'No purista.json configuration was loaded.',
				remediation: 'Run this command from a PURISTA project or create purista.json.',
			})
		return {
			...resultFromDiagnostics('doctor', context.mode, diagnostics),
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
export const diffArchitectureCommand: PuristaExecutableCommand<ArchitectureCommandInput, ArchitectureCommandResolved> =
	{
		id: 'diff',
		resolve: input => resolveArchitectureInput('diff', input),
		execute: async (input, context) => {
			if (!input.base) throw new Error('diff requires --base <architecture.json>.')
			const base = await readJsonFile(context.cwd, input.base)
			const candidate = await loadManifest(input, context.cwd)
			const changes = compareArchitectureManifests(base, candidate, { strict: input.strict })
			const errors = changes
				.filter(item => item.severity === 'error')
				.map(item => ({
					code: item.code,
					message: `${item.message} Remediation: ${item.remediation}`,
					path: item.componentId || item.relationId ? [item.componentId ?? item.relationId ?? ''] : undefined,
				}))
			const warnings = changes.filter(item => item.severity === 'warning').map(item => `${item.code}: ${item.message}`)
			return {
				...createResult('diff', context.mode, { createdFiles: [], updatedFiles: [] }, warnings, errors),
				output: {
					kind: 'purista.architecture.diff',
					version: '1.0.0',
					baseDigest: base.digest,
					candidateDigest: candidate.digest,
					changes,
				},
			}
		},
	}
export const composeArchitectureCommand: PuristaExecutableCommand<
	ArchitectureCommandInput,
	ArchitectureCommandResolved
> = {
	id: 'compose',
	resolve: input => resolveArchitectureInput('compose', input),
	execute: async (input, context) => {
		if (!input.composition) throw new Error('compose requires --composition <composition.json>.')
		const composition = await readJsonFile(context.cwd, input.composition)
		const artifacts = Object.fromEntries(
			await Promise.all(
				input.artifacts.map(async path => {
					const artifact = await readJsonFile(context.cwd, path)
					return [artifact.digest, artifact]
				}),
			),
		)
		const mappedArtifacts = Object.fromEntries(
			composition.artifacts.map((artifact: { id: string; digest: string }) => [
				artifact.id,
				artifacts[artifact.digest],
			]),
		)
		const diagnostics = validateArchitectureComposition(composition, mappedArtifacts, { strict: input.strict })
		return {
			...resultFromDiagnostics('compose', context.mode, diagnostics),
			output: { kind: 'purista.architecture.composition.diagnostics', version: '1.0.0', diagnostics },
		}
	},
}

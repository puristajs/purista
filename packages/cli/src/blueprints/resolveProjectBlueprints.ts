import { resolve } from 'node:path'
import { PuristaCliValidationError } from '../core/errors.js'
import type { CreateProjectInput } from '../create/types.js'
import { projectBlueprintRegistry } from './registry.js'
import type { BlueprintId, ProjectBlueprintContext, ResolvedProjectBlueprints } from './types.js'

const addBlueprint = (
	target: BlueprintId[],
	seen: Set<BlueprintId>,
	blueprintId: BlueprintId,
	context: ProjectBlueprintContext,
) => {
	if (seen.has(blueprintId)) {
		return
	}

	const blueprint = projectBlueprintRegistry[blueprintId]
	if (!blueprint) {
		throw new PuristaCliValidationError(`Unknown project blueprint: ${blueprintId}`)
	}

	if (blueprint.applies && !blueprint.applies(context)) {
		return
	}

	for (const dependency of blueprint.dependencies ?? []) {
		addBlueprint(target, seen, dependency, context)
	}

	seen.add(blueprintId)
	target.push(blueprintId)
}

export const resolveProjectBlueprints = (
	input: CreateProjectInput,
	options: { cwd?: string } = {},
): ResolvedProjectBlueprints => {
	const context: ProjectBlueprintContext = {
		...input,
		targetDirectoryPath: resolve(options.cwd ?? process.cwd(), input.target),
	}

	const selectedBlueprints: BlueprintId[] = []
	const seen = new Set<BlueprintId>()
	const warnings: string[] = []

	addBlueprint(selectedBlueprints, seen, 'base', context)
	addBlueprint(selectedBlueprints, seen, context.runtime === 'bun' ? 'runtime-bun' : 'runtime-node', context)

	const bridgeBlueprint = `bridge-${context.eventBridge}` as BlueprintId
	addBlueprint(selectedBlueprints, seen, bridgeBlueprint, context)

	if (context.useWebserver) {
		if (context.eventBridge === 'dapr') {
			warnings.push('The Dapr blueprint does not enable the bundled HTTP server. The request was ignored.')
		} else {
			addBlueprint(selectedBlueprints, seen, context.runtime === 'bun' ? 'http-bun' : 'http-node', context)
		}
	}

	if (context.linter === 'biome') {
		addBlueprint(selectedBlueprints, seen, 'linter-biome', context)
	}
	if (context.linter === 'eslint') {
		addBlueprint(
			selectedBlueprints,
			seen,
			context.type === 'commonjs' ? 'linter-eslint-commonjs' : 'linter-eslint-module',
			context,
		)
	}

	const conflicts: string[] = []
	for (const blueprintId of selectedBlueprints) {
		const blueprint = projectBlueprintRegistry[blueprintId]
		for (const conflict of blueprint.conflicts ?? []) {
			if (selectedBlueprints.includes(conflict)) {
				conflicts.push(`Blueprint ${blueprintId} cannot be combined with ${conflict}.`)
			}
		}
	}

	return {
		selectedBlueprints,
		warnings,
		conflicts,
	}
}

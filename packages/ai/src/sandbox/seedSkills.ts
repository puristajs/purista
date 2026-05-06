import type { SkillResource } from '../skills/fileSystem.js'
import type { SandboxAdapter } from './adapter/BashTool/createPuristaSandboxAdapter.js'
import {
	createSandboxSkillSeedFiles,
	createSandboxWorkspaceLayout,
	type SandboxWorkspaceLayout,
} from './workspaceLayout.js'

export type SeedSandboxSkillsInput = {
	adapter: Pick<SandboxAdapter, 'writeFiles'>
	skillResource: SkillResource
	skillNames?: string[]
	layout?: SandboxWorkspaceLayout
}

export type SeedSandboxSkillsOutput = {
	written: number
	skills: string[]
}

const normalizeSkillNames = (skillNames: string[] | undefined) =>
	[...new Set((skillNames ?? []).map(skillName => skillName.trim()).filter(Boolean))].sort((left, right) =>
		left.localeCompare(right),
	)

/**
 * Materialize one or more skill bundles into the canonical sandbox filesystem layout.
 *
 * @example
 * ```ts
 * await seedSandboxSkills({
 *   adapter,
 *   skillResource,
 *   skillNames: ['purista'],
 * })
 * ```
 */
export const seedSandboxSkills = async (input: SeedSandboxSkillsInput): Promise<SeedSandboxSkillsOutput> => {
	const layout = input.layout ?? createSandboxWorkspaceLayout()
	const selectedSkillNames =
		input.skillNames && input.skillNames.length > 0
			? normalizeSkillNames(input.skillNames)
			: (await input.skillResource.list()).map(skill => skill.name).sort((left, right) => left.localeCompare(right))

	if (selectedSkillNames.length === 0) {
		return {
			written: 0,
			skills: [],
		}
	}

	const files = (
		await Promise.all(
			selectedSkillNames.map(async skillName => {
				const bundle = await input.skillResource.loadBundle(skillName)
				return createSandboxSkillSeedFiles(
					skillName,
					bundle.files.map(file => ({
						relativePath: file.relativePath,
						content: file.content,
					})),
					layout,
				)
			}),
		)
	).flat()

	if (files.length === 0) {
		return {
			written: 0,
			skills: selectedSkillNames,
		}
	}

	await input.adapter.writeFiles(files)

	return {
		written: files.length,
		skills: selectedSkillNames,
	}
}

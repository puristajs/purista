import {
	getHarnessSkillFileContent,
	getHarnessSkillIdentifier,
	getHarnessSkillManifestContent,
	getHarnessSkillTestFileContent,
	type HarnessSkillRuntime,
} from './content/skill/getHarnessSkillFileContent.js'
import {
	assertNotBuiltInToolName,
	prepareHarnessLeafScaffold,
	writeHarnessLeafScaffold,
} from './content/tool/leafScaffolding.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { HarnessScaffoldingInput } from './harnessScaffolding.js'

/** Inputs for one service-owned minimal Skill scaffold. */
export type AddPuristaSkillInput = HarnessScaffoldingInput & {
	skillName: string
	skillDescription: string
	runtimes?: readonly HarnessSkillRuntime[]
}

/** Generate one minimal unregistered Skill definition, reviewed manifest, and validation test. */
export const addPuristaSkill = async (input: AddPuristaSkillInput) => {
	if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(input.skillName) || input.skillName.length > 64)
		throw new Error(`Skill name "${input.skillName}" must be a kebab-case manifest id of at most 64 characters.`)
	if (!input.skillDescription.trim()) throw new Error('Skill description is required; no files were changed.')
	assertNotBuiltInToolName(input.skillName, 'Skill')
	const runtimes = input.runtimes ?? []
	if (new Set(runtimes).size !== runtimes.length)
		throw new Error('Skill runtimes must not contain duplicates; no files were changed.')
	if (runtimes.some(runtime => !['node', 'python', 'shell'].includes(runtime)))
		throw new Error('Skill runtimes must be node, python, or shell; no files were changed.')
	const identifier = getHarnessSkillIdentifier(input.skillName)
	if (identifier === 'defineSkill')
		throw new Error(
			`Skill name "${input.skillName}" produces ${identifier}, which collides with the definition factory; no files were changed.`,
		)
	const fileName = `${convertToProjectFileCasing(identifier, input.puristaConfig)}.ts`
	const prepared = prepareHarnessLeafScaffold(
		input,
		{ kind: 'skill', id: input.skillName },
		{ kind: 'skill', logicalName: input.skillName },
		[
			{
				name: fileName,
				content: getHarnessSkillFileContent({
					skillName: input.skillName,
					runtimes,
					codeWriterOptions: input.codeWriterOptions,
				}),
			},
			{ name: 'SKILL.md', content: getHarnessSkillManifestContent(input) },
			{
				name: fileName.replace(/\.ts$/, '.test.ts'),
				content: getHarnessSkillTestFileContent({
					skillName: input.skillName,
					skillImportName: `./${fileName.replace(/\.ts$/, '.js')}`,
					runtimes,
					codeWriterOptions: input.codeWriterOptions,
				}),
			},
		],
	)
	const mutations = await writeHarnessLeafScaffold(prepared)
	return {
		...mutations,
		guidance: `Import { ${identifier} } from the generated Skill file in the agent definition that needs it, then include ${identifier} in that agent's skills array. No Harness root, service composition, or package metadata was changed.`,
	}
}

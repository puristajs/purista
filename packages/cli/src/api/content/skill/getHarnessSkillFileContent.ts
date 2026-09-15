import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'

/** Logical runtime availability that a generated Skill may require. */
export type HarnessSkillRuntime = 'node' | 'python' | 'shell'

/** Convert a kebab Skill id to its exported definition identifier. */
export const getHarnessSkillIdentifier = (name: string) => {
	const id = camelCase(name)
	return id.endsWith('Skill') ? id : `${id}Skill`
}

/** Generate one minimal Skill definition with logical runtime requirements only. */
export const getHarnessSkillFileContent = (input: {
	skillName: string
	runtimes?: readonly HarnessSkillRuntime[]
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const identifier = getHarnessSkillIdentifier(input.skillName)
	writer.writeLine("import { defineSkill } from '@purista/harness'").blankLine()
	writer.writeLine(`export const ${identifier} = defineSkill('${input.skillName}', {`)
	writer.indent(() => {
		writer.writeLine("directory: new URL('./', import.meta.url),")
		if (input.runtimes?.length)
			writer.writeLine(`runtimes: [${input.runtimes.map(runtime => `'${runtime}'`).join(', ')}],`)
	})
	writer.writeLine('})')
	return writer.toString()
}

/** Generate the reviewed Skill directory manifest with no executable metadata. */
export const getHarnessSkillManifestContent = (input: { skillName: string; skillDescription: string }) => `---
name: ${input.skillName}
description: ${JSON.stringify(input.skillDescription)}
---

# ${input.skillName}

${input.skillDescription}
`

/** Generate a credential-free Skill definition and manifest validation test. */
export const getHarnessSkillTestFileContent = (input: {
	skillName: string
	skillImportName: string
	runtimes?: readonly HarnessSkillRuntime[]
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const identifier = getHarnessSkillIdentifier(input.skillName)
	writer.writeLine("import { readFile } from 'node:fs/promises'")
	writer.writeLine("import { describe, expect, it } from 'vitest'")
	writer.writeLine(`import { ${identifier} } from '${input.skillImportName}'`).blankLine()
	writer.writeLine(`describe('${identifier}', () => {`)
	writer.indent(() => {
		writer.writeLine("it('matches its colocated manifest and logical runtimes', async () => {")
		writer.indent(() => {
			writer.writeLine(`expect(${identifier}.id).toBe('${input.skillName}')`)
			writer.writeLine(`expect(${identifier}.directory).toEqual(new URL('./', import.meta.url))`)
			writer.writeLine(`expect(${identifier}.runtimes ?? []).toEqual(${JSON.stringify(input.runtimes ?? [])})`)
			writer.writeLine("const manifest = await readFile(new URL('./SKILL.md', import.meta.url), 'utf8')")
			writer.writeLine(`expect(manifest).toContain('name: ${input.skillName}')`)
		})
		writer.writeLine('})')
	})
	writer.writeLine('})')
	return writer.toString()
}

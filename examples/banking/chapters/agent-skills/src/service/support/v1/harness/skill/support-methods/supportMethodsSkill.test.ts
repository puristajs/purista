import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { supportMethodsSkill } from './supportMethodsSkill.js'

describe('supportMethodsSkill', () => {
	it('has a colocated manifest and no runtime requirement', async () => {
		expect(supportMethodsSkill.id).toBe('support-methods')
		expect(supportMethodsSkill.directory).toEqual(new URL('./', import.meta.url))
		expect(supportMethodsSkill.runtimes ?? []).toEqual([])
		await expect(readFile(new URL('./SKILL.md', import.meta.url), 'utf8')).resolves.toContain('name: support-methods')
	})
})

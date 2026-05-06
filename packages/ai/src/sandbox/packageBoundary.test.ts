import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const sandboxRoot = fileURLToPath(new URL('.', import.meta.url))

const collectSourceFiles = async (directory: string): Promise<string[]> => {
	const entries = await readdir(directory, { withFileTypes: true })
	const files = await Promise.all(
		entries.map(async entry => {
			const target = join(directory, entry.name)
			if (entry.isDirectory()) {
				return await collectSourceFiles(target)
			}
			if (entry.isFile() && target.endsWith('.ts')) {
				return [target]
			}
			return []
		}),
	)
	return files.flat()
}

describe('sandbox package boundary', () => {
	it('does not reference the removed standalone sandbox package or Voyage internals', async () => {
		const sourceFiles = await collectSourceFiles(sandboxRoot)
		expect(sourceFiles.length).toBeGreaterThan(0)

		for (const file of sourceFiles) {
			if (file.endsWith('packageBoundary.test.ts')) {
				continue
			}
			const content = await readFile(file, 'utf8')
			expect(content).not.toContain('@purista/sandbox')
			expect(content).not.toContain('vendor/puristaSandbox')
			expect(content).not.toContain('/voyage/')
		}
	})
})

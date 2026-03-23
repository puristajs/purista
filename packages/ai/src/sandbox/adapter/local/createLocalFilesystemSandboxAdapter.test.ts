import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createLocalFilesystemSandboxAdapter } from './createLocalFilesystemSandboxAdapter.js'

describe('createLocalFilesystemSandboxAdapter', () => {
	it('reads and writes files only within root', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-sandbox-local-'))
		const adapter = createLocalFilesystemSandboxAdapter(root)
		await adapter.writeFiles([{ path: 'specs/spec.md', content: '# Spec' }])
		const content = await adapter.readFile('specs/spec.md')
		expect(content).toBe('# Spec')
		expect(await readFile(join(root, 'specs/spec.md'), 'utf8')).toBe('# Spec')
	})

	it('prevents path escapes', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-sandbox-local-'))
		const adapter = createLocalFilesystemSandboxAdapter(root)
		await expect(adapter.readFile('../etc/passwd')).rejects.toThrow('Path escapes project root')
	})
})

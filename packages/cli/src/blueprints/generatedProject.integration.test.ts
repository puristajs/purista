import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { materializeProjectGeneration } from './materializeProjectGeneration.js'
import { planProjectGeneration } from './planProjectGeneration.js'

test('a generated Node project compiles with TypeScript 7 without manual compiler repairs', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'purista-generated-compile-'))
	const repo = fileURLToPath(new URL('../../../../', import.meta.url))
	try {
		const plan = planProjectGeneration(
			{
				target: 'bank',
				projectName: 'bank',
				runtime: 'node',
				eventBridge: 'default',
				useWebserver: false,
				fileConvention: 'camel',
				eventConvention: 'camel',
				linter: 'none',
				formatter: 'none',
				packageManager: 'npm',
				installDependencies: false,
			},
			{ cwd: directory },
		)
		await materializeProjectGeneration(plan)
		const project = join(directory, 'bank')
		await symlink(join(repo, 'node_modules'), join(project, 'node_modules'), 'dir')
		execFileSync(process.execPath, [join(repo, 'node_modules/@typescript/native/bin/tsc'), '-p', project], {
			cwd: project,
			stdio: 'pipe',
		})
		expect(await readFile(join(project, 'dist/index.js'), 'utf8')).toContain('getEventBridge')
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})

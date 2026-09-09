import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

const repositoryRoot = resolve(import.meta.dirname, '..')
const checkerPath = join(repositoryRoot, 'scripts', 'check-typescript-import-cycles.mjs')
const packageJsonPath = join(repositoryRoot, 'package.json')
const fixtureRoot = mkdtempSync(join(tmpdir(), 'purista-typescript-cycles-'))

const writeFixture = (relativePath, content) => {
	const target = join(fixtureRoot, relativePath)
	mkdirSync(dirname(target), { recursive: true })
	writeFileSync(target, content)
}

const runChecker = root =>
	spawnSync(process.execPath, [checkerPath, root], {
		cwd: repositoryRoot,
		encoding: 'utf8',
		env: { ...process.env, NO_COLOR: '1' },
	})

try {
	writeFixture(
		'acyclic/a.ts',
		["import type { B } from './b.js'", "export { value } from './c.js'", 'export type A = B'].join('\n'),
	)
	writeFixture('acyclic/b.ts', 'export type B = { value: string }\n')
	writeFixture(
		'acyclic/c.ts',
		['const ignored = "import(\'./a.js\')"', "// export * from './a.js'", 'export const value = ignored'].join('\n'),
	)

	const acyclic = runChecker(join(fixtureRoot, 'acyclic'))
	assert.equal(acyclic.status, 0, `acyclic fixture failed:\n${acyclic.stdout}${acyclic.stderr}`)
	assert.match(acyclic.stdout, /No TypeScript import cycles found/)

	writeFixture('cyclic/a.ts', "import { b } from './b.js'\nexport const a = b\n")
	writeFixture('cyclic/b.ts', "export { c as b } from './c.js'\n")
	writeFixture('cyclic/c.ts', "export const c = import('./a.js')\n")

	const cyclic = runChecker(join(fixtureRoot, 'cyclic'))
	assert.equal(cyclic.status, 1, `cyclic fixture unexpectedly passed:\n${cyclic.stdout}${cyclic.stderr}`)
	assert.match(cyclic.stderr, /TypeScript import cycle detected/)
	assert.match(cyclic.stderr, /a\.ts -> b\.ts -> c\.ts -> a\.ts/)

	writeFixture('import-type-cycle/a.ts', "export type A = import('./b.js').B\n")
	writeFixture('import-type-cycle/b.ts', "import type { A } from './a.js'\nexport type B = { readonly child?: A }\n")

	const importTypeCycle = runChecker(join(fixtureRoot, 'import-type-cycle'))
	assert.equal(
		importTypeCycle.status,
		1,
		`import-type cycle unexpectedly passed:\n${importTypeCycle.stdout}${importTypeCycle.stderr}`,
	)
	assert.match(importTypeCycle.stderr, /TypeScript import cycle detected/)
	assert.match(importTypeCycle.stderr, /a\.ts -> b\.ts -> a\.ts/)

	const checkerSource = readFileSync(checkerPath, 'utf8')
	assert.doesNotMatch(checkerSource, /\bnpx\b|\bmadge\b/)

	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
	assert.equal(packageJson.scripts?.['check:cycling'], 'node scripts/check-typescript-import-cycles.mjs')
} finally {
	rmSync(fixtureRoot, { recursive: true, force: true })
}

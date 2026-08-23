#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtureRoot = join(repositoryRoot, 'test', 'fixtures', 'skill-evaluations')
const evaluator = join(repositoryRoot, 'scripts', 'evaluateSkillResponse.mjs')
const fixtures = await readdir(fixtureRoot)

for (const fixture of fixtures.sort()) {
	const expectedPass = fixture.startsWith('valid-')
	const result = spawnSync(process.execPath, [evaluator, '--response', join(fixtureRoot, fixture)], {
		cwd: repositoryRoot,
		encoding: 'utf8',
	})
	const passed = result.status === 0
	if (passed !== expectedPass) {
		throw new Error(
			`Fixture ${fixture} expected ${expectedPass ? 'pass' : 'failure'} but got ${passed ? 'pass' : 'failure'}: ${result.stderr}`,
		)
	}
}

process.stdout.write(`PURISTA skill evaluator checked ${fixtures.length} fixture(s).\n`)

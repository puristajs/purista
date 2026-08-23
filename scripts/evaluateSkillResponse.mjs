#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const responseIndex = args.indexOf('--response')
const scenariosIndex = args.indexOf('--scenarios')
const responsePath = responseIndex >= 0 ? args[responseIndex + 1] : undefined
const scenariosPath = scenariosIndex >= 0 ? args[scenariosIndex + 1] : 'skills/purista/evaluations/scenarios.json'

if (!responsePath) {
	throw new Error(
		'Usage: node scripts/evaluateSkillResponse.mjs --response <response.json> [--scenarios <scenarios.json>]',
	)
}

const parseJson = async path => JSON.parse(await readFile(resolve(path), 'utf8'))
const catalog = await parseJson(scenariosPath)
const response = await parseJson(responsePath)

if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.scenarios)) {
	throw new Error('Invalid PURISTA skill evaluation catalog')
}
if (typeof response.scenarioId !== 'string' || typeof response.response !== 'string') {
	throw new Error('Response must contain string scenarioId and response fields')
}

const scenario = catalog.scenarios.find(candidate => candidate.id === response.scenarioId)
if (!scenario) {
	throw new Error(`Unknown PURISTA skill evaluation scenario: ${response.scenarioId}`)
}

const checks = scenario.requirements.map(requirement => {
	if (typeof requirement.id !== 'string' || !Array.isArray(requirement.patterns) || !requirement.patterns.length) {
		throw new Error(`Invalid requirement in scenario ${scenario.id}`)
	}
	const matchedPattern = requirement.patterns.find(pattern => new RegExp(pattern, 'iu').test(response.response))
	return { id: requirement.id, passed: matchedPattern !== undefined, matchedPattern }
})

const report = { scenarioId: scenario.id, passed: checks.every(check => check.passed), checks }
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
if (!report.passed) {
	process.exitCode = 1
}

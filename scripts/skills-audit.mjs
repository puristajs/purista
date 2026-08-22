#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = process.cwd()
const skillsRoot = resolve(root, 'skills')
const issues = []
const requiredSkillNames = ['purista', 'purista-migration', 'purista-skill-maintainer']
const prohibitedPublicSkillClaims = [
	[/\bServiceObservability(?:Context|Aware)?\b/, 'must not teach the removed service observability type or hook'],
	[/\binheritServiceObservability\b/, 'must not teach service-to-adapter observability inheritance'],
	[/\bobservabilityReport\b/, 'must not teach the removed observability report API'],
]

const readText = path => readFileSync(path, 'utf8')

const lineCount = text => text.split(/\r?\n/).length

const parseFrontmatter = text => {
	const match = text.match(/^---\n([\s\S]*?)\n---\n/)
	if (!match) {
		return undefined
	}

	const data = {}
	for (const line of match[1].split(/\r?\n/)) {
		const index = line.indexOf(':')
		if (index === -1) {
			continue
		}
		data[line.slice(0, index).trim()] = line.slice(index + 1).trim()
	}

	return data
}

const addIssue = (file, message) => {
	issues.push(`${relative(root, file)}: ${message}`)
}

if (!existsSync(skillsRoot)) {
	process.stderr.write(`Skills root not found at ${skillsRoot}\n`)
	process.exit(2)
}

const skillDirs = readdirSync(skillsRoot, { withFileTypes: true })
	.filter(entry => entry.isDirectory())
	.map(entry => join(skillsRoot, entry.name))
	.sort()

for (const skillDir of skillDirs) {
	const skillName = relative(skillsRoot, skillDir)
	const skillFile = join(skillDir, 'SKILL.md')
	if (!existsSync(skillFile)) {
		addIssue(skillDir, 'missing SKILL.md')
		continue
	}

	const skillText = readText(skillFile)
	const frontmatter = parseFrontmatter(skillText)
	if (!frontmatter) {
		addIssue(skillFile, 'missing YAML frontmatter')
		continue
	}

	if (!/^[a-z0-9-]{1,64}$/.test(frontmatter.name ?? '')) {
		addIssue(skillFile, 'frontmatter name must be lowercase kebab-case')
	}

	if (frontmatter.name !== skillName) {
		addIssue(skillFile, 'frontmatter name must match the skill directory name')
	}

	if (!frontmatter.description || frontmatter.description.length > 1024) {
		addIssue(skillFile, 'frontmatter description must exist and stay under 1024 characters')
	}

	if (/[<>]/.test(frontmatter.description ?? '')) {
		addIssue(skillFile, 'frontmatter description must avoid XML-style tags')
	}

	if (lineCount(skillText) > 500) {
		addIssue(skillFile, 'SKILL.md should stay under 500 lines and move depth into references')
	}

	if (skillName !== 'purista-skill-maintainer') {
		for (const [pattern, message] of prohibitedPublicSkillClaims) {
			if (pattern.test(skillText)) addIssue(skillFile, message)
		}
	}

	if (skillName !== 'purista-skill-maintainer' && /\bspecs?\b|specs\//i.test(skillText)) {
		addIssue(skillFile, 'user-facing skills must not reference internal specs')
	}

	if (
		skillName !== 'purista-skill-maintainer' &&
		/(?:purista\/(?:packages|web|examples)|npm run (?:audit|generate|sync):)/i.test(skillText)
	) {
		addIssue(skillFile, 'user-facing skills must not require a PURISTA source checkout or repository-only commands')
	}

	const referencesDir = join(skillDir, 'references')
	if (!existsSync(referencesDir)) {
		continue
	}

	const references = readdirSync(referencesDir, { withFileTypes: true })
		.filter(entry => entry.isFile() && entry.name.endsWith('.md'))
		.map(entry => join(referencesDir, entry.name))
		.sort()

	for (const reference of references) {
		const rel = relative(skillDir, reference)
		if (!skillText.includes(rel)) {
			addIssue(skillFile, `does not link reference ${rel}`)
		}

		const referenceText = readText(reference)
		if (skillName !== 'purista-skill-maintainer') {
			for (const [pattern, message] of prohibitedPublicSkillClaims) {
				if (pattern.test(referenceText)) addIssue(reference, message)
			}
		}
		if (skillName !== 'purista-skill-maintainer' && /\bspecs?\b|specs\//i.test(referenceText)) {
			addIssue(reference, 'user-facing skill references must not reference internal specs')
		}

		if (
			skillName !== 'purista-skill-maintainer' &&
			/(?:purista\/(?:packages|web|examples)|npm run (?:audit|generate|sync):)/i.test(referenceText)
		) {
			addIssue(
				reference,
				'user-facing skill references must not require a PURISTA source checkout or repository-only commands',
			)
		}

		const lines = lineCount(referenceText)
		const firstSection = referenceText.split(/\r?\n/).slice(0, 35).join('\n')
		if (lines > 100 && !firstSection.includes('## Contents')) {
			addIssue(reference, 'reference over 100 lines should include a ## Contents section near the top')
		}
	}
}

for (const requiredSkillName of requiredSkillNames) {
	const requiredSkill = join(skillsRoot, requiredSkillName, 'SKILL.md')
	if (!existsSync(requiredSkill)) {
		addIssue(requiredSkill, 'required canonical skill is missing')
	}
}

for (const skillName of requiredSkillNames) {
	const evalFile = join(skillsRoot, skillName, 'evals', 'evals.json')
	if (!existsSync(evalFile)) {
		addIssue(evalFile, 'required canonical skill evaluation catalog is missing')
		continue
	}

	try {
		const evaluationCatalog = JSON.parse(readText(evalFile))
		if (evaluationCatalog.skill_name !== skillName || !Array.isArray(evaluationCatalog.evals)) {
			addIssue(evalFile, 'evaluation catalog must identify its skill and contain evals')
		} else if (evaluationCatalog.evals.length < 5) {
			addIssue(evalFile, 'evaluation catalog must contain at least five realistic evals')
		}
	} catch {
		addIssue(evalFile, 'evaluation catalog must be valid JSON')
	}
}

const puristaEvalScenarios = join(skillsRoot, 'purista', 'references', '11-evaluation-scenarios.md')
if (!existsSync(puristaEvalScenarios)) {
	addIssue(puristaEvalScenarios, 'canonical purista skill should include concrete evaluation scenarios')
}

const generatedApiIndex = join(skillsRoot, 'purista', 'references', 'generated-api-index.md')
const generatedApiManifest = join(skillsRoot, 'purista', 'references', 'generated-api-manifest.json')
if (!existsSync(generatedApiManifest)) {
	addIssue(generatedApiManifest, 'complete generated public API manifest is missing')
} else {
	try {
		const manifest = JSON.parse(readText(generatedApiManifest))
		if (!Array.isArray(manifest.packages) || manifest.packages.length === 0) {
			addIssue(generatedApiManifest, 'must contain generated package export inventories')
		}
	} catch {
		addIssue(generatedApiManifest, 'must be valid JSON')
	}
}
if (!existsSync(generatedApiIndex) || !/TypeDoc-verified examples/.test(readText(generatedApiIndex))) {
	addIssue(generatedApiIndex, 'must expose TypeDoc-verified primary API examples')
}

const migrationSkill = join(skillsRoot, 'purista-migration', 'SKILL.md')
if (existsSync(migrationSkill)) {
	const migrationText = readText(migrationSkill)
	for (const [pattern, message] of [
		[/\brollback\b/i, 'migration skill must require a rollback path'],
		[/\bvalidate\b/i, 'migration skill must require static validation'],
		[/\bStop And Ask\b/i, 'migration skill must define stop conditions'],
	]) {
		if (!pattern.test(migrationText)) addIssue(migrationSkill, message)
	}
}

if (issues.length) {
	process.stderr.write(`PURISTA skill audit found ${issues.length} issue(s):\n`)
	for (const issue of issues) {
		process.stderr.write(`- ${issue}\n`)
	}
	process.exit(1)
}

process.stdout.write(`PURISTA skill audit passed for ${skillDirs.length} skill(s).\n`)

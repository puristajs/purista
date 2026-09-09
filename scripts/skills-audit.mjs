#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

const root = process.cwd()
const skillsRoot = resolve(root, 'skills')
const issues = []
const canonicalSkillNames = [
	'purista',
	'purista-migration',
	'purista-skill-maintainer',
	'purista-docs-maintainer',
	'purista-tutorial-maintainer',
]
const canonicalSkillNameSet = new Set(canonicalSkillNames)
const internalMaintainerSkills = new Set([
	'purista-skill-maintainer',
	'purista-docs-maintainer',
	'purista-tutorial-maintainer',
])

const readText = path => readFileSync(path, 'utf8')
const readBytes = path => readFileSync(path)

const walkFiles = directory =>
	readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const path = join(directory, entry.name)
		return entry.isDirectory() ? walkFiles(path) : [path]
	})

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

const displayPath = file => {
	const relativePath = relative(root, file)
	return relativePath === '..' || relativePath.startsWith(`..${sep}`) ? file : relativePath
}

const addIssue = (file, message) => {
	issues.push(`${displayPath(file)}: ${message}`)
}

const compareTrees = (canonicalRoot, mirrorRoot, mirrorLabel) => {
	if (!existsSync(canonicalRoot)) {
		addIssue(canonicalRoot, 'canonical skill tree is missing')
		return
	}

	const canonicalFiles = new Map(walkFiles(canonicalRoot).map(file => [relative(canonicalRoot, file), file]))
	const mirrorFiles = new Map(
		existsSync(mirrorRoot) ? walkFiles(mirrorRoot).map(file => [relative(mirrorRoot, file), file]) : [],
	)

	for (const [relativeFile, canonicalFile] of canonicalFiles) {
		const mirrorFile = join(mirrorRoot, relativeFile)
		if (!mirrorFiles.has(relativeFile)) {
			addIssue(mirrorFile, `${mirrorLabel} file is missing`)
			continue
		}
		if (!readBytes(canonicalFile).equals(readBytes(mirrorFile))) {
			addIssue(mirrorFile, `${mirrorLabel} file differs from canonical skills`)
		}
	}

	for (const [relativeFile, mirrorFile] of mirrorFiles) {
		if (!canonicalFiles.has(relativeFile)) {
			addIssue(mirrorFile, `${mirrorLabel} contains an extra file`)
		}
	}
}

const parseInstalledRoot = args => {
	if (args.length === 0) return undefined
	if (args.length !== 2 || args[0] !== '--check-installed' || args[1].trim() === '') {
		process.stderr.write('Usage: node scripts/skills-audit.mjs [--check-installed <root>]\n')
		process.exit(2)
	}
	return resolve(args[1])
}

const installedSkillsRoot = parseInstalledRoot(process.argv.slice(2))

if (!existsSync(skillsRoot)) {
	process.stderr.write(`Skills root not found at ${skillsRoot}\n`)
	process.exit(2)
}

const skillDirs = readdirSync(skillsRoot, { withFileTypes: true })
	.filter(entry => entry.isDirectory())
	.map(entry => join(skillsRoot, entry.name))
	.sort()

for (const skillName of canonicalSkillNames) {
	const skillDir = join(skillsRoot, skillName)
	if (!existsSync(skillDir)) addIssue(skillDir, 'required canonical skill tree is missing')
}
for (const skillDir of skillDirs) {
	const skillName = relative(skillsRoot, skillDir)
	if (!canonicalSkillNameSet.has(skillName)) {
		addIssue(skillDir, 'canonical skill tree is not covered by the five-skill mirror audit')
	}
}

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

	if (!frontmatter.description || frontmatter.description.length > 1024) {
		addIssue(skillFile, 'frontmatter description must exist and stay under 1024 characters')
	}

	if (/[<>]/.test(frontmatter.description ?? '')) {
		addIssue(skillFile, 'frontmatter description must avoid XML-style tags')
	}

	if (lineCount(skillText) > 500) {
		addIssue(skillFile, 'SKILL.md should stay under 500 lines and move depth into references')
	}

	if (!internalMaintainerSkills.has(skillName) && /\bspecs?\b|specs\//i.test(skillText)) {
		addIssue(skillFile, 'user-facing skills must not reference internal specs')
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
		if (!internalMaintainerSkills.has(skillName) && /\bspecs?\b|specs\//i.test(referenceText)) {
			addIssue(reference, 'user-facing skill references must not reference internal specs')
		}

		const lines = lineCount(referenceText)
		const firstSection = referenceText.split(/\r?\n/).slice(0, 35).join('\n')
		if (lines > 100 && !firstSection.includes('## Contents')) {
			addIssue(reference, 'reference over 100 lines should include a ## Contents section near the top')
		}
	}
}

const puristaEvalScenarios = join(skillsRoot, 'purista', 'references', '11-evaluation-scenarios.md')
if (!existsSync(puristaEvalScenarios)) {
	addIssue(puristaEvalScenarios, 'canonical purista skill should include concrete evaluation scenarios')
}

const docsEvalScenarios = join(skillsRoot, 'purista-docs-maintainer', 'references', 'evaluation-scenarios.md')
if (!existsSync(docsEvalScenarios)) {
	addIssue(docsEvalScenarios, 'PURISTA docs maintainer should include concrete evaluation scenarios')
}

const tutorialEvalScenarios = join(skillsRoot, 'purista-tutorial-maintainer', 'references', 'evaluation-scenarios.md')
if (!existsSync(tutorialEvalScenarios)) {
	addIssue(tutorialEvalScenarios, 'PURISTA tutorial maintainer should include concrete evaluation scenarios')
}

const canonicalSkillText = walkFiles(skillsRoot)
	.filter(file => file.endsWith('.md'))
	.map(file => readText(file))
	.join('\n')

for (const retiredFragment of [
	'nats-storage',
	'redis-storage',
	'core agent builders',
	'core-native agents',
	'fluent agent builder',
	'3.2.4 `createCommandTestHarness`',
	'voyage',
]) {
	if (canonicalSkillText.toLowerCase().includes(retiredFragment.toLowerCase())) {
		addIssue(skillsRoot, `contains retired guidance fragment: ${retiredFragment}`)
	}
}

const packagedSkillsRoot = resolve(root, 'packages/core/skills')
if (!existsSync(packagedSkillsRoot)) {
	addIssue(packagedSkillsRoot, 'packaged skill mirror is missing')
} else {
	compareTrees(skillsRoot, packagedSkillsRoot, 'packaged skill mirror')
}

if (installedSkillsRoot) {
	if (!existsSync(installedSkillsRoot)) {
		addIssue(installedSkillsRoot, 'installed skill mirror root is missing')
	} else {
		for (const skillName of canonicalSkillNames) {
			compareTrees(join(skillsRoot, skillName), join(installedSkillsRoot, skillName), `installed ${skillName} mirror`)
		}
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

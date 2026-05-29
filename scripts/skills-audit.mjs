#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = process.cwd()
const skillsRoot = resolve(root, 'skills')
const issues = []

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

if (issues.length) {
	process.stderr.write(`PURISTA skill audit found ${issues.length} issue(s):\n`)
	for (const issue of issues) {
		process.stderr.write(`- ${issue}\n`)
	}
	process.exit(1)
}

process.stdout.write(`PURISTA skill audit passed for ${skillDirs.length} skill(s).\n`)

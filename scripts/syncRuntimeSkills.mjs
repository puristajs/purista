#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'

const repositoryRoot = resolve(import.meta.dirname, '..')
const sourceRoot = resolve(repositoryRoot, 'skills')
const canonicalSkillNames = ['purista', 'purista-migration', 'purista-skill-maintainer']

const args = process.argv.slice(2)
const targetIndex = args.indexOf('--target')
const checkOnly = args.includes('--check')
const targetArg = targetIndex >= 0 ? args[targetIndex + 1] : undefined

if (!targetArg || !isAbsolute(targetArg)) {
	throw new Error('Usage: node scripts/syncRuntimeSkills.mjs --target <absolute-skills-directory> [--check]')
}

const targetRoot = resolve(targetArg)

const listFiles = async directory => {
	const entries = await readdir(directory, { withFileTypes: true })
	const files = []
	for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) {
			for (const nested of await listFiles(path)) {
				files.push(join(entry.name, nested))
			}
		} else if (entry.isFile()) {
			files.push(entry.name)
		}
	}
	return files
}

const hasMatchingContents = async (sourceDirectory, targetDirectory) => {
	try {
		const sourceFiles = await listFiles(sourceDirectory)
		const targetFiles = await listFiles(targetDirectory)
		if (sourceFiles.length !== targetFiles.length || sourceFiles.some((file, index) => file !== targetFiles[index])) {
			return false
		}
		for (const file of sourceFiles) {
			const [source, target] = await Promise.all([
				readFile(join(sourceDirectory, file)),
				readFile(join(targetDirectory, file)),
			])
			if (!source.equals(target)) {
				return false
			}
		}
		return true
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
			return false
		}
		throw error
	}
}

await stat(sourceRoot)
const drifted = []
for (const skillName of canonicalSkillNames) {
	const sourceDirectory = join(sourceRoot, skillName)
	const targetDirectory = join(targetRoot, skillName)
	if (!(await hasMatchingContents(sourceDirectory, targetDirectory))) {
		drifted.push(skillName)
	}
}

if (checkOnly) {
	if (drifted.length) {
		throw new Error(`Runtime skill mirror is stale: ${drifted.join(', ')}`)
	}
	process.stdout.write(`Runtime skill mirror is current at ${targetRoot}.\n`)
	process.exit(0)
}

await mkdir(targetRoot, { recursive: true })
for (const skillName of drifted) {
	const sourceDirectory = join(sourceRoot, skillName)
	const targetDirectory = join(targetRoot, skillName)
	await rm(targetDirectory, { force: true, recursive: true })
	await cp(sourceDirectory, targetDirectory, { recursive: true })
}

process.stdout.write(
	drifted.length
		? `Synced ${drifted.length} runtime skill mirror(s) to ${targetRoot}: ${drifted.join(', ')}.\n`
		: `Runtime skill mirror is already current at ${targetRoot}.\n`,
)

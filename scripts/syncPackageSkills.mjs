#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const packageArgument = process.argv.slice(2).find(argument => argument !== '--check')
const packageDirectory = resolve(packageArgument ?? '.')
const repositoryRoot = resolve(import.meta.dirname, '..')
const sourceDirectory = resolve(repositoryRoot, 'skills')
const targetDirectory = resolve(packageDirectory, 'skills')
const checkOnly = process.argv.includes('--check')

const listFiles = async directory => {
	const entries = await readdir(directory, { withFileTypes: true })
	const files = []
	for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
		const path = resolve(directory, entry.name)
		if (entry.isDirectory()) {
			for (const nested of await listFiles(path)) files.push(`${entry.name}/${nested}`)
		} else if (entry.isFile()) {
			files.push(entry.name)
		}
	}
	return files
}

const hasMatchingContents = async () => {
	try {
		const [sourceFiles, targetFiles] = await Promise.all([listFiles(sourceDirectory), listFiles(targetDirectory)])
		if (sourceFiles.length !== targetFiles.length || sourceFiles.some((file, index) => file !== targetFiles[index])) {
			return false
		}
		for (const file of sourceFiles) {
			const [source, target] = await Promise.all([
				readFile(resolve(sourceDirectory, file)),
				readFile(resolve(targetDirectory, file)),
			])
			if (!source.equals(target)) return false
		}
		return true
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return false
		throw error
	}
}

if (await hasMatchingContents()) {
	process.stdout.write('Packaged skill catalog is current.\n')
	process.exit(0)
}

if (checkOnly) {
	throw new Error(`Packaged skill catalog is stale at ${targetDirectory}. Run the package build or sync script.`)
}

await rm(targetDirectory, { force: true, recursive: true })
await mkdir(packageDirectory, { recursive: true })
await cp(sourceDirectory, targetDirectory, { recursive: true })
process.stdout.write('Packaged skill catalog synchronized.\n')

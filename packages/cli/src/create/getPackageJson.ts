import fs from 'node:fs'
import path from 'node:path'
import type { PackageJson } from 'type-fest'
import type { CreateProjectInput } from './types.js'

/** Package.json shape used by the CLI project blueprint merger. */
export type PKG = PackageJson & {
	/** Bun trusted dependency allowlist emitted by generated projects when needed. */
	trustedDependencies?: string[]
}

const bunPackage: PKG = {
	scripts: {
		start: 'bun src/index.ts',
		build: 'tsc',
		dev: 'bun --watch run src/index.ts',
		test: 'tsc --noEmit && bun test',
	},
	dependencies: {},
	devDependencies: {
		'@types/bun': 'latest',
	},
	trustedDependencies: [],
}

const nodePackage: PKG = {
	scripts: {
		start: 'tsx src/index.ts',
		build: 'tsc',
		dev: 'tsx watch src/index.ts',
		test: 'tsc --noEmit && vitest',
	},
	dependencies: {},
	devDependencies: {
		tsx: 'latest',
		vitest: 'latest',
	},
	trustedDependencies: [],
}

export const mergePackageJson = (inputPkg: PKG, mergePkg: PKG): PKG => {
	const trustedDependencies = [...(inputPkg.trustedDependencies ?? []), ...(mergePkg.trustedDependencies ?? [])]

	return {
		...inputPkg,
		...mergePkg,
		trustedDependencies,
		scripts: {
			...inputPkg.scripts,
			...mergePkg.scripts,
		},
		dependencies: {
			...inputPkg.dependencies,
			...mergePkg.dependencies,
		},
		devDependencies: {
			...inputPkg.devDependencies,
			...mergePkg.devDependencies,
		},
	} as PKG
}

export const getPackageJson = (settings: CreateProjectInput): PKG => {
	const runtimePkg = settings.runtime === 'node' ? nodePackage : bunPackage
	return {
		name: settings.projectName,
		...runtimePkg,
		type: settings.type,
	} as PKG
}

export const writePackageJson = (targetDirectoryPath: string, pkg: PKG) => {
	const packageJsonPath = path.join(targetDirectoryPath, 'package.json')
	if (fs.existsSync(packageJsonPath)) {
		const packageJson = fs.readFileSync(packageJsonPath, 'utf-8')
		fs.writeFileSync(packageJsonPath, JSON.stringify(mergePackageJson(JSON.parse(packageJson), pkg), null, 2))
		return
	}

	fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2))
}

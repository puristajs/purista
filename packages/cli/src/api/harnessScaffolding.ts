import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, sep } from 'node:path'

import { Node, Project, SyntaxKind } from 'ts-morph'

export const importSpecifier = (fromDirectory: string, targetFile: string) => {
	const path = relative(fromDirectory, targetFile).split(sep).join('/').replace(/\.ts$/, '.js')
	return path.startsWith('.') ? path : `./${path}`
}

export const mountHarnessOnService = async (input: {
	serviceFile: string
	mountFile: string
	harnessName: string
	policyName: string
	serviceBuilderName: string
}) => {
	if (!existsSync(input.serviceFile)) throw new Error(`Service file not found: ${input.serviceFile}`)
	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.serviceFile)
	if (!sourceFile) throw new Error(`Failed to load service file: ${input.serviceFile}`)

	const moduleSpecifier = importSpecifier(dirname(input.serviceFile), input.mountFile)
	const existingImport = sourceFile.getImportDeclaration(
		declaration => declaration.getModuleSpecifierValue() === moduleSpecifier,
	)
	if (existingImport) {
		const names = new Set(existingImport.getNamedImports().map(namedImport => namedImport.getName()))
		if (!names.has(input.harnessName)) existingImport.addNamedImport(input.harnessName)
		if (!names.has(input.policyName)) existingImport.addNamedImport(input.policyName)
	} else {
		sourceFile.addImportDeclaration({ namedImports: [input.harnessName, input.policyName], moduleSpecifier })
	}

	const serviceExport = sourceFile.getVariableDeclaration(
		declaration =>
			declaration.getName() !== input.serviceBuilderName &&
			(declaration.getInitializer()?.getText().startsWith(input.serviceBuilderName) ?? false),
	)
	if (!serviceExport)
		throw new Error(`Service export based on ${input.serviceBuilderName} not found in ${input.serviceFile}`)

	const initializer = serviceExport.getInitializerOrThrow()
	const mountExpression = `.mountHarness(${input.harnessName}, ${input.policyName})`
	if (!initializer.getText().includes(mountExpression)) {
		serviceExport.setInitializer(`${initializer.getText()}\n\t${mountExpression}`)
	}

	await sourceFile.save()
	const saved = await readFile(input.serviceFile, 'utf8')
	await writeFile(input.serviceFile, saved.replace(/^ +(?=\t)/gm, ''))
}

export const addModuleToHarness = async (input: {
	harnessFile: string
	moduleFile: string
	moduleIdentifier: string
	harnessName: string
	requirePrimaryModel?: boolean
}) => {
	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.harnessFile)
	if (!sourceFile) throw new Error(`Failed to load Harness file: ${input.harnessFile}`)

	const moduleSpecifier = importSpecifier(dirname(input.harnessFile), input.moduleFile)
	if (!sourceFile.getImportDeclaration(declaration => declaration.getModuleSpecifierValue() === moduleSpecifier)) {
		sourceFile.addImportDeclaration({ namedImports: [input.moduleIdentifier], moduleSpecifier })
	}

	const declaration = sourceFile.getVariableDeclarationOrThrow(input.harnessName)
	const initializer = declaration.getInitializerOrThrow()
	let next = initializer.getText()
	if (input.requirePrimaryModel && !next.includes(".requireModel('primary'")) {
		next = next.replace(/\.define\(\)\s*$/, ".requireModel('primary', { capabilities: ['object'] })\n\t.define()")
	}
	if (!next.includes(`.use(${input.moduleIdentifier})`)) {
		next = next.replace(/\.define\(\)\s*$/, `.use(${input.moduleIdentifier})\n\t.define()`)
	}
	if (next === initializer.getText()) return
	if (!next.endsWith('.define()')) throw new Error(`Harness ${input.harnessName} has no terminal .define() call.`)
	declaration.setInitializer(next)
	await sourceFile.save()
}

const objectProperty = (object: import('ts-morph').ObjectLiteralExpression, name: string) => {
	const property = object.getPropertyOrThrow(name)
	if (!Node.isPropertyAssignment(property)) throw new Error(`Expected ${name} to be a property assignment.`)
	return property.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
}

export const addTargetToMountPolicy = async (input: {
	mountFile: string
	policyName: string
	kind: 'agents' | 'workflows'
	targetId: string
	successEventName?: string
}) => {
	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.mountFile)
	if (!sourceFile) throw new Error(`Failed to load Harness mount file: ${input.mountFile}`)

	const declaration = sourceFile.getVariableDeclarationOrThrow(input.policyName)
	const policy = declaration.getInitializerOrThrow().getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
	const publish = objectProperty(policy, 'publish')
	let publishedProperty = publish.getProperty(input.kind)
	if (!publishedProperty) {
		publishedProperty = publish.addPropertyAssignment({ name: input.kind, initializer: '[]' })
	}
	if (!Node.isPropertyAssignment(publishedProperty)) {
		throw new Error(`Expected publish.${input.kind} to be a property assignment.`)
	}
	const published = publishedProperty.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
	if (
		!published
			.getElements()
			.some(element => element.getText().replaceAll("'", '').replaceAll('"', '') === input.targetId)
	) {
		published.addElement(`'${input.targetId}'`)
	}

	if (input.successEventName) {
		const targets = objectProperty(policy, 'targets')
		let targetKindProperty = targets.getProperty(input.kind)
		if (!targetKindProperty) {
			targetKindProperty = targets.addPropertyAssignment({ name: input.kind, initializer: '{}' })
		}
		if (!Node.isPropertyAssignment(targetKindProperty)) {
			throw new Error(`Expected targets.${input.kind} to be a property assignment.`)
		}
		const targetKind = targetKindProperty.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
		if (!targetKind.getProperty(input.targetId)) {
			targetKind.addPropertyAssignment({
				name: input.targetId,
				initializer: `{ successEvent: '${input.successEventName}' }`,
			})
		}
	}

	await sourceFile.save()
}

export const ensureHarnessDependency = async (projectPath: string) => {
	const packageFile = `${projectPath}/package.json`
	const source = await readFile(packageFile, 'utf8')
	const packageJson = JSON.parse(source) as { dependencies?: Record<string, string> }
	packageJson.dependencies ??= {}
	packageJson.dependencies['@purista/harness'] ??= '^3.0.0'
	await writeFile(packageFile, `${JSON.stringify(packageJson, null, '\t')}\n`)
}

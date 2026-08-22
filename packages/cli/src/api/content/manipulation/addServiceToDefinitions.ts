import { existsSync } from 'node:fs'
import { dirname, relative } from 'node:path'
import { Project, SyntaxKind } from 'ts-morph'

/**
 * Add one generated service export to the standard project definition inventory.
 *
 * Projects opt in by keeping an array literal named `serviceBuilders` in
 * `src/definitions.ts`. Other project shapes remain untouched for backwards
 * compatibility.
 */
export const addServiceToDefinitions = async (input: {
	definitionsFile: string
	serviceFile: string
	serviceExport: string
}) => {
	if (!existsSync(input.definitionsFile)) {
		return false
	}

	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.definitionsFile)
	const serviceBuilders = sourceFile?.getVariableDeclaration('serviceBuilders')
	const buildersArray = serviceBuilders?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
	if (!sourceFile || !buildersArray) {
		return false
	}

	let moduleSpecifier = relative(dirname(input.definitionsFile), input.serviceFile).replaceAll('\\', '/')
	moduleSpecifier = moduleSpecifier.replace(/\.ts$/, '.js')
	if (!moduleSpecifier.startsWith('.')) {
		moduleSpecifier = `./${moduleSpecifier}`
	}

	const existingImport = sourceFile.getImportDeclaration(
		declaration => declaration.getModuleSpecifierValue() === moduleSpecifier,
	)
	if (existingImport) {
		if (!existingImport.getNamedImports().some(namedImport => namedImport.getName() === input.serviceExport)) {
			existingImport.addNamedImport(input.serviceExport)
		}
	} else {
		sourceFile.addImportDeclaration({ namedImports: [input.serviceExport], moduleSpecifier })
	}

	if (!buildersArray.getElements().some(element => element.getText().replace(/\s+/g, '') === input.serviceExport)) {
		buildersArray.addElement(input.serviceExport)
	}

	await sourceFile.save()
	return true
}

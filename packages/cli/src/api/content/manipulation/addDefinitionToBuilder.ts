import { existsSync } from 'node:fs'
import { Project, SyntaxKind } from 'ts-morph'

export const addDefinitionToBuilder = (input: {
	arrayName: 'commandDefinitions' | 'subscriptionDefinitions' | 'streamDefinitions' | 'queueDefinitions' | 'queueWorkerDefinitions'
	serviceFile: string
	importFile: string
	importDefinition: string
}) => {
	if (!existsSync(input.serviceFile)) {
		throw new Error(`Service file not found: ${input.serviceFile}`)
	}

	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.serviceFile)
	if (!sourceFile) {
		throw new Error(`Failed to load service file: ${input.serviceFile}`)
	}

	const arrayDeclaration = sourceFile.getVariableDeclaration(input.arrayName)
	if (!arrayDeclaration) {
		throw new Error(`Variable "${input.arrayName}" not found in ${input.serviceFile}`)
	}

	const arrayLiteralExpression = arrayDeclaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
	if (!arrayLiteralExpression) {
		throw new Error(`Variable "${input.arrayName}" is not an array literal in ${input.serviceFile}`)
	}

	const moduleSpecifier = input.importFile.replace(/\.ts$/, '.js')
	const existingImport = sourceFile.getImportDeclaration(
		declaration => declaration.getModuleSpecifierValue() === moduleSpecifier,
	)
	if (existingImport) {
		const hasNamedImport = existingImport
			.getNamedImports()
			.some(namedImport => namedImport.getName() === input.importDefinition)
		if (!hasNamedImport) {
			existingImport.addNamedImport(input.importDefinition)
		}
	} else {
		sourceFile.addImportDeclaration({
			namedImports: [input.importDefinition],
			moduleSpecifier,
		})
	}

	const definitionExpression = `${input.importDefinition}.getDefinition()`
	const normalizedDefinitionExpression = definitionExpression.replace(/\s+/g, '')
	const alreadyDefined = arrayLiteralExpression.getElements().some(element => {
		const normalizedElement = element.getText().replace(/\s+/g, '')
		return normalizedElement === normalizedDefinitionExpression
	})
	if (!alreadyDefined) {
		arrayLiteralExpression.addElement(definitionExpression)
	}

	return sourceFile.save()
}

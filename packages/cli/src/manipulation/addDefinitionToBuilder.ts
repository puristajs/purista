/* eslint-disable no-console */
import { Project, SyntaxKind } from 'ts-morph'

export const addDefinitionToBuilder = (
	arrayName: 'commandDefinitions' | 'subscriptionDefinitions',
	serviceBuilderFile: string,
	importFile: string,
	importDefinition: string,
) => {
	const project = new Project({
		tsConfigFilePath: './tsconfig.json',
	})

	project.addSourceFilesAtPaths('**/*.ts')

	const sourceFile = project.getSourceFileOrThrow(serviceBuilderFile)

	sourceFile.addImportDeclaration({
		namedImports: [importDefinition],
		moduleSpecifier: importFile,
	})

	const arrayDeclaration = sourceFile.getVariableDeclaration(arrayName)
	if (!arrayDeclaration) {
		return
	}

	const arrayLiteralExpression = arrayDeclaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
	if (!arrayLiteralExpression) {
		return
	}
	arrayLiteralExpression.addElement(`${importDefinition}.getDefinition()`)

	return sourceFile.save()
}

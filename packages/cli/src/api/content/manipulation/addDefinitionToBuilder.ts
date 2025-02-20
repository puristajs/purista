import { Project, SyntaxKind } from 'ts-morph'

export const addDefinitionToBuilder = (input: {
	arrayName: 'commandDefinitions' | 'subscriptionDefinitions'
	serviceFile: string
	importFile: string
	importDefinition: string
}) => {
	const project = new Project({
		tsConfigFilePath: './tsconfig.json',
	})

	project.addSourceFilesAtPaths('**/*.ts')

	const sourceFile = project.getSourceFileOrThrow(input.serviceFile)

	sourceFile.addImportDeclaration({
		namedImports: [input.importDefinition],
		moduleSpecifier: input.importFile.replace('ts', '.js'),
	})

	const arrayDeclaration = sourceFile.getVariableDeclaration(input.arrayName)
	if (!arrayDeclaration) {
		return
	}

	const arrayLiteralExpression = arrayDeclaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
	if (!arrayLiteralExpression) {
		return
	}
	arrayLiteralExpression.addElement(`${input.importDefinition}.getDefinition()`)

	return sourceFile.save()
}

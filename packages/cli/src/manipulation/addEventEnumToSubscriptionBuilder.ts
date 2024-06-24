/* eslint-disable no-console */
import { Project } from 'ts-morph'

export const addEventEnumToSubscriptionBuilder = async (file: string, enumName?: string) => {
	if (!enumName) {
		return
	}

	const project = new Project({
		tsConfigFilePath: './tsconfig.json',
	})

	project.addSourceFilesAtPaths('**/*.ts')

	const sourceFile = project.getSourceFileOrThrow(file)

	const builder = sourceFile
		.getVariableDeclarations()
		.find(declaration => declaration.getText().includes('subscribeToEvent'))

	if (!builder) {
		return
	}

	const newText = builder
		.getText()
		.replace(/\.subscribeToEvent\((["'].*["'])\)/gm, `.subscribeToEvent(ServiceEvent.${enumName})`)

	builder.replaceWithText(newText)

	sourceFile.addImportDeclaration({
		namedImports: ['ServiceEvent'],
		moduleSpecifier: '../../../../ServiceEvent.enum.js',
	})

	return sourceFile.save()
}

/* eslint-disable no-console */
import { Project } from 'ts-morph'

export const addEventEnumToCommandBuilder = async (file: string, enumName?: string) => {
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
		.find(declaration => declaration.getText().includes('setSuccessEventName'))

	if (!builder) {
		return
	}

	const newText = builder
		.getText()
		.replace(/\.setSuccessEventName\((["'].*["'])\)/gm, `.setSuccessEventName(ServiceEvent.${enumName})`)

	builder.replaceWithText(newText)

	sourceFile.addImportDeclaration({
		namedImports: ['ServiceEvent'],
		moduleSpecifier: '../../../../ServiceEvent.enum.js',
	})

	return sourceFile.save()
}

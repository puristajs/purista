import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { type AsExpression, Project, SyntaxKind } from 'ts-morph'
import type { PuristaConfig } from './loadPuristaConfig.js'

export const getEventNames = (
	puristaConfig: PuristaConfig,
	eventEnumFileName: string,
	projectRootPath: string = process.cwd(),
): { name: string; value: string }[] => {
	try {
		const tsConfigFilePath = join(projectRootPath, 'tsconfig.json')
		const project = existsSync(tsConfigFilePath)
			? new Project({ tsConfigFilePath })
			: new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })

		const enumFile = join(projectRootPath, puristaConfig.servicePath, eventEnumFileName)
		const sourceFile = project.addSourceFileAtPathIfExists(enumFile)

		if (!sourceFile) {
			return []
		}

		const serviceEventEnum = sourceFile.getEnum('ServiceEvent')

		if (serviceEventEnum) {
			return serviceEventEnum
				.getMembers()
				.map(member => {
					const value = member.getValue() as string
					return { value, name: value }
				})
				.sort((a, b) => a.value.localeCompare(b.value))
		}

		// Fallback: Look for a const object named ServiceEvent
		const varDecl = sourceFile.getVariableDeclaration('ServiceEvent')
		if (varDecl) {
			const initializer = varDecl.getInitializer()

			// Handle "as const"
			const actualInit = initializer?.asKind(SyntaxKind.AsExpression)
				? (initializer as AsExpression).getExpression()
				: initializer

			const objLiteral = actualInit?.asKind(SyntaxKind.ObjectLiteralExpression)
			if (objLiteral) {
				const properties = objLiteral.getProperties()
				return properties
					.map(prop => {
						if (prop.getKind() === SyntaxKind.PropertyAssignment) {
							const assignment = prop.asKind(SyntaxKind.PropertyAssignment)
							if (!assignment) {
								return null
							}
							const nameNode = assignment?.getNameNode()
							const name = nameNode?.getText().replace(/^["'`]|["'`]$/g, '')
							const value = assignment
								.getInitializer()
								?.getText()
								.replace(/^["'`]|["'`]$/g, '')
							if (name && value) {
								return { name: value, value }
							}
						}
						return null
					})
					.filter((x): x is { name: string; value: string } => !!x)
					.sort((a, b) => a.value.localeCompare(b.value))
			}
		}

		return []
	} catch {
		return []
	}
}

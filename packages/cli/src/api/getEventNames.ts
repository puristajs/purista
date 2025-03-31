import { join } from 'node:path'

import { Project, SyntaxKind } from 'ts-morph'
import type { PuristaConfig } from './loadPuristaConfig.js'

export let eventNames: { name: string; value: string }[]
export const getEventNames = (
	puristaConfig: PuristaConfig,
	eventEnumFileName: string,
): { name: string; value: string }[] => {
	if (eventNames) {
		return eventNames
	}
	try {
		const tsConfigFilePath = join(process.cwd(), 'tsconfig.json')
		const project = new Project({
			tsConfigFilePath,
		})

		const enumFile = join(puristaConfig.servicePath, eventEnumFileName)
		const sourceFile = project.addSourceFileAtPathIfExists(enumFile)

		if (!sourceFile) {
			eventNames = []
			return eventNames
		}

		const serviceEventEnum = sourceFile.getEnum('ServiceEvent')

		if (serviceEventEnum) {
			eventNames = serviceEventEnum
				.getMembers()
				.map(member => {
					const value = member.getValue() as string
					return { value, name: value }
				})
				.sort((a, b) => a.value.localeCompare(b.value))
			return eventNames
		}

		// Fallback: Look for a const object named ServiceEvent
		const varDecl = sourceFile.getVariableDeclaration('ServiceEvent')
		if (varDecl) {
			const initializer = varDecl.getInitializer()
			const objLiteral = initializer?.asKind(SyntaxKind.ObjectLiteralExpression)
			if (objLiteral) {
				const properties = objLiteral.getProperties()
				eventNames = properties
					.map(prop => {
						if (prop.getKind() === SyntaxKind.PropertyAssignment) {
							const assignment = prop.asKind(SyntaxKind.PropertyAssignment)
							if (!assignment) {
								return null
							}
							const nameNode = assignment.getNameNode()
							const name = nameNode.getText().replace(/^["'`]|["'`]$/g, '')
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
				return eventNames
			}
		}

		eventNames = []
		return eventNames
	} catch (error) {
		eventNames = []
		return eventNames
	}
}

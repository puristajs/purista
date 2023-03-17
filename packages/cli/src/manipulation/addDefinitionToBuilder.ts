/* eslint-disable no-console */
import { Project, SyntaxKind } from 'ts-morph'

export const addDefinitionToBuilder = (
  arrayName: 'commandDefinitions' | 'subscriptionDefinitions',
  serviceBuilderFile: string,
  importFile: string,
  importDefinition: string,
) => {
  console.log('👷🏗️ -> try to add definition to builder')

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
    return console.log('⚠️ could not find arrayDeclaration ' + arrayName + ' ⚠️')
  }

  const arrayLiteralExpression = arrayDeclaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
  if (!arrayLiteralExpression) {
    return console.log('⚠️ could not find arrayLiteralExpression ' + arrayName + ' ⚠️')
  }
  arrayLiteralExpression.addElement(importDefinition + '.getDefinition()')

  console.log('👍  -> definition added to service builder')

  return sourceFile.save()
}

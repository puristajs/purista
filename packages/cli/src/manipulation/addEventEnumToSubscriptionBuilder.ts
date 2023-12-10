/* eslint-disable no-console */
import { Project } from 'ts-morph'

export const addEventEnumToSubscriptionBuilder = async (file: string, enumName?: string) => {
  if (!enumName) {
    return console.log('skip set event name from enum in subscription builder')
  }

  console.log('👷🏗️ -> set event name from enum in subscription builder')

  const project = new Project({
    tsConfigFilePath: './tsconfig.json',
  })

  project.addSourceFilesAtPaths('**/*.ts')

  const sourceFile = project.getSourceFileOrThrow(file)

  const builder = sourceFile
    .getVariableDeclarations()
    .find((declaration) => declaration.getText().includes('subscribeToEvent'))

  if (!builder) {
    return console.log('⚠️ could not find subscription builder call ⚠️')
  }

  const newText = builder
    .getText()
    .replace(/\.subscribeToEvent\((["'].*["'])\)/gm, `.subscribeToEvent(ServiceEvent.${enumName})`)

  builder.replaceWithText(newText)

  sourceFile.addImportDeclaration({
    namedImports: ['ServiceEvent'],
    moduleSpecifier: '../../../../ServiceEvent.enum.js',
  })

  console.log('👍  -> updated event to use enum in subscription builder')

  return sourceFile.save()
}

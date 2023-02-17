/* eslint-disable no-console */
import { Project } from 'ts-morph'

export const addEventEnumToCommandBuilder = async (file: string, enumName?: string) => {
  if (!enumName) {
    return console.log('skip set event name from enum in command builder')
  }

  console.log('👷🏗️ -> set event name from enum in command builder')

  const project = new Project({
    tsConfigFilePath: './tsconfig.json',
  })

  project.addSourceFilesAtPaths('**/*.ts')

  const sourceFile = project.getSourceFileOrThrow(file)

  const builder = sourceFile
    .getVariableDeclarations()
    .find((declaration) => declaration.getText().includes('setSuccessEventName'))

  if (!builder) {
    return console.log('⚠️ could not find command builder call ⚠️')
  }

  const newText = builder
    .getText()
    .replace(/\.setSuccessEventName\((["'].*["'])\)/gm, `.setSuccessEventName(ServiceEvent.${enumName})`)

  builder.replaceWithText(newText)

  sourceFile.addImportDeclaration({
    namedImports: ['ServiceEvent'],
    moduleSpecifier: '../../../../ServiceEvent.enum',
  })

  console.log('👍  -> updated event to use enum in command builder')

  return sourceFile.save()
}

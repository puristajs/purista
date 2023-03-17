/* eslint-disable no-console */
import { join } from 'node:path'

import camelCase from 'camelcase'
import { Project } from 'ts-morph'

export const ensureServiceEvent = async (eventName: string | undefined, description?: string) => {
  if (!eventName?.trim().length) {
    console.log('skip - no event name to add')
    return
  }

  console.log('👷🏗️ -> ensure new enum entry')

  const tsConfigFilePath = join(process.cwd(), 'tsconfig.json')
  const project = new Project({
    tsConfigFilePath,
  })

  const enumFile = join('.', 'src', 'service', 'ServiceEvent.enum.ts')

  const sourceFile = project.addSourceFileAtPathIfExists(enumFile)

  if (!sourceFile) {
    throw new Error(enumFile + ' could not be found')
  }

  const serviceEventEnum = sourceFile.getEnum('ServiceEvent')

  if (!serviceEventEnum) {
    throw new Error('enum ServiceEvent could not be found')
  }

  const enumValue = eventName.trim()
  const enumName = camelCase(enumValue, { pascalCase: true, preserveConsecutiveUppercase: true })

  const existingEntries = serviceEventEnum.getMembers()

  const alreadyExist = existingEntries.find(
    (member) => member.getName() === enumName || member.getValue() === enumValue,
  )

  if (alreadyExist) {
    console.log('🕵️  -> event exist in enum', enumName)
    return alreadyExist.getName()
  }

  const member = serviceEventEnum.addMember({ name: enumName, value: enumValue })
  if (description) {
    member.addJsDoc(description)
  }

  await sourceFile.save()

  console.log(`👍  -> event "${enumValue}" added to enum as ServiceEvent.${enumName}`)
  return enumName
}

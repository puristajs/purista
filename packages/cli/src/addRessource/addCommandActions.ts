/* eslint-disable no-console */
import camelCase from 'camelcase'
import { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'
import { collectInstallInfo, installInfo } from '../helper/installInfo.js'
import { addDefinitionToBuilder } from '../manipulation/addDefinitionToBuilder.js'
import { addEventEnumToCommandBuilder } from '../manipulation/addEventEnumToCommandBuilder.js'
import { ensureServiceEvent } from '../manipulation/ensureServiceEvent.js'
import { lintFiles } from '../manipulation/lintFiles.js'

export const addCommandActions: Actions = [
  async () => {
    await collectInstallInfo()
    return 'checking current setup'
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase name}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/name/index.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase name}}/schema.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/name/schema.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase name}}/types.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/name/types.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase name}}/{{camelCase name}}.test.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/name/name.test.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase name}}/{{camelCase name}}CommandBuilder.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/name/nameBuilder.ts.hbs',
  },
  {
    type: 'append',
    path: 'src/service/{{service.path}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/partial_addTypeExportCommand.ts.hbs',
  },
  async (answers) => {
    console.log('try to update existing files - pls be patient!')
    try {
      const enumDescription = `Emitted by ${answers.service.name} v${answers.service.version} command ${camelCase(
        answers.name,
      )}:\n${answers.description}`
      const eventEnumName = await ensureServiceEvent(answers.commandEventName, enumDescription)
      if (eventEnumName) {
        await addEventEnumToCommandBuilder(
          `src/service/${answers.service.path}/command/${camelCase(answers.name)}/${camelCase(
            answers.name,
          )}CommandBuilder.ts`,
          eventEnumName,
        )
      }

      const serviceBuilderFile = `src/service/${answers.service.path}/${answers.service.serviceFile}`
      await addDefinitionToBuilder(
        'commandDefinitions',
        serviceBuilderFile,
        `./command/${camelCase(answers.name)}`,
        `${camelCase(answers.name)}CommandBuilder`,
      )

      const files: string[] = [
        `src/service/${answers.service.path}/command/${camelCase(answers.name)}/index.ts`,
        `src/service/${answers.service.path}/command/${camelCase(answers.name)}/schema.ts`,
        `src/service/${answers.service.path}/command/${camelCase(answers.name)}/types.ts`,
        `src/service/${answers.service.path}/command/${camelCase(answers.name)}/${camelCase(answers.name)}.test.ts`,
        `src/service/${answers.service.path}/command/${camelCase(answers.name)}/${camelCase(
          answers.name,
        )}CommandBuilder.ts`,
        serviceBuilderFile,
        `src/service/${answers.service.path}/index.ts`,
        `src/service/serviceEvent.enum.ts`,
      ]

      await lintFiles(files)
    } catch (error) {
      console.log(error)
      return 'Please check manually!'
    }
    return 'files updated'
  },
  (answers) => {
    console.log('')
    console.log('')
    console.log(
      '🎉 The command "' +
        answers.name +
        '" in service "' +
        answers.service.name +
        '" version' +
        answers.service.version +
        ' is created 🎉',
    )
    console.log('')
    console.log('')
    console.log('start adding your business logic here:')
    console.log(
      `./src/service/${answers.service.path}/command/${camelCase(answers.name)}/${camelCase(
        answers.name,
      )}CommandBuilder.ts`,
    )
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

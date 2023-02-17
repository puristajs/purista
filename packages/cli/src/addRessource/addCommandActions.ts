/* eslint-disable no-console */
import { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'
import { collectInstallInfo, installInfo } from '../helper/installInfo.js'

export const addCommandActions: Actions = [
  async () => {
    await collectInstallInfo()
    return 'checking current setup'
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase commandName}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/commandName/index.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase commandName}}/schema.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/commandName/schema.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase commandName}}/types.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/commandName/types.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase commandName}}/{{camelCase commandName}}.test.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/commandName/commandName.test.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/command/{{camelCase commandName}}/{{camelCase commandName}}CommandBuilder.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/command/commandName/commandNameBuilder.ts.hbs',
  },
  {
    type: 'append',
    path: 'src/service/{{service.path}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/partial_addTypeExportCommand.ts.hbs',
  },
  (answers) => {
    console.log('')
    console.log(
      '🎉 The command ' +
        answers.commandName +
        ' in ' +
        answers.service.name +
        ' v' +
        answers.service.version +
        ' is created 🎉',
    )
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

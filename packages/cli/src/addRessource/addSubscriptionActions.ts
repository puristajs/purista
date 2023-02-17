/* eslint-disable no-console */
import { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'
import { collectInstallInfo, installInfo } from '../helper/installInfo.js'

export const addSubscriptionActions: Actions = [
  async () => {
    await collectInstallInfo()
    return 'checking current setup'
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase name}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/name/index.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase name}}/{{camelCase name}}.test.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/name/name.test.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase name}}/schema.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/name/schema.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase name}}/types.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/name/types.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase name}}/{{camelCase name}}SubscriptionBuilder.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/name/nameBuilder.ts.hbs',
  },
  {
    type: 'append',
    path: 'src/service/{{service.path}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/partial_addTypeExportSubscription.ts.hbs',
  },
  (answers) => {
    console.log('')
    console.log(
      '🎉 The subscription ' +
        answers.name +
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

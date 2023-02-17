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
    path: 'src/service/{{service.path}}/subscription/{{camelCase subscriptionName}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/index.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase subscriptionName}}/{{camelCase subscriptionName}}.test.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/subscriptionName.test.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase subscriptionName}}/schema.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/schema.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase subscriptionName}}/types.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/types.ts.hbs',
    skip: () => !installInfo.jestIsPresent || !installInfo.sinonIsPresent,
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{service.path}}/subscription/{{camelCase subscriptionName}}/{{camelCase subscriptionName}}SubscriptionBuilder.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/subscription/subscriptionNameBuilder.ts.hbs',
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
        answers.subscriptionName +
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

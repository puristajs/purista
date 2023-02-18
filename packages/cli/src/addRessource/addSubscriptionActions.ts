/* eslint-disable no-console */
import camelCase from 'camelcase'
import { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'
import { collectInstallInfo, installInfo } from '../helper/installInfo.js'
import { addEventEnumToSubscriptionBuilder } from '../manipulation/addEventEnumToSubscriptionBuilder.js'
import { ensureServiceEvent } from '../manipulation/ensureServiceEvent.js'
import { lintFiles } from '../manipulation/lintFiles.js'

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
  async (answers) => {
    console.log('try to update existing files - pls be patient!')
    try {
      const eventEnumName = await ensureServiceEvent(answers.subscriptionEventName || answers.subscriptionEventList)
      if (eventEnumName) {
        await addEventEnumToSubscriptionBuilder(
          `src/service/${answers.service.path}/subscription/${camelCase(answers.name)}/${camelCase(
            answers.name,
          )}SubscriptionBuilder.ts`,
          eventEnumName,
        )
      }

      const files: string[] = [
        `src/service/${answers.service.path}/subscription/${camelCase(answers.name)}/index.ts`,
        `src/service/${answers.service.path}/subscription/${camelCase(answers.name)}/schema.ts`,
        `src/service/${answers.service.path}/subscription/${camelCase(answers.name)}/types.ts`,
        `src/service/${answers.service.path}/subscription/${camelCase(answers.name)}/${camelCase(
          answers.name,
        )}.test.ts`,
        `src/service/${answers.service.path}/subscription/${camelCase(answers.name)}/${camelCase(
          answers.name,
        )}SubscriptionBuilder.ts`,
        `src/service/${answers.service.path}/index.ts`,
        `src/service/ServiceEvent.enum.ts`,
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

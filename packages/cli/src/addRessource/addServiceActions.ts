/* eslint-disable no-console */
import camelCase from 'camelcase'
import { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'
import { lintFiles } from '../manipulation/lintFiles.js'

export const addServiceActions: Actions = [
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/ServiceEvent.enum.ts',
    templateFile: TEMPLATE_BASE + '/src/service/ServiceEvent.enum.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase name}}/general{{properCase name}}ServiceInfo.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/generalServicenameServiceInfo.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase name}}/v{{version}}/{{camelCase name}}V{{version}}Service.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/servicenameV1Service.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase name}}/v{{version}}/{{camelCase name}}V{{version}}Service.test.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/servicenameV1Service.test.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase name}}/v{{version}}/{{camelCase name}}ServiceBuilder.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/servicenameBuilder.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase name}}/v{{version}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/index.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase name}}/v{{version}}/{{camelCase name}}ServiceConfig.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/serviceNameServiceConfig.ts.hbs',
  },
  async (answers) => {
    console.log('try to update existing files - pls be patient!')
    try {
      const files: string[] = [
        `src/service/${camelCase(answers.name, { pascalCase: true })}/general${camelCase(answers.name, {
          pascalCase: true,
        })}ServiceInfo.ts`,
        `src/service/${camelCase(answers.name, { pascalCase: true })}/v${answers.version}/${camelCase(answers.name)}V${
          answers.version
        }Service.ts`,
        `src/service/${camelCase(answers.name, { pascalCase: true })}/v${answers.version}/${camelCase(answers.name)}V${
          answers.version
        }Service.test.ts`,
        `src/service/${camelCase(answers.name, { pascalCase: true })}/v${answers.version}/${camelCase(
          answers.name,
        )}ServiceBuilder.ts`,
        `src/service/${camelCase(answers.name, { pascalCase: true })}/v${answers.version}/${camelCase(
          answers.name,
        )}ServiceConfig.ts`,
        `src/service/${camelCase(answers.name, { pascalCase: true })}/v${answers.version}/index.ts`,
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
    console.log('🎉 The service ' + answers.name + ' v1 is created 🎉')
    console.log('Now it is time to add a command or subscription to the service')
    console.log('')
    console.log('➡️  purista add command')
    console.log('➡️  purista add subscription')
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

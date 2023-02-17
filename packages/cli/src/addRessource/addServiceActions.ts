/* eslint-disable no-console */
import { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'

export const addServiceActions: Actions = [
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase serviceName}}/general{{properCase serviceName}}ServiceInfo.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/generalServicenameServiceInfo.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase serviceName}}/v{{version}}/{{camelCase serviceName}}V{{version}}Service.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/servicenameV1Service.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase serviceName}}/v{{version}}/{{camelCase serviceName}}ServiceBuilder.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/servicenameBuilder.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase serviceName}}/v{{version}}/index.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/index.ts.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'src/service/{{properCase serviceName}}/v{{version}}/{{camelCase serviceName}}ServiceConfig.ts',
    templateFile: TEMPLATE_BASE + '/src/service/serviceName/v1/serviceNameServiceConfig.ts.hbs',
  },
  (answers) => {
    console.log('')
    console.log('🎉 The service ' + answers.serviceName + ' v1 is created 🎉')
    console.log('Now it is time to add a command or subscription to the service')
    console.log('')
    console.log('➡️  purista add command')
    console.log('➡️  purista add subscription')
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

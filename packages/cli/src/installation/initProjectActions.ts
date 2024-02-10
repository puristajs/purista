/* eslint-disable no-console */
import type { Actions } from 'node-plop'

import {
  cliDependencies,
  dependencies,
  devDependencies,
  httpserverDependencies,
  httpStaticDependencies,
  lintDependencies,
  TEMPLATE_BASE,
  testDependencies,
} from '../config.js'
import { installDependencies } from '../helper/installDependencies.js'

export const initProjectActions: Actions = [
  (answers) => {
    if (!answers.initialize) {
      console.log('')
      console.log('😥 I am sorry about your choice - you should try out PURISTA 😉')
      console.log('')
      console.log('Learn more about PURISTA at https://purista.dev')
      console.log('')
      process.exit()
    }
    return 'Installing PURISTA 🚀'
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'package.json',
    templateFile: TEMPLATE_BASE + '/package.json.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'readme.md',
    templateFile: TEMPLATE_BASE + '/readme.md.hbs',
  },
  {
    type: 'add',
    skipIfExists: true,
    path: 'tsconfig.json',
    templateFile: TEMPLATE_BASE + '/tsconfig.json.hbs',
  },
  async (answers) => {
    const deps = dependencies

    if (answers.installHttpService) {
      deps.push(...httpserverDependencies)
    }

    if (answers.installStaticPlugin) {
      deps.push(...httpStaticDependencies)
    }

    await installDependencies('npm install --save-prod ' + deps.join(' '))

    const devDeps = devDependencies

    if (answers.installCliGlobal === 'global') {
      await installDependencies('npm install -g ' + cliDependencies.join(' '))
    }

    if (answers.installCliGlobal === 'local') {
      devDeps.push(...cliDependencies)
    }

    await installDependencies('npm install --save-dev ' + devDeps.join(' '))

    if (answers.lintTestModules.includes('installTest')) {
      await installDependencies('npm install --save-dev ' + testDependencies.join(' '))
    }

    if (answers.lintTestModules.includes('installLint')) {
      await installDependencies('npm install --save-dev ' + lintDependencies.join(' '))
    }

    return 'needed packages installed'
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.lintTestModules?.includes('installTest') || !answers.isEsm) {
        return '[SKIPPED] test setup'
      }
    },
    skipIfExists: true,
    path: 'jest.config.cjs',
    templateFile: TEMPLATE_BASE + '/jest.config.js.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.lintTestModules?.includes('installTest') && answers.isEsm) {
        return '[SKIPPED] test setup'
      }
    },
    skipIfExists: true,
    path: 'jest.config.js',
    templateFile: TEMPLATE_BASE + '/jest.config.js.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.lintTestModules?.includes('installLint')) {
        return '[SKIPPED] lint setup'
      }
    },
    skipIfExists: true,
    path: '.eslintignore',
    templateFile: TEMPLATE_BASE + '/eslintignore.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.lintTestModules?.includes('installLint')) {
        return '[SKIPPED] lint setup'
      }
    },
    skipIfExists: true,
    path: '.prettierrc',
    templateFile: TEMPLATE_BASE + '/prettierrc.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[]>) => {
      if (!answers.lintTestModules?.includes('installLint') || !answers.isEsm) {
        return '[SKIPPED] lint setup'
      }
    },
    skipIfExists: true,
    path: '.eslintrc.cjs',
    templateFile: TEMPLATE_BASE + '/eslintrc.js.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[]>) => {
      if (!answers.lintTestModules?.includes('installLint') || answers.isEsm) {
        return '[SKIPPED] lint setup'
      }
    },
    skipIfExists: true,
    path: '.eslintrc.js',
    templateFile: TEMPLATE_BASE + '/eslintrc.js.hbs',
  },
  async (answers) => {
    switch (answers.eventBridge) {
      case 'AmqpEventBridge':
        await installDependencies('npm install --save-prod @purista/amqpbridge')
        return '@purista/amqpbridge added'
      case 'MqttEventBridge':
        await installDependencies('npm install --save-prod @purista/mqttbridge')
        return '@purista/mqttbridge added'
      case 'NatsEventBridge':
        await installDependencies('npm install --save-prod @purista/natsbridge')
        return '@purista/natsbridge added'
      case 'DaprEventBridge':
        await installDependencies('npm install --save-prod @purista/dapr-sdk')
        return '@purista/dapr-sdk added'
      default:
        return '[SKIPPED] no additional packages required'
    }
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (answers.eventBridge !== 'AmqpEventBridge') {
        return '[SKIPPED] AMQP event bridge config'
      }
    },
    skipIfExists: true,
    path: 'config/amqpBridgeConfig.ts',
    templateFile: TEMPLATE_BASE + '/config/amqpBridgeConfig.ts.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (answers.eventBridge !== 'MqttEventBridge') {
        return '[SKIPPED] MQTT event bridge config'
      }
    },
    skipIfExists: true,
    path: 'config/mqttBridgeConfig.ts',
    templateFile: TEMPLATE_BASE + '/config/mqttBridgeConfig.ts.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (answers.eventBridge !== 'NatsEventBridge') {
        return '[SKIPPED] NATS event bridge config'
      }
    },
    skipIfExists: true,
    path: 'config/natsBridgeConfig.ts',
    templateFile: TEMPLATE_BASE + '/config/natsBridgeConfig.ts.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (answers.eventBridge === 'DaprEventBridge') {
        return '[SKIPPED] index files must be created for each service individual'
      }
    },
    skipIfExists: true,
    path: 'src/index.ts',
    templateFile: TEMPLATE_BASE + '/src/index.ts.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.installHttpService) {
        return '[SKIPPED] http server config install'
      }
    },
    skipIfExists: true,
    path: 'config/httpServerConfig.ts',
    templateFile: TEMPLATE_BASE + '/config/httpServerConfig.ts.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.installHttpService) {
        return '[SKIPPED] http server config install'
      }
    },
    skipIfExists: true,
    path: 'fastify.d.ts',
    templateFile: TEMPLATE_BASE + '/fastify.d.ts.hbs',
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.installStaticPlugin) {
        return '[SKIPPED] http server static install'
      }
    },
    skipIfExists: true,
    path: 'public/index.html',
    templateFile: TEMPLATE_BASE + '/public/index.html.hbs',
  },
  (answers) => {
    console.log('')
    console.log('🎉 SUCCESS - PURISTA project ready 🎉')
    console.log('Enjoy building awesome applications with PURISTA 🚀')
    console.log('')
    if (answers.eventBridge === 'DaprEventBridge') {
      console.log('🚨 As you are using the Dapr event bridge you might need to install additional packages!')
      console.log('🚨 You also need to setup the config for your runtime environment.')
      console.log('🚨 see https://purista.dev/handbook/3._event-bridge/5_dapr.html')
    }
    console.log('')
    console.log('Now it is time to add your first service!')
    console.log('')
    console.log('➡️  purista add service')
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

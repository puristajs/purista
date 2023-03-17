/* eslint-disable no-console */
import { Actions } from 'node-plop'

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

    await installDependencies('npm install -s ' + deps.join(' '))

    const devDeps = devDependencies

    if (answers.installCliGlobal) {
      devDeps.push(...cliDependencies)
    } else {
      await installDependencies('npm install -g ' + cliDependencies.join(' '))
    }

    await installDependencies('npm install -d ' + devDeps.join(' '))

    if (answers.lintTestModules.includes('installTest')) {
      await installDependencies('npm install -d ' + testDependencies.join(' '))
    }

    if (answers.lintTestModules.includes('installLint')) {
      await installDependencies('npm install -d ' + lintDependencies.join(' '))
    }

    return 'needed packages installed'
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (!answers.lintTestModules?.includes('installTest')) {
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
    skip: (answers: Record<string, string[]>) => {
      if (!answers.lintTestModules?.includes('installLint')) {
        return '[SKIPPED] lint setup'
      }
    },
    skipIfExists: true,
    path: '.eslintrc.js',
    templateFile: TEMPLATE_BASE + '/eslintrc.js.hbs',
  },
  async (answers) => {
    if (answers.eventBridge !== 'AmqpEventBridge') {
      return '[SKIPPED] no additional packages required'
    }
    await installDependencies('npm install -s @purista/amqpbridge')

    return '@purista/amqpbridge added'
  },
  {
    type: 'add',
    skip: (answers: Record<string, string[] | string>) => {
      if (answers.eventBridge !== 'AmqpEventBridge') {
        return '[SKIPPED] no additional packages required'
      }
    },
    skipIfExists: true,
    path: 'config/amqpBridgeConfig.ts',
    templateFile: TEMPLATE_BASE + '/config/amqpBridgeConfig.ts.hbs',
  },

  {
    type: 'add',
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
  (_answers) => {
    console.log('')
    console.log('🎉 SUCCESS - PURISTA project ready 🎉')
    console.log('Enjoy building awesome applications with PURISTA 🚀')
    console.log('Now it is time to add your first service!')
    console.log('')
    console.log('➡️  purista add service')
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

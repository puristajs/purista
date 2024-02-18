#!/usr/bin/env node
/* eslint-disable no-console */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import minimist from 'minimist'
import { Plop, run } from 'plop'

import { puristaVersion } from './version.js'

const main = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  if (process.argv.length < 3) {
    console.log('')
    console.log('PURISTA cli')
    console.log('')
    console.log('You need to provide a action you like to perform.')
    console.log('')
    console.log('If you like to install PURISTA in current folder and setup a new project if needed')
    console.log('')
    console.log('⌨️ purista init')
    console.log('')
    console.log('If you like to add a ressource to existing project')
    console.log('')
    console.log('⌨️ purista add [service|command|subscription|version]')
    console.log('')

    process.exit()
  }

  let configPath = ''
  if (process.argv[2] === 'init') {
    configPath = path.join(__dirname, 'installation', 'plopfile.js')
  }
  if (process.argv[2] === 'add') {
    configPath = path.join(__dirname, 'addRessource', 'plopfile.js')
  }

  if (process.argv[2] === 'version') {
    console.log('PURISTA CLI version', puristaVersion)
    process.exit()
  }

  const args = process.argv.slice(3)
  const argv = minimist(args)

  Plop.prepare(
    {
      cwd: process.cwd(), // argv.cwd,
      configPath,
      preload: argv.preload || [],
      completion: argv.completion,
    },
    (env) =>
      Plop.execute(env, (env) => {
        const options = {
          ...env,
          dest: process.cwd(), // this will make the destination path to be based on the cwd when calling the wrapper
        }
        return run(options, undefined, true)
      }),
  )
}

const controller = new AbortController()

const timeoutId = setTimeout(() => controller.abort(), 5000)

fetch('https://registry.npmjs.org/@purista/cli/latest', { signal: controller.signal })
  .then((response) => {
    response
      .json()
      .then((value: Record<string, string>) => {
        if (value.version !== puristaVersion) {
          console.error('🚨 BE AWARE!')
          console.error('Looks like your CLI version is outdated.')
          console.error(`Latest version is ${value.version} - Please upgrade before you proceed!`)
          console.error('')
        } else {
          console.log(`👍 You use latest CLI version ${value.version}`)
        }
      })
      .catch(console.error)
  })
  .finally(main)

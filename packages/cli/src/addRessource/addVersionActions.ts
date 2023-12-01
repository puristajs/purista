/* eslint-disable no-console */
import type { Actions } from 'node-plop'

export const addVersionActions: Actions = [
  (answers) => {
    console.log('')
    console.log('🎉 The new version of ' + answers.service.name + ' is created 🎉')
    console.log('')
    return '📖 Learn more about PURISTA at https://purista.dev'
  },
]

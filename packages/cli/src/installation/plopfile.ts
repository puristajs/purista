import { NodePlopAPI } from 'plop'

import { registerHandlebarHelpers } from '../helper/registerHandlebarHelpers.js'
import { initProjectActions } from './initProjectActions.js'
import { initProjectPrompts } from './initProjectPrompts.js'

export default function (plop: NodePlopAPI) {
  registerHandlebarHelpers(plop)
  plop.setActionType('select action', (answers) => {
    return JSON.stringify(answers)
  })

  plop.setWelcomeMessage('Welcome to PURISTA cli')

  plop.setGenerator('rootMenu', {
    description: 'Init a new project or add PURISTA to current project',
    prompts: initProjectPrompts,
    actions: initProjectActions,
  })
}

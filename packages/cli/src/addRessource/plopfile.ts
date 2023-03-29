import { NodePlopAPI } from 'plop'

import { registerHandlebarHelpers } from '../helper/registerHandlebarHelpers.js'
import { addCommandActions } from './addCommandActions.js'
import { addRessourcePrompts } from './addRessourcePrompts.js'
import { addServiceActions } from './addServiceActions.js'
import { addSubscriptionActions } from './addSubscriptionActions.js'
import { addVersionActions } from './addVersionActions.js'

export default function (plop: NodePlopAPI) {
  registerHandlebarHelpers(plop)
  plop.setActionType('select action', (answers) => {
    return JSON.stringify(answers)
  })

  plop.setWelcomeMessage('Welcome to PURISTA cli')

  plop.setGenerator('rootMenu', {
    description: 'Add a ressource to current PURISTA project',
    prompts: addRessourcePrompts,
    actions: function (answers: any) {
      const actions: any[] = []

      switch (answers.ressource) {
        case 'service':
          actions.push(...(addServiceActions as []))
          break
        case 'command':
          actions.push(...(addCommandActions as []))
          break
        case 'subscription':
          actions.push(...(addSubscriptionActions as []))
          break
        case 'version':
          actions.push(...(addVersionActions as []))
          break
      }

      return actions
    },
  })
}

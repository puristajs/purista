import { CommandFunction } from '@purista/core'
import { randomUUID } from 'crypto'

import { UserService } from '../../UserService'
import { InputParameterType, InputPayloadType, OutputPayloadType } from './schema'

export const signUp: CommandFunction<UserService, InputPayloadType, InputParameterType, OutputPayloadType> =
  async function (log, payload, _parameter, _message) {
    log.debug('sign up new user', payload)

    const uuid = randomUUID()

    return {
      uuid,
    }
  }

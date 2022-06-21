import { CommandFunction } from '../../../core'
import { HttpServerService } from '../..'
import { InputParameterType, InputPayloadType, OutputPayloadType } from './schema'

export const getRoutes: CommandFunction<HttpServerService, InputPayloadType, InputParameterType, OutputPayloadType> =
  async function (log, _payload, _parameter) {
    log.debug('get http routes')
    return this.routeDefinitions
  }

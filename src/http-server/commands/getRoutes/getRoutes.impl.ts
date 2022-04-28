import { CommandFunction } from '../../../core'
import { HttpServerService } from '../..'
import { InputParameterType, InputPayloadType, OutputPayloadType } from './schema'

export const getRoutes: CommandFunction<HttpServerService, InputPayloadType, InputParameterType, OutputPayloadType> =
  async function (_payload, _parameter) {
    this.log.debug('get http routes')
    return this.routeDefinitions
  }

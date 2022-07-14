import { FunctionImplementationType } from './schema'

export const getRoutes: FunctionImplementationType = async function (log, _payload, _parameter) {
  log.debug('get http routes')
  return this.routeDefinitions
}

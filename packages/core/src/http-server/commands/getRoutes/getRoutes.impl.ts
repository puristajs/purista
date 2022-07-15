import { FunctionImplementationType } from './schema'

export const getRoutes: FunctionImplementationType = async function ({ logger }, _payload, _parameter) {
  logger.debug('get http routes')
  return this.routeDefinitions
}

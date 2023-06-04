import { RouterFunction } from '@purista/base-http-bridge'

export const configRoute: RouterFunction = async function (c) {
  const payload = {
    entities: [],
  }

  this.logger.debug('config requested')

  return c.json(payload)
}

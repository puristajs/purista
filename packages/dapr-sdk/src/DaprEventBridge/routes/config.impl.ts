import { RouterFunction } from '@purista/core'

export const configRoute: RouterFunction = async function (c) {
  const payload = {
    entities: [],
  }

  this.logger.debug('config requested')

  return c.json(payload)
}

import { RouterFunction } from '@purista/core'

export const configRoute: RouterFunction = async function (c) {
  const payload = JSON.stringify({})

  this.logger.debug('config requested')

  return c.json(payload)
}

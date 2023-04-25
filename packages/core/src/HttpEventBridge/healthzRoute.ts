import { StatusCode } from '../core'
import { RouterFunction } from './types'

export const healthzRoute: RouterFunction = async function (c) {
  const isHealthy = await this.isHealthy()
  if (isHealthy) {
    return c.json({ message: 'ok', status: 200 })
  }
  this.logger.error('health not ok')
  return c.json({ status: StatusCode.InternalServerError, message: 'not ok' }, StatusCode.InternalServerError)
}

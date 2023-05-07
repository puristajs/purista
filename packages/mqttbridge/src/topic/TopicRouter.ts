import { initLogger, Logger } from '@purista/core'

import { IncomingMessageFunction } from '../types'
import { isMatchingTopic } from './isMatchingTopic.impl'

export class TopicRouter {
  routes = new Map<number, { topic: string; fn: IncomingMessageFunction }>()
  logger: Logger

  counter = 1

  constructor(logger?: Logger) {
    const log = logger || initLogger()
    this.logger = log.getChildLogger({ name: 'TopicRouter' })
  }

  add(topic: string, fn: IncomingMessageFunction) {
    this.counter++
    this.routes.set(this.counter, { topic, fn })

    this.logger.debug({ topic, count: this.counter }, 'topic added')
    return this.counter
  }

  remove(topic: string | number) {
    if (typeof topic === 'number') {
      this.routes.delete(topic)
    }
  }

  match(topic: string, id?: number): IncomingMessageFunction[] {
    const handler: IncomingMessageFunction[] = []

    if (id) {
      const entry = this.routes.get(id)
      if (entry) {
        handler.push(entry.fn)
      }
      return handler
    }

    this.routes.forEach((entry) => {
      if (isMatchingTopic(topic, entry.topic)) {
        handler.push(entry.fn)
      }
    })

    return handler
  }
}

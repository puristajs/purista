import type { Msg, NatsError } from 'nats'

import type { INatsBridge } from './INatsBridge.js'

export type IncomingMessageFunction = (this: INatsBridge, error: NatsError | null, msg: Msg) => Promise<void>

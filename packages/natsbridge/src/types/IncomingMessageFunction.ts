import { Msg, NatsError } from 'nats'

import { NatsBridge } from '../NatsBridge'

export type IncomingMessageFunction = (this: NatsBridge, error: NatsError | null, msg: Msg) => Promise<void>

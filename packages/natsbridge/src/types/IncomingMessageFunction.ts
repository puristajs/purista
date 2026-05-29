import type { JsMsg, Msg, NatsError } from 'nats'

import type { INatsBridge } from './INatsBridge.js'

/**
 * NATS message handler bound to an {@link INatsBridge} instance.
 *
 * The `msg` argument can be a core NATS message or a JetStream message. When
 * JetStream is used, thrown errors drive broker ack/nak/term behavior in the
 * bridge.
 */
export type IncomingMessageFunction = (this: INatsBridge, error: NatsError | null, msg: Msg | JsMsg) => Promise<void>

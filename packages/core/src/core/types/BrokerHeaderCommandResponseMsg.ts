import type { BrokerHeaderCommandMsg } from './BrokerHeaderCommandMsg.js'
import type { InstanceId } from './InstanceId.js'
import type { Prettify } from './Prettify.js'

export type BrokerHeaderCommandResponseMsg = Prettify<
  BrokerHeaderCommandMsg & {
    receiverInstanceId: InstanceId
  }
>

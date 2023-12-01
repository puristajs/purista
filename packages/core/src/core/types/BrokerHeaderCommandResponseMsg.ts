import type { BrokerHeaderCommandMsg } from './BrokerHeaderCommandMsg'
import type { InstanceId } from './InstanceId'
import type { Prettify } from './Prettify'

export type BrokerHeaderCommandResponseMsg = Prettify<
  BrokerHeaderCommandMsg & {
    receiverInstanceId: InstanceId
  }
>

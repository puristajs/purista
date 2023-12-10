import type { BrokerHeaderCustomMsg } from './BrokerHeaderCustomMsg.js'
import type { InstanceId } from './InstanceId.js'
import type { Prettify } from './Prettify.js'

export type BrokerHeaderCommandMsg = Prettify<
  BrokerHeaderCustomMsg & {
    receiverServiceName: string
    receiverServiceVersion: string
    receiverServiceTarget: string
    receiverInstanceId?: InstanceId
  }
>

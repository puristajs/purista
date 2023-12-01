import type { BrokerHeaderCustomMsg } from './BrokerHeaderCustomMsg'
import type { InstanceId } from './InstanceId'
import type { Prettify } from './Prettify'

export type BrokerHeaderCommandMsg = Prettify<
  BrokerHeaderCustomMsg & {
    receiverServiceName: string
    receiverServiceVersion: string
    receiverServiceTarget: string
    receiverInstanceId?: InstanceId
  }
>

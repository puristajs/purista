import { BrokerHeaderCustomMsg } from './BrokerHeaderCustomMsg'
import { InstanceId } from './InstanceId'
import { Prettify } from './Prettify'

export type BrokerHeaderCommandMsg = Prettify<
  BrokerHeaderCustomMsg & {
    receiverServiceName: string
    receiverServiceVersion: string
    receiverServiceTarget: string
    receiverInstanceId?: InstanceId
  }
>

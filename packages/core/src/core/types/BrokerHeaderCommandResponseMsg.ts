import { BrokerHeaderCommandMsg } from './BrokerHeaderCommandMsg'
import { InstanceId } from './InstanceId'
import { Prettify } from './Prettify'

export type BrokerHeaderCommandResponseMsg = Prettify<
  BrokerHeaderCommandMsg & {
    receiverInstanceId: InstanceId
  }
>

import type { EBMessageType } from '../EBMessageType.enum'
import { Prettify } from '../Prettify'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceDrain = Prettify<
  {
    messageType: EBMessageType.InfoServiceDrain
  } & InfoServiceBase
>

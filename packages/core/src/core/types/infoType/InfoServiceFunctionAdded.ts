import { EBMessageType } from '../EBMessageType.enum'
import { Prettify } from '../Prettify'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceFunctionAdded = Prettify<
  {
    messageType: EBMessageType.InfoServiceFunctionAdded
  } & InfoServiceBase
>

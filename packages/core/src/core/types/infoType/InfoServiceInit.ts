import type { EBMessageType } from '../EBMessageType.enum'
import type { Prettify } from '../Prettify'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceInit = Prettify<
  {
    messageType: EBMessageType.InfoServiceInit
  } & InfoServiceBase
>

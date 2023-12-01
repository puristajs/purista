import type { EBMessageType } from '../EBMessageType.enum'
import type { Prettify } from '../Prettify'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceShutdown = Prettify<
  {
    messageType: EBMessageType.InfoServiceShutdown
  } & InfoServiceBase
>

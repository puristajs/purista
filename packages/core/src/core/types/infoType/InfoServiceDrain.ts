import type { EBMessageType } from '../EBMessageType.enum.js'
import type { Prettify } from '../Prettify.js'
import type { InfoServiceBase } from './InfoServiceBase.js'

export type InfoServiceDrain = Prettify<
	{
		messageType: EBMessageType.InfoServiceDrain
	} & InfoServiceBase
>

import type { EBMessageBase } from '../EBMessageBase.js'
import type { Prettify } from '../Prettify.js'

export type InfoServiceBase = Prettify<
	{
		contentType: 'application/json'
		contentEncoding: 'utf-8'
		payload?: unknown
	} & EBMessageBase
>

import type { EBMessageAddress } from './EBMessageAddress.js'
import type { EmptyObject } from './EmptyObject.js'
import type { StreamHandle } from './stream/StreamHandle.js'

export type OpenStreamFunction = <
	Chunk = unknown,
	Final = unknown,
	PayloadType = unknown,
	ParameterType extends EmptyObject = EmptyObject,
>(
	address: EBMessageAddress,
	payload: PayloadType,
	parameter: ParameterType,
) => Promise<StreamHandle<Chunk, Final>>

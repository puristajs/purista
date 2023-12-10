import type { EBMessageAddress } from './EBMessageAddress.js'
import type { Prettify } from './Prettify.js'

/**
 * A event bridge message address describes the sender or receiver of a message.
 */
export type EBMessageSenderAddress = Prettify<
  Omit<EBMessageAddress, 'instanceId'> & Required<Pick<EBMessageAddress, 'instanceId'>>
>

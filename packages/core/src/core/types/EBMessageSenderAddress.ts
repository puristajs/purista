import { EBMessageAddress } from './EBMessageAddress'
import { Prettify } from './Prettify'

/**
 * A event bridge message address describes the sender or receiver of a message.
 */
export type EBMessageSenderAddress = Prettify<
  Omit<EBMessageAddress, 'instanceId'> & Required<Pick<EBMessageAddress, 'instanceId'>>
>

/**
 * A event bridge message address describes the sender or receiver of a message.
 */
export type EBMessageAddress = {
  serviceName: string
  serviceVersion: string
  serviceTarget: string
}

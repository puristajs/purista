/**
 * A event bridge message address describes receiver/sender of a message.
 */
export type EBMessageAddress = {
  serviceName: string
  serviceVersion: string
  serviceTarget: string
}

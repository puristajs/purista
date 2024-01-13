/**
 * General service information
 */
export type ServiceInfoType = {
  serviceName: Exclude<string, ''>
  serviceVersion: Exclude<string, ''>
  serviceDescription: string
}

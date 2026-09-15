import { z } from 'zod'

export const monitoringServiceV1ConfigSchema = z.object({})

export type MonitoringServiceV1Config = z.input<typeof monitoringServiceV1ConfigSchema>

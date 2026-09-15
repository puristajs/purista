import { z } from 'zod'

export const reportingServiceV1ConfigSchema = z.object({})

export type ReportingServiceV1Config = z.input<typeof reportingServiceV1ConfigSchema>

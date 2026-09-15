import type { z } from 'zod'
import type {
	monitoringV1ObserveLargeDebitInputParameterSchema,
	monitoringV1ObserveLargeDebitInputPayloadSchema,
} from './schema.js'

export type MonitoringV1ObserveLargeDebitInputParameter = z.input<
	typeof monitoringV1ObserveLargeDebitInputParameterSchema
>
export type MonitoringV1ObserveLargeDebitInputPayload = z.input<
	typeof monitoringV1ObserveLargeDebitInputPayloadSchema
>
